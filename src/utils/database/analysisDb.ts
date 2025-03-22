
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, BehaviorAnalysis } from '../analysis/analysisTypes';

/**
 * Save video metadata to the database
 */
export const saveVideoMetadata = async (
  userId: string,
  sportId: string,
  drillId: string,
  videoUrl: string
) => {
  console.log("Inserting video metadata to database...");
  
  const { error: videoError, data: videoData } = await supabase
    .from('videos')
    .insert({
      user_id: userId,
      sport_id: sportId,
      drill_id: drillId,
      title: `${drillId} Analysis`,
      video_url: videoUrl
    })
    .select()
    .single();
    
  if (videoError) {
    console.error("Error saving video metadata:", videoError);
    // If this fails because of RLS policies, log detailed info
    if (videoError.message.includes('violates row-level security')) {
      console.error("RLS error details:", { userId, sportId, drillId });
    }
    throw new Error(`Error saving video metadata: ${videoError.message}`);
  }
  
  console.log("Video metadata saved with ID:", videoData.id);
  return videoData;
};

/**
 * Calculate a valid score from the analysis result
 */
const calculateValidScore = (analysisResult: any): number => {
  if (typeof analysisResult?.score === 'number') {
    return Math.round(analysisResult.score);
  }
  
  // If no direct score, calculate from metrics if available
  if (Array.isArray(analysisResult?.metrics)) {
    const totalMetrics = analysisResult.metrics.reduce(
      (sum: number, metric: any) => sum + (typeof metric.value === 'number' ? metric.value : 0), 
      0
    );
    return Math.round(totalMetrics / (analysisResult.metrics.length || 1));
  }
  
  // Fallback to a reasonable default score
  return 75;
};

/**
 * Save analysis results to the database
 */
export const saveAnalysisResults = async (
  userId: string,
  videoId: string,
  sportId: string,
  drillId: string,
  analysisResult: AnalysisResult,
  behaviorAnalysis: BehaviorAnalysis
) => {
  console.log("Saving analysis results to database...");
  
  // Calculate valid score
  const score = calculateValidScore(analysisResult);
  console.log("Calculated score:", score);
  
  // Fix: Wrap the object in an array for insert
  const { error: analysisError, data: analysisData } = await supabase
    .from('analysis_results')
    .insert([{  // Changed this to an array of objects
      user_id: userId,
      video_id: videoId,
      sport_id: sportId,
      drill_id: drillId,
      analysis_data: analysisResult,
      behavior_data: behaviorAnalysis,
      score: score
    }])
    .select('id, score')  // Added score to the returned fields
    .single();
    
  if (analysisError) {
    console.error("Error saving analysis results:", analysisError);
    throw new Error(`Error saving analysis results: ${analysisError.message}`);
  }
  
  console.log("Analysis results saved with ID:", analysisData.id);
  return analysisData;
};

/**
 * Update user progress in the database
 */
export const updateUserProgress = async (
  userId: string,
  sportId: string,
  drillId: string,
  score: number,
  analysisResult: any,
  behaviorAnalysis: any
) => {
  console.log("Updating user progress...");
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const { error: progressError } = await supabase
    .from('user_progress')
    .insert([{  // Changed this to an array of objects
      user_id: userId,
      sport_id: sportId,
      drill_id: drillId,
      date: today,
      score: score,
      metrics: {
        technicalScore: analysisResult?.technicalScore || Math.round(score * 0.9),
        consistencyScore: analysisResult?.consistencyScore || Math.round(score * 0.8),
        behaviorScore: behaviorAnalysis?.overallScore || Math.round(score * 0.85)
      }
    }]);
    
  if (progressError) {
    console.error("Error saving user progress:", progressError);
    throw new Error(`Error saving user progress: ${progressError.message}`);
  }
  
  console.log("User progress updated successfully");
};
