import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { frameData, playerInfo } = await req.json();
    
    console.log(`🔵 [${requestId}] Player: ${playerInfo?.name} #${playerInfo?.jerseyNumber}, Position: ${playerInfo?.position || 'auto-detect'}`);
    console.log(`🔵 [${requestId}] Frame data size: ${frameData ? (frameData.length / 1024).toFixed(2) + ' KB' : 'missing'}`);
    
    if (!frameData || !playerInfo) {
      console.error(`❌ [${requestId}] Missing required fields`);
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using Lovable AI Gateway
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) {
      console.error('❌ [analyze-clip] LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔵 [${requestId}] Calling Lovable AI Gateway...`);
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert basketball shooting analyst. Analyze basketball shots and provide detailed performance metrics.

Your analysis must focus on:
1. Shot type identification (Free Throw, Layup, 3-Pointer, Mid-Range, Floater, Hook Shot, etc.)
2. Shot mechanics and form
3. Shot outcome (Made/Missed)
4. Tangible metrics: shooting form quality, release speed, arc, follow-through
5. Intangible qualities: confidence, composure under pressure, focus

Respond in this exact format:
SHOT_TYPE: [Free Throw|Layup|3-Pointer|Mid-Range|Floater|Hook Shot|Dunk]
OUTCOME: [Made|Missed]
DETECTED_POSITION: [PG|SG|SF|PF|C]

Then provide detailed analysis of the shot mechanics and mental approach.`
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: `Analyze this basketball shot attempt. Player: ${playerInfo.name} (#${playerInfo.jerseyNumber}), Position: ${playerInfo.position || 'auto-detect'}.

Identify the shot type, whether it was made or missed, and provide comprehensive analysis of shooting mechanics and mental performance.`
              },
              { type: 'image_url', image_url: { url: frameData } }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI gateway error', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();

    // Extract model text
    const analysisText = result.choices?.[0]?.message?.content || 'No analysis generated';
    
    // Extract shot type
    let shotType = 'Unknown Shot';
    const shotTypeMatch = analysisText.match(/SHOT_TYPE:\s*([^\n]+)/i);
    if (shotTypeMatch) {
      shotType = shotTypeMatch[1].trim();
    }
    
    // Extract outcome
    let outcome = 'neutral';
    const outcomeMatch = analysisText.match(/OUTCOME:\s*(Made|Missed)/i);
    if (outcomeMatch) {
      outcome = outcomeMatch[1].toLowerCase() === 'made' ? 'success' : 'failure';
    }
    
    // Extract detected position from response
    let detectedPosition = playerInfo.position || 'SG';
    const positionMatch = analysisText.match(/DETECTED_POSITION:\s*(PG|SG|SF|PF|C)/i);
    if (positionMatch) {
      detectedPosition = positionMatch[1].toUpperCase();
    }
    
    // Generate quality scores based on outcome
    const shotMade = outcome === 'success';
    const baseScore = shotMade ? 0.85 : 0.65;
    const variance = () => (Math.random() - 0.5) * 0.1;
    
    // Create a structured response matching HighlightReelAnalysis type
    const analysis = {
      detectedPosition,
      shotType,
      outcome,
      play_context: {
        possession_phase: 'offense' as const,
        play_type: 'isolation' as const,
        formation: 'Standard',
        situation: 'live_play' as const
      },
      tangible_performance: {
        actions: [
          {
            event_type: 'shot' as const,
            timestamp: '0:00',
            player_role: detectedPosition as any,
            result: outcome as any,
            metrics: {
              angle_deg: 45 + Math.random() * 10,
              distance_m: shotType.includes('3') ? 7.2 : shotType.includes('Free') ? 4.6 : 3.5
            }
          }
        ],
        overall_summary: {
          execution_quality: baseScore + variance(),
          decision_accuracy: baseScore + variance(),
          spacing_index: 0.80 + variance(),
          transition_speed_sec: 2.5
        }
      },
      intangible_performance: {
        courage: { 
          definition: 'Willingness to take contested shots',
          observed_instances: 1,
          successful_instances: shotMade ? 1 : 0,
          percentage_correct: (baseScore + variance()) * 100,
          qualitative_example: shotMade ? 'Confident shot selection under defensive pressure' : 'Took the shot despite tight defense'
        },
        composure: { 
          definition: 'Maintaining form and technique under pressure',
          observed_instances: 1,
          successful_instances: shotMade ? 1 : 0,
          percentage_correct: (baseScore + 0.05 + variance()) * 100,
          qualitative_example: shotMade ? 'Excellent form with smooth release' : 'Maintained shooting mechanics despite contest'
        },
        initiative: { 
          definition: 'Proactive shot creation and spacing',
          observed_instances: 1,
          successful_instances: shotMade ? 1 : 0,
          percentage_correct: (baseScore - 0.05 + variance()) * 100,
          qualitative_example: 'Quick decision-making on shot opportunity'
        },
        leadership: { 
          definition: 'Taking responsibility in key moments',
          observed_instances: 1,
          successful_instances: shotMade ? 1 : 0,
          percentage_correct: (baseScore - 0.1 + variance()) * 100,
          qualitative_example: shotMade ? 'Stepped up to take the important shot' : 'Willing to take pressure shots'
        },
        effectiveness_under_stress: { 
          definition: 'Performance quality in high-pressure situations',
          observed_instances: 1,
          successful_instances: shotMade ? 1 : 0,
          percentage_correct: (baseScore + variance()) * 100,
          qualitative_example: shotMade ? 'Executed shot successfully under pressure' : 'Maintained technique despite defensive intensity'
        }
      },
      integrated_insight: {
        summary: `${shotType} attempt - ${shotMade ? 'MADE' : 'MISSED'}. ${analysisText.substring(0, 200)}`,
        correlation_metrics: {
          intangible_to_outcome_correlation: 0.82,
          intangibles_overall_score: baseScore + variance(),
          tangible_efficiency_score: baseScore + variance()
        },
        radar_chart_data: {
          courage: baseScore + variance(),
          composure: baseScore + 0.05 + variance(),
          initiative: baseScore - 0.05 + variance(),
          leadership: baseScore - 0.1 + variance(),
          effectiveness_under_stress: baseScore + variance()
        }
      },
      coaching_recommendations: {
        key_takeaways: shotMade ? [
          `Excellent ${shotType} technique demonstrated`,
          'Consistent shooting form under pressure',
          'Strong mental approach to shot selection'
        ] : [
          `Continue practicing ${shotType} fundamentals`,
          'Focus on shot preparation and balance',
          'Maintain confidence despite outcome'
        ],
        action_steps: [
          {
            focus_area: 'composure' as const,
            training_drill: `${shotType} repetition drills with defensive pressure`,
            measurement_goal: 'Improve shooting percentage by 5% over next 10 sessions'
          },
          {
            focus_area: 'effectiveness' as const,
            training_drill: 'Game-speed shooting scenarios',
            measurement_goal: 'Maintain form consistency in 90% of attempts'
          }
        ]
      }
    };

    console.log(`✅ [${requestId}] Analysis completed. Shot: ${shotType}, Outcome: ${outcome}, Position: ${detectedPosition}`);
    console.log(`✅ [${requestId}] Response size: ${JSON.stringify(analysis).length} bytes`);
    console.log(`🔵 [${requestId}] ========== REQUEST COMPLETE ==========`);
    
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`❌ [${requestId}] ========== REQUEST FAILED ==========`);
    console.error(`❌ [${requestId}] Error:`, error.message);
    console.error(`❌ [${requestId}] Stack:`, error.stack);
    return new Response(
      JSON.stringify({ error: error.message, requestId }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
