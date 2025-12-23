import { supabase } from "@/integrations/supabase/client";

export interface IntangibleRating {
  metric_name: 'courage' | 'composure' | 'initiative' | 'leadership' | 'effectiveness_under_stress' | 'resilience' | 'discipline' | 'focus' | 'consistency' | 'game_iq';
  rating: number;
  evidence: string;
}

export const saveIntangibleRatings = async (
  analysisId: string,
  ratings: IntangibleRating[]
) => {
  try {
    const ratingsToInsert = ratings.map(rating => ({
      analysis_id: analysisId,
      metric_name: rating.metric_name,
      rating: rating.rating,
      evidence: rating.evidence
    }));

    const { error } = await supabase
      .from('intangible_ratings')
      .insert(ratingsToInsert);

    if (error) {
      console.error('Error saving intangible ratings:', error);
      throw error;
    }

    console.log(`Saved ${ratings.length} intangible ratings for analysis ${analysisId}`);
    return true;
  } catch (error) {
    console.error('Failed to save intangible ratings:', error);
    return false;
  }
};

export const extractIntangibleRatings = (intangiblePerformance: any): IntangibleRating[] => {
  if (!intangiblePerformance) return [];

  const ratings: IntangibleRating[] = [];
  const metrics: Array<'courage' | 'composure' | 'initiative' | 'leadership' | 'effectiveness_under_stress' | 'resilience' | 'discipline' | 'focus' | 'consistency' | 'game_iq'> = [
    'courage',
    'composure',
    'initiative',
    'leadership',
    'effectiveness_under_stress',
    'resilience',
    'discipline',
    'focus',
    'consistency',
    'game_iq'
  ];

  metrics.forEach(metric => {
    const data = intangiblePerformance[metric];
    if (data && typeof data === 'object') {
      const rating = data.rating || 3; // Default to 3 if not specified
      const evidence = data.evidence || data.qualitative_example || '';
      
      ratings.push({
        metric_name: metric,
        rating: Math.min(5, Math.max(1, rating)), // Ensure 1-5 range
        evidence
      });
    }
  });

  return ratings;
};
