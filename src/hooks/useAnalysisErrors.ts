
import { useToast } from '@/hooks/use-toast';

/**
 * Custom hook to handle analysis errors with user-friendly messages
 */
export function useAnalysisErrors() {
  const { toast } = useToast();
  
  const handleAnalysisError = (error: Error, navigate: (path: string) => void) => {
    console.error("Analysis error:", error);
    
    // Check for specific errors and provide user-friendly messages
    if (error.message.includes("exceeded the maximum allowed size") || 
        error.message.includes("file size exceeds")) {
      toast({
        title: "Video too large",
        description: "Please upload a smaller video file (max 50MB)",
        variant: "destructive"
      });
    } else if (error.message.includes("Rate limit") || error.message.includes("busy")) {
      toast({
        title: "Too Many Requests",
        description: "Please wait a moment and try again",
        variant: "destructive"
      });
    } else if (error.message.includes("credits") || error.message.includes("402")) {
      toast({
        title: "Service Unavailable",
        description: "AI credits depleted. Please contact support.",
        variant: "destructive"
      });
    } else if (error.message.includes("Authentication")) {
      toast({
        title: "Authentication Error",
        description: "Please sign in again to analyze videos",
        variant: "destructive"
      });
    } else if (error.message.includes("GPT-4o analysis failed") || 
               error.message.includes("AI") ||
               error.message.includes("analysis service")) {
      toast({
        title: "Analysis Service Error",
        description: error.message || "The AI analysis service encountered an error. Please try again.",
        variant: "destructive"
      });
    } else if (error.message.includes("No video file provided")) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
    } else if (error.message.includes("malformed") || error.message.includes("parse")) {
      toast({
        title: "Analysis Error",
        description: "Received incomplete analysis. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your video. Please try again or enable demo mode.",
        variant: "destructive"
      });
    }
    
    return error.message;
  };
  
  return { handleAnalysisError };
}
