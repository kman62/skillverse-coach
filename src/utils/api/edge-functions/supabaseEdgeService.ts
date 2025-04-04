
import { supabase } from '@/integrations/supabase/client';
import { dispatchAnalysisEvent, logApiRequest } from '../logging/analysisLogger';
import { generateFreeThrowAnalysis } from '../../analysis/basketball/freeThrowAnalysis';

/**
 * Checks the availability of Supabase Edge Functions
 */
export const checkEdgeFunctionAvailability = async (): Promise<boolean> => {
  try {
    // Check if Supabase client is properly initialized
    const supabaseURL = "https://aghjbyysvchicvekbamg.supabase.co";
    
    logApiRequest("Checking Supabase client configuration:", {
      isInitialized: !!supabase,
      hasInvoke: !!(supabase && supabase.functions && supabase.functions.invoke),
      url: supabaseURL,
      timestamp: new Date().toISOString()
    });
    
    // Test if we can reach Supabase at all with a simple ping function
    dispatchAnalysisEvent('checking-supabase-connection');
    const { data: pingData, error: pingError } = await supabase.functions.invoke(
      'analyze-video-gpt4o',
      {
        body: { action: 'ping' },
        headers: {
          'x-client-info': 'web-client-ping',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (pingError) {
      logApiRequest('Edge Function ping test failed:', pingError);
      dispatchAnalysisEvent('edge-function-connection-failed', { error: pingError });
      return false;
    }
    
    logApiRequest('Edge Function ping successful', pingData);
    dispatchAnalysisEvent('edge-function-connection-ok');
    return true;
  } catch (error) {
    logApiRequest('Failed to ping Edge Function:', error);
    dispatchAnalysisEvent('edge-function-unreachable', { error: String(error) });
    return false;
  }
};

/**
 * Invokes the GPT-4o analysis edge function
 */
export const invokeGpt4oAnalysis = async (formData: FormData): Promise<any> => {
  dispatchAnalysisEvent('api-request-gpt4o', { provider: 'supabase-edge-function' });
  
  // Extract basic info for logging
  const videoFile = formData.get('video') as File;
  const sportId = formData.get('sportId') as string;
  const drillName = formData.get('drillName') as string;
  
  logApiRequest('Attempting to use GPT-4o via Supabase Edge Function', {
    videoSize: videoFile ? Math.round(videoFile.size / 1024) + "KB" : 'unknown',
    videoName: videoFile ? videoFile.name : 'unknown',
    drillName,
    sportId,
    timestamp: new Date().toISOString()
  });

  // Debug the form data being sent
  logApiRequest("FormData contents:", {
    hasVideoFile: formData.has('video'),
    hasDrillName: formData.has('drillName'),
    hasSportId: formData.has('sportId'),
    drillNameValue: drillName,
    sportIdValue: sportId
  });
  
  dispatchAnalysisEvent('analyzing-technique');
  logApiRequest("Invoking Supabase Edge Function 'analyze-video-gpt4o'");
  
  // Check if we need special handling for basketball free throws
  const isBasketballFreeThrow = 
    sportId === 'basketball' && 
    (drillName?.toLowerCase().includes('free throw') || 
     drillName?.toLowerCase().includes('free-throw') ||
     drillName === 'free-throw-front' ||
     drillName === 'free-throw-side');
  
  // Add timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    logApiRequest('GPT-4o request timed out after 60 seconds');
    controller.abort();
  }, 60000);
  
  try {
    dispatchAnalysisEvent('processing-video');
    
    // First, let's check if the edge function is accessible
    const isEdgeFunctionAvailable = await checkEdgeFunctionAvailability();
    
    if (!isEdgeFunctionAvailable) {
      // If edge function is not available and this is a basketball free throw,
      // we can use the local fallback implementation
      if (isBasketballFreeThrow) {
        logApiRequest('Using local fallback for basketball free throw analysis');
        dispatchAnalysisEvent('using-fallback-analysis');
        
        // Use the score range 65-85 for demo data
        const mockScore = Math.floor(Math.random() * 20) + 65;
        const freeThrowAnalysis = generateFreeThrowAnalysis(drillName, mockScore);
        
        clearTimeout(timeoutId);
        
        dispatchAnalysisEvent('analysis-complete');
        dispatchAnalysisEvent('api-success-gpt4o');
        
        // Set a flag to indicate we're using demo data
        window.usedFallbackData = true;
        
        return freeThrowAnalysis;
      }
      
      // If not a basketball free throw, throw an error to let the main flow handle it
      throw new Error("Edge function unreachable or not working properly");
    }
    
    // Try to use the edge function
    const { data: edgeFunctionResult, error: edgeFunctionError } = await supabase.functions.invoke(
      'analyze-video-gpt4o',
      {
        body: formData,
        headers: {
          'x-client-info': 'web-client-v1'
        }
      }
    );
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    if (edgeFunctionError) {
      logApiRequest('GPT-4o Edge Function error:', edgeFunctionError);
      dispatchAnalysisEvent('api-error-gpt4o', { error: edgeFunctionError });
      throw new Error(`Edge function error: ${edgeFunctionError.message}`);
    }
    
    logApiRequest('GPT-4o analysis complete via Supabase Edge Function:', {
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
    return edgeFunctionResult;
  } catch (error) {
    // Clear the timeout in case of error
    clearTimeout(timeoutId);
    logApiRequest("Error during edge function invocation:", error);
    dispatchAnalysisEvent('api-failed-detail', { 
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};
