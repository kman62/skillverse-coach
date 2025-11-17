import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SPORTS = ['basketball', 'baseball', 'football', 'soccer', 'volleyball', 'tennis', 'golf', 'rugby'];

interface AggregateInput {
  athlete_id: string;
  sport: string;
  date_range_start?: string;
  date_range_end?: string;
}

function validateInput(input: AggregateInput): string | null {
  if (!input.athlete_id || typeof input.athlete_id !== 'string') {
    return 'athlete_id is required and must be a string';
  }
  if (!UUID_REGEX.test(input.athlete_id)) {
    return 'athlete_id must be a valid UUID';
  }
  if (!input.sport || typeof input.sport !== 'string') {
    return 'sport is required and must be a string';
  }
  if (!VALID_SPORTS.includes(input.sport.toLowerCase())) {
    return `sport must be one of: ${VALID_SPORTS.join(', ')}`;
  }
  if (input.date_range_start && isNaN(Date.parse(input.date_range_start))) {
    return 'date_range_start must be a valid date string';
  }
  if (input.date_range_end && isNaN(Date.parse(input.date_range_end))) {
    return 'date_range_end must be a valid date string';
  }
  if (input.date_range_start && input.date_range_end) {
    const start = new Date(input.date_range_start);
    const end = new Date(input.date_range_end);
    if (start > end) {
      return 'date_range_start must be before date_range_end';
    }
  }
  return null;
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

    // Try to get user from JWT (optional for public endpoint)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.warn('aggregate-intangibles: no authenticated user; proceeding without auth');
    }


    // Check rate limit only when user is authenticated
    if (user) {
      const { data: rateLimitOk, error: rateLimitError } = await supabaseClient.rpc('check_rate_limit', {
        _user_id: user.id,
        _endpoint: 'aggregate-intangibles',
        _max_requests: 20,
        _window_minutes: 60
      });

      if (rateLimitError || !rateLimitOk) {
        console.log('Rate limit exceeded for user:', user.id);
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }


    const input: AggregateInput = await req.json();

    // Validate input
    const validationError = validateInput(input);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { athlete_id, sport, date_range_start, date_range_end } = input;

    console.log(`Aggregating intangibles for athlete ${athlete_id}`);

    // Get all analyses for this athlete within date range
    let query = supabaseClient
      .from('analysis_history')
      .select('id, created_at')
      .eq('athlete_id', athlete_id)
      .eq('sport_id', sport);

    if (date_range_start) {
      query = query.gte('created_at', date_range_start);
    }
    if (date_range_end) {
      query = query.lte('created_at', date_range_end);
    }

    const { data: analyses, error: analysesError } = await query;

    if (analysesError) {
      throw analysesError;
    }

    if (!analyses || analyses.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No analysis data found for this athlete in the specified date range. Upload and analyze some clips first.' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisIds = analyses.map(a => a.id);

    // Get all intangible ratings for these analyses
    const { data: ratings, error: ratingsError } = await supabaseClient
      .from('intangible_ratings')
      .select('metric_name, rating, evidence')
      .in('analysis_id', analysisIds);

    if (ratingsError) {
      throw ratingsError;
    }

    // Aggregate ratings by metric
    const metrics = ['courage', 'composure', 'initiative', 'leadership', 'effectiveness_under_stress', 'resilience'];
    const aggregated: Record<string, number[]> = {};
    
    metrics.forEach(metric => {
      aggregated[metric] = [];
    });

    ratings?.forEach(rating => {
      if (aggregated[rating.metric_name]) {
        aggregated[rating.metric_name].push(rating.rating);
      }
    });

    // Calculate averages
    const averages: Record<string, number> = {};
    metrics.forEach(metric => {
      const values = aggregated[metric];
      if (values.length > 0) {
        averages[`${metric}_avg`] = values.reduce((a, b) => a + b, 0) / values.length;
      } else {
        averages[`${metric}_avg`] = 0;
      }
    });

    // Find strongest and weakest
    const metricAverages = metrics.map(m => ({
      name: m,
      avg: averages[`${m}_avg`]
    })).filter(m => m.avg > 0);

    metricAverages.sort((a, b) => b.avg - a.avg);

    const strongest = metricAverages.slice(0, 2).map(m => m.name);
    const weakest = metricAverages.slice(-2).map(m => m.name);

    const primary_focus = weakest[0] || '';
    const secondary_focus = weakest[1] || '';

    // Upsert profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('player_intangible_profiles')
      .upsert({
        athlete_id,
        sport,
        date_range_start: date_range_start || analyses[analyses.length - 1].created_at.split('T')[0],
        date_range_end: date_range_end || analyses[0].created_at.split('T')[0],
        courage_avg: averages.courage_avg || null,
        composure_avg: averages.composure_avg || null,
        initiative_avg: averages.initiative_avg || null,
        leadership_avg: averages.leadership_avg || null,
        stress_effectiveness_avg: averages.effectiveness_under_stress_avg || null,
        resilience_avg: averages.resilience_avg || null,
        primary_focus,
        secondary_focus,
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    console.log('Intangible profile aggregated successfully');

    return new Response(
      JSON.stringify({
        profile,
        strongest,
        weakest,
        total_analyses: analyses.length,
        total_ratings: ratings?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in aggregate-intangibles function:', error);
    
    const userMessage = error instanceof Error 
      ? error.message 
      : 'Failed to aggregate intangible metrics. Please try again.';
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
