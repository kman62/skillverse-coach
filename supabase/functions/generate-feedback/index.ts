import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getSportFeedbackContext } from "./sport-contexts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`User authenticated: ${user.id}`);
    
    // Rate limiting: 20 feedback generations per 60 minutes
    const { data: rateLimitOk, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _user_id: user.id,
        _endpoint: 'generate-feedback',
        _max_requests: 20,
        _window_minutes: 60
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (!rateLimitOk) {
      console.log(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. You can generate 20 feedback reports per hour. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    try {
    const { analyses, playerInfo } = await req.json();
    const sport = playerInfo.sport || 'basketball';

    console.log(`Generating ${sport} feedback for ${playerInfo.name} based on ${analyses.length} clips`);

    const sportContext = getSportFeedbackContext(sport);

    const prompt = `You are a supportive and constructive ${sport} coach reviewing a series of advanced video clip analyses for a young athlete named ${playerInfo.name}, who plays ${playerInfo.position} and wears jersey #${playerInfo.jerseyNumber}.

${sportContext}

Create two sections of feedback using the Complete Performance framework.

## FOR THE ATHLETE (${playerInfo.name})

Address them directly with:

**What You're Doing Well**
Identify 2-3 tangible strengths (skills, technique, execution) with specific examples from the clips.

**What You're Working On**  
Identify 1-2 areas to improve, focusing on habits and decisions, not just outcomes. Use simple, actionable language.

**Your Intangibles Snapshot**
Based on the Complete Performance framework, highlight their strongest intangible traits:
- Courage: willingness to compete and take on challenges
- Composure: staying calm under pressure
- Initiative: making proactive plays
- Leadership: helping teammates succeed
- Effectiveness Under Stress: performing in tough moments
- Resilience: bouncing back from mistakes

Give one concrete example of how these traits showed up in the clips.

**Your Development Focus**
Provide 2-3 specific training priorities:
1. One technical focus (skill work)
2. One tactical focus (decision-making)
3. One intangible focus (mindset/behavior)

Keep tone: encouraging, honest, actionable, athlete-focused.

## FOR THE PARENTS

Use simple, jargon-free language:

**Big Picture**
In 2-3 sentences, describe what type of player ${playerInfo.name} is right now (work ethic, attitude, playing style, role on team).

**Current Strengths**
List 3-4 things they're doing well:
- Effort and hustle
- Smart decisions or teamwork
- Specific skills that stand out
- Positive attitude or resilience

**Growth Areas**
Gently describe 2-3 areas to work on:
- Habits (e.g., staying low on defense, looking up with the ball)
- Decision-making (when to pass vs. shoot, positioning)
- Emotional control (staying positive after mistakes)

**Intangible Development**
Explain in parent-friendly terms how ${playerInfo.name} is developing mentally and emotionally:
- Are they competing hard and showing courage?
- Do they stay composed when things get tough?
- Are they showing leadership or helping teammates?
- How do they respond to mistakes?

Give 1-2 specific examples from the clips.

**How You Can Support**
Suggest 2-3 ways parents can help from the sideline and at home:
- Encourage effort and learning, not just stats
- Stay positive and supportive after mistakes
- Reinforce coaching messages about [specific focus from analyses]
- Create opportunities for extra practice on [specific skill]

Keep tone: encouraging, realistic, supportive, and accessible.

---

Format your response as JSON with two keys: "athlete" and "parents". The values should be markdown-formatted strings.

Analysis data:
${JSON.stringify(analyses, null, 2)}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('Missing LOVABLE_API_KEY secret');
      return new Response(
        JSON.stringify({ error: 'AI not configured. Please contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a helpful recruiting assistant. Return concise, positive, development-focused feedback. Output MUST be valid JSON with keys "athlete" and "parents" containing markdown strings.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI API response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response structure:', JSON.stringify(data));
      throw new Error('Invalid response from AI model');
    }

    const feedbackText = data.choices[0].message.content;
    console.log('Raw feedback text length:', feedbackText.length);
    console.log('First 200 chars:', feedbackText.substring(0, 200));
    
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse text:', feedbackText);
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    console.log('Feedback generated successfully');

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    } catch (error) {
      console.error('Error in generate-feedback function:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error in generate-feedback function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
