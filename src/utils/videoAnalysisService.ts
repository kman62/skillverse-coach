
import { AnalysisResponse } from './analysis/analysisTypes';
import { supabase } from '@/integrations/supabase/client';
import { analyzeVideo } from './api/videoAnalysisApi';
import { uploadVideoToStorage } from './storage/videoStorage';
import { saveVideoMetadata, saveAnalysisResults, updateUserProgress } from './database/analysisDb';
import { MAX_FILE_SIZE } from './constants/fileConfig';

export type { AnalysisResult, BehaviorAnalysis, AnalysisResponse } from './analysis/analysisTypes';

/**
 * Analyzes a video file and returns analysis results
 * This is the main exported function that clients will use
 */
export { analyzeVideo };

/**
 * Save analysis result to Supabase
 */
export const saveAnalysisResult = async (
  videoFile: File,
  sportId: string,
  drillId: string,
  analysisResult: any,
  behaviorAnalysis: any
) => {
  console.log("Saving analysis to Supabase:", {
    videoSize: Math.round(videoFile.size / 1024) + "KB",
    sport: sportId,
    drill: drillId,
    hasAnalysisResult: !!analysisResult,
    hasBehaviorAnalysis: !!behaviorAnalysis
  });
  
  try {
    // Check file size before attempting to upload
    if (videoFile.size > MAX_FILE_SIZE) {
      throw new Error(`Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`);
    }
    
    // Verify authentication first
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting authenticated user:", userError);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!userData?.user) {
      console.error("No authenticated user found");
      throw new Error('User not authenticated');
    }
    
    console.log("User authenticated:", userData.user.id);
    const userId = userData.user.id;
    
    // 1. Upload video to storage
    const { success, videoUrl, error: uploadError } = await uploadVideoToStorage(videoFile, userId);
    
    if (!success || uploadError) {
      throw uploadError || new Error('Video upload failed');
    }
    
    // 2. Save video metadata
    const videoData = await saveVideoMetadata(userId, sportId, drillId, videoUrl);
    
    // 3. Save analysis results
    const analysisData = await saveAnalysisResults(
      userId, 
      videoData.id, 
      sportId, 
      drillId, 
      analysisResult, 
      behaviorAnalysis
    );
    
    // 4. Update user progress
    await updateUserProgress(
      userId,
      sportId,
      drillId,
      // Fix: Use the score from analysisData or a default if it doesn't exist
      analysisData.score || calculateScoreFromAnalysis(analysisResult),
      analysisResult,
      behaviorAnalysis
    );
    
    return { success: true, id: analysisData.id };
  } catch (error) {
    console.error('Error saving analysis data:', error);
    throw error;
  }
};

/**
 * Calculate a score from analysis result if analysisData.score is not available
 */
const calculateScoreFromAnalysis = (analysisResult: any): number => {
  if (typeof analysisResult?.score === 'number') {
    return Math.round(analysisResult.score);
  }
  
  // Fallback to a reasonable default score
  return 75;
};
