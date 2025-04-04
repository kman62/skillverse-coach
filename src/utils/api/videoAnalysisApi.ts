
import { AnalysisResponse } from '../analysis/analysisTypes';
import { MAX_FILE_SIZE } from '../constants/fileConfig';
import { checkEdgeFunctionAvailability, invokeGpt4oAnalysis } from './edge-functions/supabaseEdgeService';
import { generateDemoAnalysis } from './demo/demoAnalysisService';
import { dispatchAnalysisEvent, logApiRequest } from './logging/analysisLogger';

/**
 * Analyzes a video file and returns analysis results
 */
export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string,
  forceDemoMode?: boolean
): Promise<AnalysisResponse> => {
  logApiRequest(`Starting video analysis for ${sportId}/${drillName}`, { 
    fileSize: videoFile.size,
    fileName: videoFile.name,
    fileType: videoFile.type,
    timestamp: new Date().toISOString(),
    forceDemoMode: !!forceDemoMode
  });
  
  // Check file size before attempting to upload
  if (videoFile.size > MAX_FILE_SIZE) {
    const errorMsg = `Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  // If demo mode is explicitly requested, skip the API calls
  if (forceDemoMode) {
    logApiRequest("Demo mode explicitly requested by user");
    return generateDemoAnalysis(sportId, drillName);
  }
  
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);
  formData.append("sportId", sportId);
  
  dispatchAnalysisEvent('started');

  try {
    // First verify Edge Function availability
    const isEdgeFunctionAvailable = await checkEdgeFunctionAvailability();
    
    if (!isEdgeFunctionAvailable) {
      throw new Error('Edge function unreachable or not working properly');
    }
    
    // Proceed with GPT-4o analysis
    return await invokeGpt4oAnalysis(formData);
  } catch (gpt4oError) {
    logApiRequest("GPT-4o analysis failed:", gpt4oError);
    dispatchAnalysisEvent('api-failed-gpt4o', { error: String(gpt4oError) });
    
    // Instead of falling back to demo mode, throw the error
    throw new Error(`GPT-4o analysis failed: ${gpt4oError instanceof Error ? gpt4oError.message : String(gpt4oError)}`);
  }
};
