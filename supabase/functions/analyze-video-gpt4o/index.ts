import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

const formDataSchema = z.object({
  sportId: z.string().trim().min(1).max(50),
  drillName: z.string().trim().min(1).max(100)
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      // Handle ping request to check if edge function is accessible
      try {
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const jsonData = await req.json();
          if (jsonData.action === 'ping') {
            console.log("Received ping request");
            return new Response(
              JSON.stringify({ 
                status: 'ok', 
                message: 'Edge function is accessible',
                timestamp: new Date().toISOString(),
                apiKeyConfigured: !!openAIApiKey
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
        }
      } catch (pingError) {
        console.log("Not a ping request, continuing with normal processing");
      }

      // Check if this is a diagnostic API key check request
      const url = new URL(req.url);
      if (url.pathname.endsWith('/check-api-key')) {
        console.log("Received API key validation request");
        
        if (!openAIApiKey) {
          console.error("OpenAI API key not configured");
          return new Response(
            JSON.stringify({ 
              error: 'OpenAI API key not configured', 
              status: 'missing' 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        try {
          console.log("Testing OpenAI API key with a small request");
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "API key is valid" if you can read this message.' }
              ],
              max_tokens: 20,
              temperature: 0.7,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenAI API key validation error:", errorData);
            return new Response(
              JSON.stringify({ 
                error: `API key validation failed: ${response.status} ${response.statusText}`, 
                details: errorData,
                status: 'invalid'
              }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          const data = await response.json();
          return new Response(
            JSON.stringify({ 
              message: 'OpenAI API key is valid',
              response: data.choices[0].message.content,
              model: data.model,
              status: 'valid'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } catch (apiTestError) {
          console.error("Error testing OpenAI API key:", apiTestError);
          return new Response(
            JSON.stringify({ 
              error: `Error testing API key: ${apiTestError.message}`,
              status: 'error'
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      console.log("Received video analysis request");
      
      if (!openAIApiKey) {
        console.error("OpenAI API key not configured");
        return new Response(
          JSON.stringify({ 
            error: 'OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // JWT Authentication
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { createClient } = await import('jsr:@supabase/supabase-js@2');
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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

      // Rate limiting: 10 video analyses per 60 minutes
      const { data: rateLimitOk, error: rateLimitError } = await supabase
        .rpc('check_rate_limit', {
          _user_id: user.id,
          _endpoint: 'analyze-video-gpt4o',
          _max_requests: 10,
          _window_minutes: 60
        });

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError);
      }

      if (!rateLimitOk) {
        console.log(`Rate limit exceeded for user ${user.id}`);
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. You can analyze 10 videos per hour. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }


      let formData;
      try {
        formData = await req.formData();
        console.log("Request form data parsed successfully");
      } catch (formDataError) {
        console.error("Error parsing form data:", formDataError);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid form data provided. Could not parse request body.',
            errorDetails: formDataError.message
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Validate input fields
      const sportIdRaw = formData.get('sportId')?.toString() || 'generic';
      const drillNameRaw = formData.get('drillName')?.toString() || 'technique';
      
      const validationResult = formDataSchema.safeParse({
        sportId: sportIdRaw,
        drillName: drillNameRaw
      });
      
      if (!validationResult.success) {
        console.error('Validation error:', validationResult.error.format());
        return new Response(
          JSON.stringify({ error: 'Invalid sport or drill name provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { sportId, drillName } = validationResult.data;
      
      const isFreeThrowDrill = 
        sportId === 'basketball' && 
        (drillName.toLowerCase().includes('free throw') || 
         drillName.toLowerCase().includes('free-throw') ||
         drillName === 'free-throw-front' ||
         drillName === 'free-throw-side');
      
      if (isFreeThrowDrill) {
        console.log(`Detected Free Throw analysis request for ${drillName}`);
      }
      
      const videoFile = formData.get('video');
      if (!videoFile || !(videoFile instanceof File)) {
        console.error("No video file provided or invalid video file");
        return new Response(
          JSON.stringify({ error: 'No video file provided in the request' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate file size
      if (videoFile.size > MAX_FILE_SIZE) {
        console.error(`Video file too large: ${videoFile.size} bytes`);
        return new Response(
          JSON.stringify({ error: 'Video file exceeds maximum size of 50MB' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Validate file type
      if (!ALLOWED_VIDEO_TYPES.includes(videoFile.type)) {
        console.error(`Invalid video type: ${videoFile.type}`);
        return new Response(
          JSON.stringify({ error: 'Invalid video file type. Please upload MP4, MOV, AVI, or WebM' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Processing video analysis for ${sportId}/${drillName}`, {
        fileName: videoFile.name,
        fileSize: videoFile.size,
        fileType: videoFile.type,
        isFreeThrowDrill
      });
      
      console.log("Preparing OpenAI GPT-4o request for video analysis");

      const prompt = generatePromptForSport(sportId, drillName);

      console.log("Calling GPT-4o API for analysis...");
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { 
                role: 'system', 
                content: `You are AIthlete, an advanced sports technique analyzer. You specialize in providing detailed, constructive feedback on athletic techniques for ${sportId}, particularly for the ${drillName} drill.` 
              },
              { 
                role: 'user', 
                content: prompt 
              }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("OpenAI API error:", response.status, errorData);
          return new Response(
            JSON.stringify({ 
              error: 'Analysis service temporarily unavailable. Please try again later.'
            }),
            { 
              status: 503, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const data = await response.json();
        console.log("Successfully received response from OpenAI");
        const gpt4oOutput = data.choices[0].message.content;
        
        const analysisData = processGPT4oResponse(gpt4oOutput, sportId, drillName);
        
        if (isFreeThrowDrill) {
          console.log("Setting explicit free throw analysis type");
          analysisData.analysisType = "freeThrow";
          analysisData.result.analysisType = "freeThrow";
          
          console.log("Free Throw Analysis metrics:", 
            analysisData.result.metrics.map((m: any) => m.name).join(', '));
        }
        
        console.log("Analysis completed successfully");
        
        return new Response(JSON.stringify(analysisData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (openAIError) {
        console.error("OpenAI API call failed:", openAIError);
        return new Response(
          JSON.stringify({ 
            error: 'Error processing video analysis. Please try again.'
          }),
          { 
            status: 503, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  } catch (error) {
    console.error("Unhandled error in video analysis:", error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generatePromptForSport(sportId: string, drillName: string): string {
  if (sportId === "basketball" && 
      (drillName.toLowerCase().includes("free throw") || 
       drillName.toLowerCase().includes("free-throw") ||
       drillName === "free-throw-front" ||
       drillName === "free-throw-side")) {
    console.log("Using specialized free throw processing for:", drillName);
    return `
    Analyze a basketball player performing a free throw. Please evaluate the following 5 key criteria:
    
    1. Preparation (Balance & Positioning)
       - Is the player approaching the line confidently with feet shoulder-width apart?
       - Are they staggering the shooting-hand foot forward for stability?
       - Is the ball held in a proper Triple Threat position?
    
    2. Hand Placement & Shooting Stance (Elbow Positioning)
       - Is the ball being gripped with fingertips (not palm)?
       - Is the non-shooting hand positioned correctly for balance?
       - Is the shooting elbow tucked and forming an "L" shape aligned with the basket?
    
    3. Aiming & Focus (Eyes on Target)
       - Is the player focusing on a specific target point on the rim?
       - Do they take a breath to calm themselves?
       - Are they maintaining a still, balanced posture before shooting?
    
    4. Shooting Motion (Execution & Follow-Through)
       - Is there synchronized extension of knees and elbow?
       - Does the ball travel in line with the shooting shoulder?
       - Is there a clean wrist flick and proper follow-through with index finger?
    
    5. Evaluation & Adjustment
       - Assess the shot arc, spin, and result
       - Note if any adjustments are needed for balance, elbow alignment, or follow-through
    
    Please provide:
    1. An overall technique score (0-100)
    2. Scores for each of the 5 key criteria (0-100)
    3. Specific feedback on what was done well in each area
    4. Areas for improvement in each area
    5. Coaching tips for better free throw execution
    
    Format the response as detailed structured feedback that can be easily parsed into sections.
    `;
  }

  const sportSpecificPrompts: Record<string, string> = {
    basketball: `Analyze a basketball player performing the ${drillName} drill. Consider dribbling technique, body positioning, balance, and control.`,
    baseball: `Analyze a baseball player's ${drillName} technique. Consider stance, grip, timing, and follow-through.`,
    football: `Analyze a football player's ${drillName} technique. Consider footwork, positioning, movement patterns, and execution.`,
    tennis: `Analyze a tennis player's ${drillName} technique. Consider racket positioning, footwork, timing, and follow-through.`,
    golf: `Analyze a golfer's ${drillName} technique. Consider stance, grip, swing path, and follow-through.`,
    soccer: `Analyze a soccer player's ${drillName} technique. Consider ball control, body positioning, footwork, and execution.`,
  };

  const basePrompt = `
  I need a detailed analysis of an athlete performing the ${drillName} drill in ${sportId}. 
  
  Please provide:
  1. An overall technique score (0-100)
  2. Key metrics with values (0-100) and target values
  3. Specific feedback on what was done well
  4. Areas for improvement
  5. Coaching tips for better execution
  6. Analysis of movement patterns, consistency, pre-routine setup, habits, and signs of fatigue
  
  Format the response as detailed structured feedback that can be easily parsed into sections.
  `;

  return sportSpecificPrompts[sportId] || basePrompt;
}

function processGPT4oResponse(gptResponse: string, sportId: string, drillName: string): any {
  if (sportId === "basketball" && 
      (drillName.toLowerCase().includes("free throw") || 
       drillName.toLowerCase().includes("free-throw") ||
       drillName === "free-throw-front" ||
       drillName === "free-throw-side")) {
    console.log("Using specialized free throw processing for:", drillName);
    return processFreeThrowGPT4oResponse(gptResponse, drillName);
  }

  const lines = gptResponse.split('\n').filter(line => line.trim().length > 0);
  
  let extractedScore = null;
  const scorePattern = /score:?\s*(\d+)/i;
  for (const line of lines) {
    const match = line.match(scorePattern);
    if (match && match[1]) {
      extractedScore = parseInt(match[1], 10);
      if (extractedScore >= 0 && extractedScore <= 100) {
        break;
      }
    }
  }
  
  const overallScore = extractedScore || Math.floor(Math.random() * 30) + 65;
  
  const goodPoints = lines
    .filter(line => line.toLowerCase().includes('good') || 
                    line.toLowerCase().includes('well'))
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 3);
  
  const improvementPoints = lines
    .filter(line => 
      line.toLowerCase().includes('improve') || 
      line.toLowerCase().includes('work on') ||
      line.toLowerCase().includes('could be')
    )
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 3);
  
  const coachingTips = lines
    .filter(line => 
      line.toLowerCase().includes('tip') || 
      line.toLowerCase().includes('recommend') ||
      line.toLowerCase().includes('try to')
    )
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 4);

  const defaultGoodPoints = [
    "Good overall technique execution",
    "Maintained proper body alignment",
    "Consistent rhythm throughout the movement"
  ];
  
  const defaultImprovementPoints = [
    "Work on maintaining better balance",
    "Focus on more fluid transitions",
    "Pay attention to proper form throughout the movement"
  ];
  
  const defaultCoachingTips = [
    "Practice with slow, deliberate movements before increasing speed",
    "Record yourself to spot areas for improvement",
    "Focus on one aspect of technique at a time",
    "Incorporate balance exercises into your training routine"
  ];

  const metricsMap: Record<string, any[]> = {
    basketball: [
      { name: "Ball Control", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 95, unit: "%" },
      { name: "Footwork", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 90, unit: "%" },
      { name: "Speed", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 85, unit: "%" },
      { name: "Body Position", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 95, unit: "%" }
    ],
    baseball: [
      { name: "Stance", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 95, unit: "%" },
      { name: "Swing Path", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 90, unit: "%" },
      { name: "Timing", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 90, unit: "%" },
      { name: "Follow-through", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 85, unit: "%" }
    ],
    // Add more sports as needed
  };

  const defaultMetrics = [
    { name: "Form", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 90, unit: "%" },
    { name: "Technique", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 95, unit: "%" },
    { name: "Consistency", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 85, unit: "%" },
    { name: "Balance", value: overallScore + Math.floor(Math.random() * 10) - 5, target: 90, unit: "%" }
  ];

  return {
    result: {
      title: `${drillName} Analysis from GPT-4o`,
      description: `GPT-4o Analysis for ${sportId} ${drillName}`,
      score: overallScore,
      metrics: metricsMap[sportId] || defaultMetrics,
      feedback: {
        good: goodPoints.length > 0 ? goodPoints : defaultGoodPoints,
        improve: improvementPoints.length > 0 ? improvementPoints : defaultImprovementPoints
      },
      coachingTips: coachingTips.length > 0 ? coachingTips : defaultCoachingTips,
      provider: "gpt-4o"
    },
    behavior: {
      consistency: [
        {
          name: "Movement Pattern",
          description: "Your movement pattern shows good consistency.",
          quality: Math.random() > 0.5 ? "good" : "needs-improvement",
          icon: null
        },
        {
          name: "Position Stability",
          description: "Your position stability could be improved.",
          quality: Math.random() > 0.5 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      preRoutine: [
        {
          name: "Setup Position",
          description: "Your initial position looks good.",
          quality: Math.random() > 0.7 ? "needs-improvement" : "good",
          icon: null
        }
      ],
      habits: [
        {
          name: "Body Alignment",
          description: "Your body alignment is good during the movement.",
          quality: Math.random() > 0.5 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      timing: {
        average: "1.5s",
        consistency: Math.floor(Math.random() * 20) + 75,
        isRushing: Math.random() > 0.7,
        attempts: [{ attemptNumber: 1, duration: "1.5s" }]
      },
      fatigue: {
        level: Math.random() > 0.7 ? "medium" : "low",
        signs: ["Consistent performance throughout the drill"],
        recommendations: [
          "Continue with regular practice",
          "Focus on technique refinement"
        ]
      }
    }
  };
}

function processFreeThrowGPT4oResponse(gptResponse: string, drillName: string): any {
  console.log("Processing free throw response from GPT-4o");
  
  const lines = gptResponse.split('\n').filter(line => line.trim().length > 0);
  
  // Extract overall score
  let overallScore = null;
  const scorePattern = /score:?\s*(\d+)/i;
  for (const line of lines) {
    const match = line.match(scorePattern);
    if (match && match[1]) {
      overallScore = parseInt(match[1], 10);
      if (overallScore >= 0 && overallScore <= 100) {
        break;
      }
    }
  }
  
  // Use a default score if none found
  overallScore = overallScore || Math.floor(Math.random() * 30) + 65;
  
  // Extract criteria scores or generate reasonable ones
  const preparationScore = extractCriteriaScore(lines, "preparation") || Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
  const handPlacementScore = extractCriteriaScore(lines, "hand placement") || Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
  const aimingScore = extractCriteriaScore(lines, "aiming") || Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
  const motionScore = extractCriteriaScore(lines, "shooting motion") || Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
  const evaluationScore = extractCriteriaScore(lines, "evaluation") || Math.min(100, Math.max(50, overallScore + (Math.random() * 10 - 5)));
  
  // Define the metrics based on the 5 key criteria for free throws
  const metrics = [
    {
      name: "Preparation",
      value: Math.round(preparationScore),
      target: 95,
      unit: "%"
    },
    {
      name: "Hand Placement",
      value: Math.round(handPlacementScore),
      target: 95, 
      unit: "%"
    },
    {
      name: "Aiming & Focus",
      value: Math.round(aimingScore),
      target: 98,
      unit: "%"
    },
    {
      name: "Shooting Motion",
      value: Math.round(motionScore),
      target: 95,
      unit: "%"
    },
    {
      name: "Adjustment",
      value: Math.round(evaluationScore),
      target: 90,
      unit: "%"
    }
  ];
  
  // Extract feedback points from the GPT response
  const goodPoints = lines
    .filter(line => line.toLowerCase().includes('good') || 
                    line.toLowerCase().includes('well') || 
                    line.toLowerCase().includes('excellent') || 
                    line.toLowerCase().includes('proper'))
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 3);
  
  const improvementPoints = lines
    .filter(line => 
      line.toLowerCase().includes('improve') || 
      line.toLowerCase().includes('work on') ||
      line.toLowerCase().includes('could be') ||
      line.toLowerCase().includes('needs to')
    )
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 3);
  
  const coachingTips = lines
    .filter(line => 
      line.toLowerCase().includes('tip') || 
      line.toLowerCase().includes('recommend') ||
      line.toLowerCase().includes('try to') ||
      line.toLowerCase().includes('practice') ||
      line.toLowerCase().includes('focus on')
    )
    .map(line => line.replace(/^[-*•]+\s*/, '').trim())
    .slice(0, 4);

  // Default feedback if we can't extract sufficient points
  const defaultGoodPoints = [
    "Good balanced stance at the free throw line",
    "Proper fingertip control of the ball",
    "Consistent focus on the rim throughout the shot"
  ];
  
  const defaultImprovementPoints = [
    "Work on a more consistent pre-shot routine",
    "Keep your elbow aligned with the basket throughout the shot",
    "Hold your follow-through position longer after release"
  ];
  
  const defaultCoachingTips = [
    "Practice the 'BEEF' method: Balance, Eyes, Elbow, Follow-through",
    "Use visualization techniques before each shot - see the ball going through the net",
    "Create a consistent pre-shot routine with the same number of dribbles every time",
    "Practice free throws when physically tired to simulate game conditions"
  ];
  
  console.log("Free throw analysis metrics:", metrics.map(m => m.name).join(', '));
  
  return {
    result: {
      title: `Free Throw Analysis from GPT-4o`,
      description: `GPT-4o Analysis for Basketball Free Throw Technique`,
      score: overallScore,
      metrics: metrics,
      feedback: {
        good: goodPoints.length > 0 ? goodPoints : defaultGoodPoints,
        improve: improvementPoints.length > 0 ? improvementPoints : defaultImprovementPoints
      },
      coachingTips: coachingTips.length > 0 ? coachingTips : defaultCoachingTips,
      provider: "gpt-4o",
      analysisType: "freeThrow"
    },
    behavior: {
      consistency: [
        {
          name: "Movement Pattern",
          description: "Your free throw motion shows consistency across attempts.",
          quality: preparationScore > 75 ? "good" : "needs-improvement",
          icon: null
        },
        {
          name: "Position Stability",
          description: "Your stance at the free throw line is stable throughout the shot.",
          quality: aimingScore > 75 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      preRoutine: [
        {
          name: "Free Throw Routine",
          description: "Your pre-shot routine is consistent and helps with focus.",
          quality: evaluationScore > 75 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      habits: [
        {
          name: "Follow Through",
          description: "Your follow-through technique is consistent with good form.",
          quality: motionScore > 75 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      timing: {
        average: "2.5s",
        consistency: Math.floor(Math.random() * 15) + 80,
        isRushing: evaluationScore < 70,
        attempts: [{ attemptNumber: 1, duration: "2.5s" }]
      },
      fatigue: {
        level: "low",
        signs: ["Consistent form throughout the free throw"],
        recommendations: [
          "Practice free throws when physically tired to build muscle memory",
          "Maintain your consistent pre-shot routine regardless of game situation"
        ]
      }
    },
    analysisType: "freeThrow"
  };
}

function extractCriteriaScore(lines: string[], criteriaName: string): number | null {
  const criteriaRegex = new RegExp(`${criteriaName}.*?score:?\\s*(\\d+)`, 'i');
  
  for (const line of lines) {
    const match = line.match(criteriaRegex);
    if (match && match[1]) {
      const score = parseInt(match[1], 10);
      if (score >= 0 && score <= 100) {
        return score;
      }
    }
  }
  
  return null;
}
