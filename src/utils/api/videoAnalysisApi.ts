
import { getApiUrl, getFallbackApiUrl } from './apiClient';
import { AnalysisResponse } from '../analysis/analysisTypes';
import { MAX_FILE_SIZE } from '../constants/fileConfig';
import { toast } from '@/hooks/use-toast';
import { generateSportSpecificAnalysis } from '../analysis/analysisSelector';
import { supabase } from '@/integrations/supabase/client';

/**
 * Analyzes a video file and returns analysis results
 */
export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string,
  forceDemoMode?: boolean
): Promise<AnalysisResponse> => {
  console.log(`Starting video analysis for ${sportId}/${drillName}`, { 
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
  
  // Custom event for tracking analysis stages
  const dispatchAnalysisEvent = (stage: string, detail: any = {}) => {
    console.log(`Analysis stage: ${stage}`, detail);
    window.dispatchEvent(new CustomEvent('analysis-stage', { 
      detail: { stage, ...detail }
    }));
  };
  
  // If demo mode is explicitly requested, skip the API calls
  if (forceDemoMode) {
    console.log("Demo mode explicitly requested by user");
    dispatchAnalysisEvent('using-demo-data');
    
    // Set global flag for demo mode
    window.usedFallbackData = true;
    
    // Simulate a brief delay to make the demo feel more realistic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate demo analysis data based on drill name and sport
    console.log(`Generating demo analysis data for ${sportId}/${drillName}`);
    const mockData = generateSportSpecificAnalysis(sportId, drillName);
    dispatchAnalysisEvent('demo-data-generated');
    return mockData;
  }
  
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);
  formData.append("sportId", sportId);
  
  dispatchAnalysisEvent('started');
  
  // Try to use Supabase Edge Function for GPT-4o analysis
  try {
    dispatchAnalysisEvent('api-request-gpt4o', { provider: 'supabase-edge-function' });
    console.log('Attempting to use GPT-4o via Supabase Edge Function', {
      videoSize: Math.round(videoFile.size / 1024) + "KB",
      videoName: videoFile.name,
      drillName,
      sportId,
      timestamp: new Date().toISOString()
    });
    
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('GPT-4o request timed out after 60 seconds');
      controller.abort();
    }, 60000);
    
    try {
      dispatchAnalysisEvent('processing-video');
      
      // Debug the form data being sent
      console.log("FormData contents:", {
        hasVideoFile: formData.has('video'),
        hasDrillName: formData.has('drillName'),
        hasSportId: formData.has('sportId'),
        drillNameValue: formData.get('drillName'),
        sportIdValue: formData.get('sportId')
      });
      
      // Use direct invocation to avoid POST issues
      dispatchAnalysisEvent('analyzing-technique');
      console.log("Invoking Supabase Edge Function 'analyze-video-gpt4o'");
      
      const { data: edgeFunctionResult, error: edgeFunctionError } = await supabase.functions.invoke(
        'analyze-video-gpt4o',
        {
          body: formData,
          headers: {
            'x-client-id': 'web-client-v1'
          }
        }
      );
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (edgeFunctionError) {
        console.warn('GPT-4o Edge Function error:', edgeFunctionError);
        dispatchAnalysisEvent('api-error-gpt4o', { error: edgeFunctionError });
        throw new Error(`Edge function error: ${edgeFunctionError.message}`);
      }
      
      console.log('GPT-4o analysis complete via Supabase Edge Function:', {
        success: true,
        hasResult: !!edgeFunctionResult?.result,
        hasBehavior: !!edgeFunctionResult?.behavior,
        timestamp: new Date().toISOString()
      });
      
      dispatchAnalysisEvent('api-success-gpt4o');
      dispatchAnalysisEvent('generating-feedback');
      
      // Add GPT-4o marker to the result
      if (edgeFunctionResult.result && !edgeFunctionResult.result.provider) {
        edgeFunctionResult.result.provider = "gpt-4o";
      }
      
      dispatchAnalysisEvent('analysis-complete');
      return edgeFunctionResult as AnalysisResponse;
    } catch (error) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId);
      console.error("Error during edge function invocation:", error);
      dispatchAnalysisEvent('api-failed-detail', { 
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  } catch (gpt4oError) {
    console.warn("GPT-4o analysis failed:", gpt4oError);
    dispatchAnalysisEvent('api-failed-gpt4o', { error: String(gpt4oError) });
    
    // Throw a clear error message - we don't attempt any alternative methods
    throw new Error(`The AI analysis service is currently unavailable. Please enable Demo Mode if you want to continue.`);
  }
};
