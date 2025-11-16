import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClipDescription {
  clip_id: string;
  analysis_id: string;
  description: string;
  possession_type: 'offense' | 'defense' | 'transition';
}

interface BatchAnalysisInput {
  player_name: string;
  clips: ClipDescription[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { player_name, clips }: BatchAnalysisInput = await req.json();

    if (!player_name || !clips || clips.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing player_name or clips' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing batch of ${clips.length} clips for ${player_name}`);

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured');
    }

    // Build prompt for batch analysis
    const clipDescriptions = clips.map((clip, idx) => 
      `Clip ${idx + 1} (${clip.possession_type}):\n${clip.description}`
    ).join('\n\n');

    const prompt = `You will receive multiple basketball clip descriptions for ${player_name}.

For EACH clip:
- Run the offensive or defensive analysis (as appropriate)
- Extract:
  - Context
  - 1 key tangible strength
  - 1 key tangible weakness
  - 1 key intangible trait displayed
  - 1 coaching cue

Output as JSON array:

[
  {
    "clip_id": "",
    "possession_type": "offense" | "defense" | "transition",
    "tangible_strength": "",
    "tangible_weakness": "",
    "key_intangible": {
      "name": "",
      "evidence": ""
    },
    "coaching_cue": ""
  }
]

Only output valid JSON, no additional text.

CLIPS:
${clipDescriptions}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const batchResults = JSON.parse(jsonMatch[0]);

    // Store intangible ratings for each clip
    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const clip = clips[i];

      if (result.key_intangible && clip.analysis_id) {
        // Map intangible name to metric_name
        const metricName = result.key_intangible.name.toLowerCase().replace(/\s+/g, '_');
        
        await supabaseClient.from('intangible_ratings').insert({
          analysis_id: clip.analysis_id,
          metric_name: metricName,
          rating: 3, // Default rating, could be extracted from evidence
          evidence: result.key_intangible.evidence
        });
      }
    }

    console.log('Batch analysis complete');

    return new Response(
      JSON.stringify({ results: batchResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-batch function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
