
import { analyzeVideo, saveAnalysisResult } from '@/utils/videoAnalysisService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Handle the process of analyzing a video and handling errors
 */
export const performVideoAnalysis = async (
  videoFile: File | null,
  sportId: string | undefined,
  drillId: string | undefined,
  forceDemoMode: boolean = false
) => {
  console.log('Starting analysis for', videoFile?.name, 'in', sportId, drillId);
  
  if (!videoFile) {
    throw new Error("No video file provided");
  }
  
  // Verify user is authenticated
  const { data: authData } = await supabase.auth.getSession();
  console.log("Auth session before analysis:", {
    hasSession: !!authData?.session,
    userId: authData?.session?.user?.id
  });
  
  if (!authData?.session?.user) {
    throw new Error("Authentication required to analyze videos");
  }
  
  console.log('Initiating video analysis');
  const analysisData = await analyzeVideo(
    videoFile, 
    drillId || "Technique",
    sportId || "generic",
    forceDemoMode
  );
  
  console.log('Analysis completed successfully:', {
    analysisType: analysisData.analysisType,
    metrics: analysisData.result.metrics?.map((m: any) => m.name).join(', ')
  });
  
  // Ensure the analysisType is preserved in the result
  if (analysisData.analysisType) {
    analysisData.result.analysisType = analysisData.analysisType;
  }
  
  return {
    result: analysisData.result,
    behavior: analysisData.behavior,
    isDemoMode: window.usedFallbackData || forceDemoMode
  };
};

/**
 * Save the analysis results to the database
 */
export const saveAnalysisData = async (
  videoFile: File,
  sportId: string | undefined,
  drillId: string | undefined,
  analysisResult: any,
  behaviorAnalysis: any
) => {
  console.log('Saving analysis result to database');
  
  // Verify auth status before saving
  const { data: authData } = await supabase.auth.getSession();
  console.log("Auth session before saving:", {
    hasSession: !!authData?.session,
    userId: authData?.session?.user?.id
  });

  if (!authData?.session?.user) {
    throw new Error('Authentication required to save analysis results');
  }

  // Try to save the result
  const saveResult = await saveAnalysisResult(
    videoFile,
    sportId || "generic",
    drillId || "technique",
    analysisResult,
    behaviorAnalysis
  );
  
  return saveResult;
};
