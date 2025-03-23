
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the OpenAI API key is valid by making a test request to the edge function
 */
export const checkOpenAIApiKey = async (): Promise<{
  isValid: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('Testing OpenAI API key validity...');
    
    const { data, error } = await supabase.functions.invoke(
      'analyze-video-gpt4o/check-api-key',
      {
        method: 'GET'
      }
    );
    
    if (error) {
      console.error('API key check failed:', error);
      return {
        isValid: false,
        message: `Error checking API key: ${error.message}`,
        details: error
      };
    }
    
    console.log('API key check response:', data);
    
    if (data.status === 'valid') {
      return {
        isValid: true,
        message: 'OpenAI API key is valid and working correctly.',
        details: data
      };
    } else {
      return {
        isValid: false,
        message: data.error || 'API key validation failed without a specific error message.',
        details: data
      };
    }
  } catch (error) {
    console.error('Error checking API key:', error);
    return {
      isValid: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};
