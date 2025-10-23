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
  position: z.string().trim().max(50)
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

    console.log(`🔵 [${requestId}] Calling Lovable AI gateway...`);

    const systemPrompt = `You are a professional basketball coach AI analyzing a player's shot. Provide detailed analysis based on the image provided. 

Return structured JSON with:
- shotType: string (type of shot detected)
- outcome: string ("success" or "miss")
- detectedPosition: string (inferred position based on shot mechanics)
- play_context: { situation, defender_pressure, shot_clock }
- tangible_performance: { shot_result, distance, release_time, arc }
- intangible_performance: { confidence, focus, body_language, decision_making }
- integrated_insight: { correlation_metrics: { intangibles_overall_score: number 0-1 }}
- coaching_recommendations: { primary_focus, technique_adjustments, mental_approach, practice_drills }`;

    const userPrompt = `Analyze this basketball shot for player ${playerInfo.name}, #${playerInfo.jerseyNumber}, position: ${playerInfo.position || 'unknown'}.`;

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

    const shotType = parsedAnalysis.shotType || 'Jump Shot';
    const outcome = parsedAnalysis.outcome || 'success';
    const detectedPosition = parsedAnalysis.detectedPosition || playerInfo.position || 'Guard';

    const analysis = {
      shotType,
      outcome,
      detectedPosition,
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
    console.error(`❌ [analyze-clip] Error:`, error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildFallbackAnalysis(playerInfo: any) {
  return {
    shotType: 'Jump Shot',
    outcome: 'success',
    detectedPosition: playerInfo.position || 'Guard',
    play_context: {
      situation: 'Open look from the wing',
      defender_pressure: 'Light pressure',
      shot_clock: 'Mid-possession'
    },
    tangible_performance: {
      shot_result: 'Made',
      distance: '18 feet',
      release_time: '0.6 seconds',
      arc: '45 degrees'
    },
    intangible_performance: {
      confidence: 0.85,
      focus: 0.90,
      body_language: 0.88,
      decision_making: 0.82
    },
    integrated_insight: {
      correlation_metrics: {
        intangibles_overall_score: 0.86
      }
    },
    coaching_recommendations: {
      primary_focus: 'Maintain shooting form under pressure',
      technique_adjustments: ['Keep elbow alignment', 'Follow through'],
      mental_approach: 'Stay confident in your shot',
      practice_drills: ['Spot shooting', 'Game-speed reps']
    }
  };
}
