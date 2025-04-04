
import { supabase } from '@/integrations/supabase/client';
import { dispatchAnalysisEvent, logApiRequest } from '../logging/analysisLogger';

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
      url: supabaseURL
    });
    
    // Test if we can reach Supabase at all with a simple ping function
    dispatchAnalysisEvent('checking-supabase-connection');
    const { data: pingData, error: pingError } = await supabase.functions.invoke(
      'analyze-video-gpt4o',
      {
        body: { action: 'ping' },
        headers: {
          'x-client-info': 'web-client-ping'
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
    // Even if the check fails, return true if we know analysis is working (this avoids unnecessary warnings)
    return false;
  }
};

/**
 * Invokes the GPT-4o analysis edge function
 */
export const invokeGpt4oAnalysis = async (formData: FormData): Promise<any> => {
  dispatchAnalysisEvent('api-request-gpt4o', { provider: 'supabase-edge-function' });
  logApiRequest('Attempting to use GPT-4o via Supabase Edge Function', {
    videoSize: formData.has('video') ? Math.round((formData.get('video') as File).size / 1024) + "KB" : 'unknown',
    videoName: formData.has('video') ? (formData.get('video') as File).name : 'unknown',
    drillName: formData.get('drillName'),
    sportId: formData.get('sportId'),
    timestamp: new Date().toISOString()
  });

  // Debug the form data being sent
  logApiRequest("FormData contents:", {
    hasVideoFile: formData.has('video'),
    hasDrillName: formData.has('drillName'),
    hasSportId: formData.has('sportId'),
    drillNameValue: formData.get('drillName'),
    sportIdValue: formData.get('sportId')
  });
  
  dispatchAnalysisEvent('analyzing-technique');
  logApiRequest("Invoking Supabase Edge Function 'analyze-video-gpt4o'");
  
  // Add timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    logApiRequest('GPT-4o request timed out after 60 seconds');
    controller.abort();
  }, 60000);
  
  try {
    dispatchAnalysisEvent('processing-video');
    
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
