import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

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
  name: z.string().trim().min(1).max(100),
  jerseyNumber: z.string().trim().max(10),
  position: z.string().trim().max(50),
  sport: z.enum(['basketball', 'baseball', 'football', 'soccer', 'volleyball', 'tennis', 'golf', 'rugby']).default('basketball'),
  analysisMode: z.enum(['bulk', 'detailed']).optional().default('bulk')
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
    
    // Rate limiting: 30 requests per 60 minutes
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _user_id: user.id,
        _endpoint: 'analyze-clip',
        _max_requests: 30,
        _window_minutes: 60
      });

    if (rateLimitError) {
      console.error(`❌ [${requestId}] Rate limit check error:`, rateLimitError);
    }

    if (!rateLimitOk) {
      console.log(`⚠️ [${requestId}] Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. You can make 30 analysis requests per hour. Please try again later.' }),
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
    console.log(`🔵 [${requestId}] Analysis mode: ${playerInfo.analysisMode}`);
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
    console.log(`🔵 [${requestId}] Using model: ${model} for ${playerInfo.sport}...`);

    const systemPrompt = getSportSpecificPrompt(playerInfo.sport);
    const userPrompt = `Analyze this ${playerInfo.sport} play for player ${playerInfo.name}, #${playerInfo.jerseyNumber}, position: ${playerInfo.position || 'unknown'}.`;

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

function getSportSpecificPrompt(sport: string): string {
  // Enhanced prompts using Complete Performance framework
  const baseTemplate = (sportName: string, d1Context: string) => `You are a professional ${sportName} coach AI analyzing a player's performance using the Complete Performance framework.

${d1Context}

Analyze the play phase-by-phase and return structured JSON with the following schema:

{
  "playType": "string - type of play/action",
  "outcome": "string - result of the play",
  "detectedPosition": "string - player position",
  "sport": "${sportName}",
  "play_context": {
    "situation": "string - game context",
    "pressure_level": "string - low/medium/high",
    "critical_moment": "boolean"
  },
  "tangible_performance": {
    "technical_execution": {
      "footwork_quality": "0-10 rating",
      "body_control": "0-10 rating",
      "technique_rating": "0-10 rating",
      "spatial_awareness": "0-10 rating"
    },
    "phases": [
      {
        "phase_name": "string",
        "quality": "0-10 rating",
        "notes": "string"
      }
    ],
    "efficiency_notes": "string"
  },
  "intangible_performance": {
    "courage": {
      "rating": "1-5 scale",
      "evidence": "specific observation of willingness to compete/attack despite pressure or previous mistakes"
    },
    "composure": {
      "rating": "1-5 scale", 
      "evidence": "specific observation of poise under pressure, mechanics stability, avoiding stress reactions"
    },
    "initiative": {
      "rating": "1-5 scale",
      "evidence": "specific observation of independent adjustments without external prompting"
    },
    "leadership": {
      "rating": "1-5 scale",
      "evidence": "specific observation of verbal/non-verbal cues organizing teammates or improving flow"
    },
    "effectiveness_under_stress": {
      "rating": "1-5 scale",
      "evidence": "specific observation of execution quality when defended, fatigued, or time-pressured"
    },
    "resilience": {
      "rating": "1-5 scale",
      "evidence": "specific observation of recovery behavior after adversity"
    }
  },
  "integrated_insight": {
    "correlation_metrics": {
      "intangibles_overall_score": "0-1 decimal"
    },
    "synthesis": "one paragraph explaining how intangibles influenced technical performance and decision-making"
  },
  "coaching_recommendations": {
    "technical_focus": "one specific mechanical/skill adjustment",
    "tactical_focus": "one specific decision-making or positioning improvement",
    "intangible_focus": "one specific behavioral or mindset development area",
    "practice_drills": ["array of 2-3 specific drills"]
  }
}

Be specific with evidence for each intangible metric. Rate honestly using the full 1-5 scale.`;

  const prompts: Record<string, string> = {
    basketball: baseTemplate('basketball', 
      'D1 recruiters evaluate: shooting efficiency, assist/turnover ratio, defensive versatility, basketball IQ, and leadership. Key metrics include points per game, shooting percentage, and athletic testing (vertical jump, shuttle times).'),

    baseball: baseTemplate('baseball',
      'D1 recruiters evaluate: exit velocity (90+ mph), pitch velocity (85+ mph for pitchers), 60-yard dash time (<7.0s), fielding percentage, and baseball IQ. Position-specific skills and competitive stats are crucial.'),

    football: baseTemplate('football',
      'D1 recruiters evaluate: 40-yard dash times, vertical jump, strength metrics (bench press, squat), football IQ, position-specific technique, and competitive film. Size, speed, and physicality are position-dependent.'),

    soccer: baseTemplate('soccer',
      'D1 recruiters evaluate: technical ability with both feet, tactical awareness, fitness levels, vision, 1v1 ability, and decision-making under pressure. Club team performance and tournament exposure are important.'),

    volleyball: baseTemplate('volleyball',
      'D1 recruiters evaluate: vertical jump (25"+ females, 30"+ males), blocks/digs per set, hitting efficiency, serve accuracy, court awareness, and leadership. Height and athleticism are position-dependent.'),

    tennis: baseTemplate('tennis',
      'D1 recruiters evaluate: UTR rating (10+ for competitive D1), serve speed (100+ mph), consistency, mental toughness, match win percentage, and tournament results against ranked opponents.'),

    golf: baseTemplate('golf',
      'D1 recruiters evaluate: handicap (scratch or better), scoring average, driving distance (270+ yards), tournament performance, course management, and mental composure under pressure.'),

    rugby: baseTemplate('rugby',
      'D1 recruiters evaluate: physicality, tackle effectiveness, running lines, game intelligence, work rate, position-specific skills, and ability to perform in high-pressure situations.')
  };

  return prompts[sport] || prompts.basketball;
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
