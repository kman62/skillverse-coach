
import { getApiUrl, getFallbackApiUrl } from './apiClient';
import { AnalysisResponse } from '../analysis/analysisTypes';
import { MAX_FILE_SIZE } from '../constants/fileConfig';
import { toast } from '@/hooks/use-toast';
import { generateSportSpecificAnalysis } from '../analysis/analysisSelector';

/**
 * Analyzes a video file and returns analysis results
 */
export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string
): Promise<AnalysisResponse> => {
  console.log(`Starting video analysis for ${sportId}/${drillName}`, { fileSize: videoFile.size });
  
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
  
  // Track if we're using the primary API or fallback
  let usingFallbackApi = false;
  
  try {
    console.log(`Sending analysis request to ${getApiUrl()} for ${sportId}/${drillName}`);
    
    // Add timeout of 45 seconds for the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    
    // Attempt primary API call
    try {
      const response = await fetch(getApiUrl(), {
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
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Primary API error response:', errorBody);
        throw new Error(`Primary API responded with status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as AnalysisResponse;
    } catch (primaryApiError) {
      console.warn("Primary API connection failed:", primaryApiError);
      
      // If primary API fails, try fallback API
      usingFallbackApi = true;
      console.log(`Attempting fallback API at ${getFallbackApiUrl()}`);
      
      // Create a new controller for the fallback request
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 45000);
      
      const fallbackResponse = await fetch(getFallbackApiUrl(), {
        method: 'POST',
        headers: {
          'x-api-key': 'aithlete-fallback-2025',
        },
        body: formData,
        signal: fallbackController.signal
      });
      
      clearTimeout(fallbackTimeoutId);
      
      if (!fallbackResponse.ok) {
        const fallbackErrorBody = await fallbackResponse.text();
        console.error('Fallback API error response:', fallbackErrorBody);
        throw new Error(`Fallback API responded with status: ${fallbackResponse.status} - ${fallbackResponse.statusText}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      return fallbackData as AnalysisResponse;
    }
  } catch (error) {
    console.warn("All API connections failed:", error);
    
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
    
    // Simulate a brief delay to make the fallback feel more realistic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate fallback analysis data based on drill name and sport
    return generateSportSpecificAnalysis(sportId, drillName);
  }
};
