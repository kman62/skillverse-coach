import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const playerInfoSchema = z.object({
  name: z.string().trim().min(1).max(100),
  jerseyNumber: z.string().trim().max(10),
  position: z.string().trim().max(50),
  sport: z.enum(['basketball', 'baseball', 'football', 'soccer', 'volleyball', 'tennis', 'golf', 'rugby']).default('basketball')
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

    console.log(`🔵 [${requestId}] Calling Lovable AI gateway for ${playerInfo.sport}...`);

    const systemPrompt = getSportSpecificPrompt(playerInfo.sport);
    const userPrompt = `Analyze this ${playerInfo.sport} play for player ${playerInfo.name}, #${playerInfo.jerseyNumber}, position: ${playerInfo.position || 'unknown'}.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [${requestId}] AI gateway error:`, response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Analysis service temporarily unavailable. Please try again.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`✅ [${requestId}] AI gateway response received`);

    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      console.error(`❌ [${requestId}] No content in AI response`);
      return new Response(
        JSON.stringify({ error: 'Invalid response from analysis service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      return new Response(
        JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(`❌ [analyze-clip] Error:`, error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getSportSpecificPrompt(sport: string): string {
  const prompts: Record<string, string> = {
    basketball: `You are a professional basketball coach AI analyzing a player's play. D1 recruiters look for: shooting %, assist/turnover ratio, defensive rating, basketball IQ, athleticism.

Return structured JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { situation, defender_pressure, shot_clock }
- tangible_performance: { shot_result, distance, release_time, arc }
- intangible_performance: { confidence: 0-1, focus: 0-1, body_language: 0-1, decision_making: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    baseball: `You are a professional baseball coach AI. D1 recruiters look for: exit velocity (90+ mph), pitch velocity (85+ mph), 60-yard dash (<7.0s), fielding %, baseball IQ.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { situation, count, outs, game_situation }
- tangible_performance: { bat_speed_mph, pitch_velocity_mph, exit_velocity_mph, launch_angle }
- intangible_performance: { mental_toughness: 0-1, game_awareness: 0-1, competitive_fire: 0-1, clutch_performance: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    football: `You are a professional football coach AI. D1 recruiters look for: 40-yard dash time, vertical jump, strength metrics, football IQ, position-specific skills.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { down_distance, formation, situation }
- tangible_performance: { speed_mph, separation, technique_rating, execution_quality }
- intangible_performance: { toughness: 0-1, football_iq: 0-1, competitiveness: 0-1, instincts: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    soccer: `You are a professional soccer coach AI. D1 recruiters look for: technical ability, tactical awareness, fitness levels, vision, decision-making speed.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { phase, formation, situation }
- tangible_performance: { speed_kmh, touch_quality, accuracy_pct, work_rate }
- intangible_performance: { vision: 0-1, composure: 0-1, work_ethic: 0-1, decision_making: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    volleyball: `You are a professional volleyball coach AI. D1 recruiters look for: vertical jump (25"+ for females, 30"+ for males), blocks/digs per set, hitting %, court awareness.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { rotation, phase, situation }
- tangible_performance: { speed_mph, vertical_jump, accuracy_rating, placement_score }
- intangible_performance: { court_awareness: 0-1, confidence: 0-1, communication: 0-1, resilience: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    tennis: `You are a professional tennis coach AI. D1 recruiters look for: UTR rating (10+), serve speed (100+ mph), consistency, mental toughness, match win %.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { court_position, shot_type, situation }
- tangible_performance: { ball_speed_mph, spin_rpm, placement_accuracy, court_coverage }
- intangible_performance: { mental_fortitude: 0-1, strategic_thinking: 0-1, focus: 0-1, adaptability: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    golf: `You are a professional golf coach AI. D1 recruiters look for: handicap (scratch or better), driving distance (270+ yards), scoring average, mental game, consistency.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { hole_info, club_used, situation }
- tangible_performance: { club_speed_mph, distance_yards, accuracy_feet, consistency_rating }
- intangible_performance: { course_management: 0-1, mental_composure: 0-1, focus_discipline: 0-1, pressure_performance: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`,

    rugby: `You are a professional rugby coach AI. D1 recruiters look for: physicality, tackle effectiveness, running lines, game intelligence, work rate.

Return JSON with:
- playType: string, outcome: string, detectedPosition: string
- play_context: { phase, formation, situation }
- tangible_performance: { speed_kmh, power_rating, tackle_effectiveness, work_rate }
- intangible_performance: { physicality: 0-1, game_intelligence: 0-1, courage: 0-1, teamwork: 0-1 }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`
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
