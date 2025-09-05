
import { useToast } from '@/components/ui/use-toast';

/**
 * Custom hook to handle analysis errors
 */
export function useAnalysisErrors() {
  const { toast } = useToast();
  
  const handleAnalysisError = (error: Error, navigate: (path: string) => void) => {
    console.error("Analysis error:", error);
    
    // Check for specific errors
    if (error.message.includes("exceeded the maximum allowed size") || 
        error.message.includes("file size exceeds")) {
      toast({
        title: "Video too large",
        description: "Please upload a smaller video file (max 50MB)",
        variant: "destructive"
      });
    } else if (error.message.includes("Authentication")) {
      toast({
        title: "Authentication Error",
        description: "Please sign in again to analyze videos",
        variant: "destructive"
      });
      // navigate('/auth'); // Disabled for testing
    } else if (error.message.includes("GPT-4o analysis failed")) {
      toast({
        title: "Analysis Service Error",
        description: "The AI analysis service is currently unavailable. Please try again later or use demo mode.",
        variant: "destructive"
      });
    } else if (error.message.includes("No video file provided")) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your video. Please try again or enable demo mode.",
        variant: "destructive"
      });
    }
    
    return error.message;
  };
  
  return { handleAnalysisError };
}
