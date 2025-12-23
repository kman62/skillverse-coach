import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getSportFeedbackContext } from "./sport-contexts.ts";

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
- Discipline: following the game plan, avoiding undisciplined plays
- Focus: attention to detail, tracking the play, minimizing mental lapses
- Consistency: repeatable mechanics and decision-making
- Game IQ: reading the game, anticipation, situational awareness

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
        JSON.stringify({ error: 'AI feedback service not configured. Please contact support.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calling Lovable AI Gateway for feedback generation...');

    const response = await retryWithBackoff(async () => {
      const res = await fetch(
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

      if (!res.ok) {
        const errorText = await res.text();
        console.error('AI API error:', res.status, errorText);
        
        if (res.status === 429) {
          throw new Error('AI service is currently busy. Please try again in a few moments.');
        } else if (res.status === 402) {
          throw new Error('AI credits depleted. Please contact support.');
        } else if (res.status === 503) {
          throw new Error('AI service temporarily unavailable. Retrying...');
        }
        
        throw new Error('Failed to generate feedback. Please try again.');
      }

      return res;
    });

    const data = await response.json();
    console.log('AI API response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid AI response structure:', JSON.stringify(data));
      throw new Error('AI returned incomplete feedback. Please try again.');
    }

    const feedbackText = data.choices[0].message.content;
    
    if (!feedbackText || feedbackText.trim().length === 0) {
      console.error('Empty feedback text received');
      throw new Error('AI returned empty feedback. Please try again.');
    }
    
    console.log('Raw feedback text length:', feedbackText.length);
    console.log('First 200 chars:', feedbackText.substring(0, 200));
    
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
      
      if (!feedback.athlete || !feedback.parents) {
        console.error('Missing required feedback fields:', Object.keys(feedback));
        throw new Error('AI returned incomplete feedback structure. Please try again.');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse text:', feedbackText.substring(0, 500));
      throw new Error('Failed to process feedback results. Please try again.');
    }

    console.log('Feedback generated successfully');

    return new Response(JSON.stringify(feedback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    } catch (error) {
      console.error('Error generating feedback:', error);
      
      const userMessage = error instanceof Error 
        ? error.message 
        : 'Failed to generate feedback report. Please try again.';
      
      const statusCode = error instanceof Error && error.message.includes('Rate limit') 
        ? 429 
        : 500;
      
      return new Response(
        JSON.stringify({ error: userMessage }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error in generate-feedback function:', error);
    
    const userMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred. Please try again.';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
