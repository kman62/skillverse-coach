
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
    console.log('Attempting to use GPT-4o via Supabase Edge Function');
    
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('GPT-4o request timed out after 60 seconds');
      controller.abort();
    }, 60000);
    
    try {
      // Use direct invocation to avoid POST issues
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
      
      console.log('GPT-4o analysis complete via Supabase Edge Function');
      dispatchAnalysisEvent('api-success-gpt4o');
      
      // Add GPT-4o marker to the result
      if (edgeFunctionResult.result && !edgeFunctionResult.result.provider) {
        edgeFunctionResult.result.provider = "gpt-4o";
      }
      
      return edgeFunctionResult as AnalysisResponse;
    } catch (error) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (gpt4oError) {
    console.warn("GPT-4o analysis failed:", gpt4oError);
    dispatchAnalysisEvent('api-failed-gpt4o', { error: String(gpt4oError) });
    
    // For demonstration purposes, fall back to mock data
    console.log("Using fallback mock data due to GPT-4o failure");
    toast({
      title: "Using demo mode",
      description: "Could not connect to GPT-4o. Using demo data instead.",
      variant: "default"
    });
    
    // Set global flag for demo mode
    window.usedFallbackData = true;
    dispatchAnalysisEvent('using-demo-data');
    
    // Simulate a brief delay to make the fallback feel more realistic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate fallback analysis data based on drill name and sport
    console.log(`Generating fallback analysis data for ${sportId}/${drillName}`);
    const mockData = generateSportSpecificAnalysis(sportId, drillName);
    dispatchAnalysisEvent('demo-data-generated');
    return mockData;
  }
};
