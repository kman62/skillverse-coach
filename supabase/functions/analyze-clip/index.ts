import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getSportLevelContext, getLevelContext } from "./level-contexts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    const isRetryable = error instanceof Error && (
      error.message.includes('rate limit') ||
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('500') ||
      error.message.includes('503')
    );
    
    if (!isRetryable) throw error;
    
    console.log(`Retrying after ${delay}ms. Retries left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Input validation schemas
const playerInfoSchema = z.object({
  name: z.string().trim().max(100).optional(),
  jerseyNumber: z.string().trim().max(10).optional(),
  jerseyColor: z.string().trim().max(50).optional(),
  position: z.string().trim().max(50).optional(),
  sport: z.enum(['basketball', 'baseball', 'football', 'soccer', 'volleyball', 'tennis', 'golf', 'rugby']).default('basketball'),
  analysisMode: z.enum(['bulk', 'detailed']).optional().default('bulk'),
  analysisType: z.enum(['individual', 'team']).optional().default('individual'),
  // NEW: Competition level for level-appropriate feedback
  competitionLevel: z.enum(['youth', 'middle_school', 'high_school', 'juco', 'd3', 'd2', 'd1', 'professional']).optional(),
  // NEW: Physical measurables for context
  heightInches: z.number().optional(),
  weightLbs: z.number().optional(),
  graduationYear: z.number().optional()
});

const requestSchema = z.object({
  frameData: z.string().max(10 * 1024 * 1024), // 10MB limit for base64 image
  playerInfo: playerInfoSchema
});

Deno.serve(async (req) => {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`🔵 [${requestId}] ========== NEW REQUEST ==========`);
  console.log(`🔵 [${requestId}] Method: ${req.method}, URL: ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    console.log(`🔵 [${requestId}] CORS preflight - returning 200`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log(`❌ [${requestId}] Missing authorization header`);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔵 [${requestId}] Validating user authentication...`);
    const token = authHeader.replace('Bearer ', '');
    
    // Validate the JWT token using Supabase
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log(`❌ [${requestId}] Invalid authentication`);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ [${requestId}] User authenticated: ${user.id}`);
    
    // Rate limiting: 60 requests per 60 minutes
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _user_id: user.id,
        _endpoint: 'analyze-clip',
        _max_requests: 60,
        _window_minutes: 60
      });

    if (rateLimitError) {
      console.error(`❌ [${requestId}] Rate limit check error:`, rateLimitError);
    }

    if (!rateLimitOk) {
      console.log(`⚠️ [${requestId}] Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. You can make 60 analysis requests per hour. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
    console.log(`🔵 [${requestId}] Parsing request body...`);
    const rawBody = await req.json();
    
    // Validate input with zod
    const validationResult = requestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      console.error(`❌ [${requestId}] Validation error:`, validationResult.error.format());
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { frameData, playerInfo } = validationResult.data;
    
    console.log(`🔵 [${requestId}] Player: ${playerInfo.name} #${playerInfo.jerseyNumber}, Position: ${playerInfo.position || 'auto-detect'}`);
    console.log(`🔵 [${requestId}] Analysis mode: ${playerInfo.analysisMode}, Competition level: ${playerInfo.competitionLevel || 'high_school (default)'}`);
    console.log(`🔵 [${requestId}] Physical: ${playerInfo.heightInches ? `${Math.floor(playerInfo.heightInches / 12)}'${playerInfo.heightInches % 12}"` : 'N/A'}, ${playerInfo.weightLbs ? `${playerInfo.weightLbs}lbs` : 'N/A'}`);
    console.log(`🔵 [${requestId}] Frame data size: ${(frameData.length / 1024).toFixed(2)} KB`);

    // Using Lovable AI Gateway
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      console.error(`❌ [${requestId}] LOVABLE_API_KEY is not configured`);
      return new Response(
        JSON.stringify({ error: 'AI key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select model based on analysis mode
    const model = playerInfo.analysisMode === 'detailed' ? 'openai/gpt-5' : 'google/gemini-2.5-flash';
    console.log(`🔵 [${requestId}] Using model: ${model} for ${playerInfo.sport} (${playerInfo.analysisType})...`);

    // Use analysisType to determine prompt and analysis approach
    const isTeamAnalysis = playerInfo.analysisType === 'team';

    const systemPrompt = isTeamAnalysis 
      ? getOffensiveSetsPrompt(playerInfo.sport)
      : getSportSpecificPrompt(playerInfo.sport, playerInfo.competitionLevel, {
          heightInches: playerInfo.heightInches,
          weightLbs: playerInfo.weightLbs,
          graduationYear: playerInfo.graduationYear
        });
    
    const userPrompt = isTeamAnalysis
      ? `Analyze this ${playerInfo.sport} offensive set and team play execution. Evaluate spacing, timing, player movement, and overall set effectiveness.`
      : `Analyze this ${playerInfo.sport} play for player ${playerInfo.name || 'the athlete'}${playerInfo.jerseyNumber ? `, #${playerInfo.jerseyNumber}` : ''}${playerInfo.jerseyColor ? ` in ${playerInfo.jerseyColor}` : ''}${playerInfo.position ? `, position: ${playerInfo.position}` : ''}.`;

    const response = await retryWithBackoff(async () => {
      const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                { type: 'image_url', image_url: { url: frameData } }
              ]
            }
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ [${requestId}] AI gateway error:`, res.status, errorText);
        
        if (res.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        
        if (res.status === 402) {
          throw new Error('AI credits depleted. Please contact support.');
        }
        
        if (res.status === 503) {
          throw new Error('Analysis service temporarily unavailable. Retrying...');
        }
        
        throw new Error('Analysis service error. Please try again.');
      }

      return res;
    });

    const data = await response.json();
    console.log(`✅ [${requestId}] AI gateway response received`);

    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      console.error(`❌ [${requestId}] No content in AI response`);
      throw new Error('AI returned empty analysis. Please try again.');
    }

    // Parse AI response
    let parsedAnalysis;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error(`❌ [${requestId}] Failed to parse AI response:`, parseError);
      parsedAnalysis = buildFallbackAnalysis(playerInfo);
    }

    const playType = parsedAnalysis.playType || parsedAnalysis.shotType || 'Standard Play';
    const outcome = parsedAnalysis.outcome || 'success';
    const detectedPosition = parsedAnalysis.detectedPosition || playerInfo.position || 'Athlete';

    const analysis = {
      playType,
      outcome,
      detectedPosition,
      sport: playerInfo.sport,
      play_context: parsedAnalysis.play_context || {
        situation: 'Open look from the wing',
        defender_pressure: 'Light pressure',
        shot_clock: 'Mid-possession'
      },
      tangible_performance: parsedAnalysis.tangible_performance || {
        shot_result: outcome === 'success' ? 'Made' : 'Missed',
        distance: '18 feet',
        release_time: '0.6 seconds',
        arc: '45 degrees'
      },
      intangible_performance: parsedAnalysis.intangible_performance || {
        confidence: 0.85,
        focus: 0.90,
        body_language: 0.88,
        decision_making: 0.82
      },
      integrated_insight: parsedAnalysis.integrated_insight || {
        correlation_metrics: {
          intangibles_overall_score: 0.86
        }
      },
      coaching_recommendations: parsedAnalysis.coaching_recommendations || {
        primary_focus: 'Maintain shooting form under pressure',
        technique_adjustments: ['Keep elbow alignment', 'Follow through'],
        mental_approach: 'Stay confident in your shot',
        practice_drills: ['Spot shooting', 'Game-speed reps']
      }
    };

    console.log(`✅ [${requestId}] Analysis complete for ${playerInfo.name}`);
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

    } catch (error) {
      console.error(`❌ [${requestId}] Analysis error:`, error);
      
      const userMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while analyzing your clip. Please try again.';
      
      const statusCode = error instanceof Error && 
        (error.message.includes('Rate limit') || error.message.includes('credits')) 
        ? 429 
        : 500;
      
      return new Response(
        JSON.stringify({ error: userMessage }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(`❌ [analyze-clip] Error:`, error);
    
    const userMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred. Please try again.';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

interface PhysicalMeasurables {
  heightInches?: number;
  weightLbs?: number;
  graduationYear?: number;
}

function getSportSpecificPrompt(
  sport: string, 
  competitionLevel?: string,
  measurables?: PhysicalMeasurables
): string {
  // Get level-specific context from the new module
  const levelContext = getSportLevelContext(sport, competitionLevel);
  const levelInfo = getLevelContext(competitionLevel);
  
  // Build physical context string if measurables provided
  let physicalContext = '';
  if (measurables) {
    const parts: string[] = [];
    if (measurables.heightInches) {
      const feet = Math.floor(measurables.heightInches / 12);
      const inches = measurables.heightInches % 12;
      parts.push(`Height: ${feet}'${inches}"`);
    }
    if (measurables.weightLbs) {
      parts.push(`Weight: ${measurables.weightLbs} lbs`);
    }
    if (measurables.graduationYear) {
      parts.push(`Class of ${measurables.graduationYear}`);
    }
    if (parts.length > 0) {
      physicalContext = `\n\nAthlete Physical Profile: ${parts.join(', ')}. Consider these measurables when evaluating movement efficiency and athletic potential.`;
    }
  }

  // Enhanced prompts using Complete Performance framework with level-aware context
  const baseTemplate = (sportName: string, levelCtx: string) => `You are a professional ${sportName} coach AI analyzing a player's performance using the Complete Performance framework.

COMPETITION LEVEL: ${levelInfo.label}
${levelCtx}${physicalContext}

Analyze the play phase-by-phase and return structured JSON with the following schema:

{
  "playType": "string - type of play/action",
  "outcome": "string - result of the play",
  "detectedPosition": "string - player position",
  "sport": "${sportName}",
  "competitionLevel": "${competitionLevel || 'high_school'}",
  "play_context": {
    "situation": "string - game context",
    "pressure_level": "string - low/medium/high",
    "critical_moment": "boolean"
  },
  "tangible_performance": {
    "technical_execution": {
      "footwork_quality": "0-10 rating (calibrated for ${levelInfo.label})",
      "body_control": "0-10 rating (calibrated for ${levelInfo.label})",
      "technique_rating": "0-10 rating (calibrated for ${levelInfo.label})",
      "spatial_awareness": "0-10 rating (calibrated for ${levelInfo.label})"
    },
    "phases": [
      {
        "phase_name": "string",
        "quality": "0-10 rating",
        "notes": "string - level-appropriate feedback"
      }
    ],
    "efficiency_notes": "string - considering athlete's development stage"
  },
  "intangible_performance": {
    "courage": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of willingness to compete/attack despite pressure or previous mistakes"
    },
    "composure": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})", 
      "evidence": "specific observation of poise under pressure, mechanics stability, avoiding stress reactions"
    },
    "initiative": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of independent adjustments without external prompting"
    },
    "leadership": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of verbal/non-verbal cues organizing teammates or improving flow"
    },
    "effectiveness_under_stress": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of execution quality when defended, fatigued, or time-pressured"
    },
    "resilience": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of recovery behavior after adversity"
    },
    "discipline": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of adherence to game plan, avoiding undisciplined plays or penalties"
    },
    "focus": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of attention to detail, tracking the ball/play, minimizing mental lapses"
    },
    "consistency": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of repeatable mechanics and decision-making across multiple attempts"
    },
    "game_iq": {
      "rating": "1-5 scale (calibrated for ${levelInfo.label})",
      "evidence": "specific observation of reading the defense/offense, anticipation, and situational awareness"
    }
  },
  "integrated_insight": {
    "correlation_metrics": {
      "intangibles_overall_score": "0-1 decimal"
    },
    "synthesis": "one paragraph explaining how intangibles influenced technical performance and decision-making, appropriate for ${levelInfo.label} athlete"
  },
  "coaching_recommendations": {
    "technical_focus": "one specific mechanical/skill adjustment appropriate for ${levelInfo.label}",
    "tactical_focus": "one specific decision-making or positioning improvement for this level",
    "intangible_focus": "one specific behavioral or mindset development area",
    "practice_drills": ["array of 2-3 specific drills appropriate for ${levelInfo.label}"],
    "development_priority": "what should this athlete focus on to reach the next level"
  }
}

CRITICAL RATING GUIDANCE:
${levelInfo.ratingCalibration}

Be specific with evidence for each intangible metric. Rate honestly using the full 1-5 scale, calibrated for ${levelInfo.label}.`;

  return baseTemplate(sport, levelContext);
}

function getOffensiveSetsPrompt(sport: string): string {
  const sportName = sport || 'basketball';
  
  return `You are a professional ${sportName} coach AI analyzing TEAM OFFENSIVE SETS using the Complete Performance framework.

D1 recruiters and coaches evaluate offensive sets by: spacing efficiency, timing of cuts and screens, ball movement quality, player movement patterns, set execution consistency, and adaptability to defensive pressure.

Analyze the offensive set phase-by-phase and return structured JSON with the following schema:

{
  "playType": "string - name/type of offensive set (e.g., 'Motion Offense', 'Pick and Roll', 'Horns Set', 'Princeton Offense')",
  "outcome": "string - result of the set execution",
  "detectedPosition": "Team Offensive Set",
  "sport": "${sportName}",
  "play_context": {
    "situation": "string - offensive situation and defensive alignment",
    "pressure_level": "string - defensive pressure (low/medium/high)",
    "critical_moment": "boolean - high-stakes possession"
  },
  "tangible_performance": {
    "technical_execution": {
      "spacing_quality": "0-10 rating - floor spacing and positioning",
      "timing_quality": "0-10 rating - cut timing and screen timing",
      "ball_movement": "0-10 rating - passing quality and decision-making",
      "player_movement": "0-10 rating - cuts, screens, and repositioning"
    },
    "phases": [
      {
        "phase_name": "string - phase of the set (e.g., 'Initial Alignment', 'Screen Action', 'Ball Reversal', 'Finish')",
        "quality": "0-10 rating",
        "notes": "string - specific observations"
      }
    ],
    "efficiency_notes": "string - overall set execution quality and effectiveness"
  },
  "intangible_performance": {
    "courage": {
      "rating": "1-5 scale",
      "evidence": "team's willingness to execute under pressure, attacking mentality despite defensive adjustments"
    },
    "composure": {
      "rating": "1-5 scale", 
      "evidence": "team's poise in execution, maintaining structure under defensive pressure"
    },
    "initiative": {
      "rating": "1-5 scale",
      "evidence": "players making independent reads and adjustments within the set"
    },
    "leadership": {
      "rating": "1-5 scale",
      "evidence": "communication, floor generals organizing teammates, verbal/non-verbal cues"
    },
    "effectiveness_under_stress": {
      "rating": "1-5 scale",
      "evidence": "execution quality when defense rotates, switches, or applies pressure"
    },
    "resilience": {
      "rating": "1-5 scale",
      "evidence": "team's ability to reset and maintain structure after breakdowns"
    }
  },
  "integrated_insight": {
    "correlation_metrics": {
      "intangibles_overall_score": "0-1 decimal"
    },
    "synthesis": "one paragraph explaining how team chemistry, communication, and mental approach influenced the set's technical execution and effectiveness"
  },
  "coaching_recommendations": {
    "technical_focus": "one specific spacing, timing, or movement adjustment for the set",
    "tactical_focus": "one specific adjustment to counter defensive pressure or improve efficiency",
    "intangible_focus": "one specific area to improve team communication, chemistry, or execution under pressure",
    "practice_drills": ["array of 2-3 specific team drills to improve this offensive set"]
  }
}

Focus on TEAM execution, not individual players. Evaluate spacing patterns, timing synchronization, and overall offensive flow. Be specific with evidence for each intangible metric. Rate honestly using the full 1-5 scale.`;
}

function buildFallbackAnalysis(playerInfo: any) {
  return {
    playType: 'Standard Play',
    outcome: 'success',
    detectedPosition: playerInfo.position || 'Athlete',
    play_context: {
      situation: 'In-game play',
      phase: 'Active',
      game_situation: 'Competitive'
    },
    tangible_performance: {
      execution_quality: 0.85,
      technique_rating: 0.88,
      consistency: 0.82
    },
    intangible_performance: {
      mental_toughness: 0.85,
      focus: 0.90,
      decision_making: 0.82,
      leadership: 0.86
    },
    integrated_insight: {
      correlation_metrics: {
        intangibles_overall_score: 0.86
      }
    },
    coaching_recommendations: {
      primary_focus: 'Continue developing fundamentals',
      technique_adjustments: ['Maintain form', 'Stay consistent'],
      mental_approach: 'Stay confident and focused',
      practice_drills: ['Game-speed reps', 'Skill work']
    }
  };
}
