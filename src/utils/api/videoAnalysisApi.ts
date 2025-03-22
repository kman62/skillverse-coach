
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
  sportId: string
): Promise<AnalysisResponse> => {
  console.log(`Starting video analysis for ${sportId}/${drillName}`, { 
    fileSize: videoFile.size,
    fileName: videoFile.name,
    fileType: videoFile.type,
    timestamp: new Date().toISOString()
  });
  
  // Check file size before attempting to upload
  if (videoFile.size > MAX_FILE_SIZE) {
    const errorMsg = `Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);
  formData.append("sportId", sportId);
  
  // Custom event for tracking analysis stages
  const dispatchAnalysisEvent = (stage: string, detail: any = {}) => {
    console.log(`Analysis stage: ${stage}`, detail);
    window.dispatchEvent(new CustomEvent('analysis-stage', { 
      detail: { stage, ...detail }
    }));
  };
  
  dispatchAnalysisEvent('started');
  
  // Try to use Supabase Edge Function first for GPT-4o analysis
  try {
    dispatchAnalysisEvent('api-request-gpt4o', { provider: 'supabase-edge-function' });
    console.log('Attempting to use GPT-4o via Supabase Edge Function');
    
    const { data: edgeFunctionResult, error: edgeFunctionError } = await supabase.functions.invoke(
      'analyze-video-gpt4o',
      {
        body: formData,
        headers: {
          'x-client-id': 'web-client-v1',
        },
      }
    );
    
    if (edgeFunctionError) {
      console.warn('GPT-4o Edge Function error:', edgeFunctionError);
      dispatchAnalysisEvent('api-error-gpt4o', { error: edgeFunctionError });
      throw new Error(`Edge function error: ${edgeFunctionError.message}`);
    }
    
    console.log('GPT-4o analysis complete via Supabase Edge Function');
    dispatchAnalysisEvent('api-success-gpt4o');
    return edgeFunctionResult as AnalysisResponse;
  } catch (gpt4oError) {
    console.warn("GPT-4o analysis failed:", gpt4oError);
    dispatchAnalysisEvent('api-failed-gpt4o', { error: String(gpt4oError) });
    
    // Track if we're using the primary API or fallback
    let usingFallbackApi = false;
    
    try {
      const primaryApiUrl = getApiUrl();
      console.log(`Falling back to primary API at ${primaryApiUrl} for ${sportId}/${drillName}`);
      dispatchAnalysisEvent('api-request-primary', { url: primaryApiUrl });
      
      // Add timeout of 45 seconds for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Primary API request timed out after 45 seconds');
        controller.abort();
      }, 45000);
      
      // Attempt primary API call
      try {
        const response = await fetch(primaryApiUrl, {
          method: 'POST',
          headers: {
            // In a real implementation, we would use environment variables or Supabase secrets
            'x-api-key': 'aithlete-api-2025',
            'x-client-id': 'web-client-v1',
          },
          body: formData,
          signal: controller.signal
        });
        
        // Clear the timeout regardless of the result
        clearTimeout(timeoutId);
        
        console.log('Primary API response received:', { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        });
        
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Primary API error response:', { 
            status: response.status,
            error: errorBody
          });
          dispatchAnalysisEvent('api-error-primary', { 
            status: response.status,
            error: errorBody
          });
          throw new Error(`Primary API responded with status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Primary API analysis complete - successful response');
        dispatchAnalysisEvent('api-success-primary');
        return data as AnalysisResponse;
      } catch (primaryApiError) {
        console.warn("Primary API connection failed:", primaryApiError);
        dispatchAnalysisEvent('api-failed-primary', { error: String(primaryApiError) });
        
        // If primary API fails, try fallback API
        usingFallbackApi = true;
        const fallbackApiUrl = getFallbackApiUrl();
        console.log(`Attempting fallback API at ${fallbackApiUrl}`);
        dispatchAnalysisEvent('api-request-fallback', { url: fallbackApiUrl });
        
        // Create a new controller for the fallback request
        const fallbackController = new AbortController();
        const fallbackTimeoutId = setTimeout(() => {
          console.log('Fallback API request timed out after 45 seconds');
          fallbackController.abort();
        }, 45000);
        
        try {
          const fallbackResponse = await fetch(fallbackApiUrl, {
            method: 'POST',
            headers: {
              'x-api-key': 'aithlete-fallback-2025',
            },
            body: formData,
            signal: fallbackController.signal
          });
          
          clearTimeout(fallbackTimeoutId);
          
          console.log('Fallback API response received:', { 
            status: fallbackResponse.status, 
            statusText: fallbackResponse.statusText,
            ok: fallbackResponse.ok
          });
          
          if (!fallbackResponse.ok) {
            const fallbackErrorBody = await fallbackResponse.text();
            console.error('Fallback API error response:', { 
              status: fallbackResponse.status,
              error: fallbackErrorBody
            });
            dispatchAnalysisEvent('api-error-fallback', { 
              status: fallbackResponse.status,
              error: fallbackErrorBody
            });
            throw new Error(`Fallback API responded with status: ${fallbackResponse.status} - ${fallbackResponse.statusText}`);
          }
          
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback API analysis complete - successful response');
          dispatchAnalysisEvent('api-success-fallback');
          return fallbackData as AnalysisResponse;
        } catch (fallbackError) {
          console.error('Fallback API request failed:', fallbackError);
          dispatchAnalysisEvent('api-failed-fallback', { error: String(fallbackError) });
          throw fallbackError;
        }
      }
    } catch (error) {
      console.warn("All API connections failed:", error);
      dispatchAnalysisEvent('api-failed-all', { error: String(error) });
      
      // For demonstration purposes, fall back to mock data as last resort
      // In production, you might want to show a meaningful error message
      
      // If the error is a timeout or network error, we'll show a specific message
      const isNetworkError = 
        error instanceof TypeError || 
        (error instanceof Error && error.name === 'AbortError');
      
      if (isNetworkError) {
        console.log("Using fallback mock data due to network/timeout issue");
        toast({
          title: "Using demo mode",
          description: "Could not connect to analysis server. Using demo data instead.",
          variant: "default"
        });
      }
      
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
  }
};
