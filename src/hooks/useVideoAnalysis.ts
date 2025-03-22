
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { analyzeVideo, saveAnalysisResult, AnalysisResponse } from '@/utils/videoAnalysisService';
import { supabase } from '@/integrations/supabase/client';

// Add type definition for the window object to avoid TypeScript errors
declare global {
  interface Window {
    usedFallbackData?: boolean;
  }
}

export function useVideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAnalyzeVideo = async (
    videoFile: File | null,
    sportId: string | undefined,
    drillId: string | undefined,
    poseMetrics: any,
    navigate: (path: string) => void,
    callbacks: {
      onAnalysisStart: () => void,
      onAnalysisComplete: (result: any, behavior: any) => void,
      onAnalysisError: (error: Error) => void,
      forceDemoMode?: boolean
    }
  ) => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      console.log('User not authenticated, redirecting to auth page');
      toast({
        title: "Authentication required",
        description: "Please sign in to analyze videos",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setIsAnalyzing(true);
    setApiError(null);
    setIsDemoMode(callbacks.forceDemoMode || false);
    setAnalysisId(undefined);
    
    callbacks.onAnalysisStart();
    
    console.log('Starting analysis for', videoFile.name, 'in', sportId, drillId);
    console.log('Current user:', user.id);
    console.log('Demo mode:', callbacks.forceDemoMode ? 'ENABLED (user selected)' : 'DISABLED');
    
    try {
      console.log('Initiating video analysis');
      const analysisData: AnalysisResponse = await analyzeVideo(
        videoFile, 
        callbacks?.onAnalysisComplete ? drillId || "Technique" : "Technique",
        sportId || "generic",
        callbacks.forceDemoMode
      );
      
      console.log('Analysis completed successfully:', analysisData);
      callbacks.onAnalysisComplete(analysisData.result, analysisData.behavior);
      
      if (window.usedFallbackData || callbacks.forceDemoMode) {
        console.log('Using demo mode for analysis');
        setIsDemoMode(true);
        window.dispatchEvent(new CustomEvent('analysis-status', { 
          detail: { isDemoMode: true } 
        }));
      }
      
      // Now save the analysis result to Supabase
      setIsSaving(true);
      console.log('Saving analysis result to database');
      
      // Verify user is still authenticated before saving
      if (!user) {
        console.error('User is not authenticated when trying to save analysis');
        throw new Error('Authentication required to save analysis results');
      }
      
      // Log authentication status before saving
      const { data: authData } = await supabase.auth.getSession();
      console.log("Auth session before saving:", {
        hasSession: !!authData?.session,
        userId: authData?.session?.user?.id
      });

      // Try to save the result
      const saveResult = await saveAnalysisResult(
        videoFile,
        sportId || "generic",
        drillId || "technique",
        analysisData.result,
        analysisData.behavior
      );
      
      if (saveResult?.id) {
        console.log('Analysis saved with ID:', saveResult.id);
        setAnalysisId(saveResult.id);
        
        // Confirm success to user
        toast({
          title: "Analysis Saved",
          description: "Your analysis has been successfully saved to your account",
          variant: "default"
        });
      } else {
        console.warn('No ID returned from saveAnalysisResult');
        toast({
          title: "Warning",
          description: "Analysis completed but there may have been an issue saving it",
          variant: "destructive"
        });
      }
      
      toast({
        title: "Analysis Complete",
        description: isDemoMode || callbacks.forceDemoMode
          ? "Your technique has been analyzed using demo mode" 
          : "Your technique has been successfully analyzed and saved"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error occurred");
      
      if (error instanceof Error) {
        callbacks.onAnalysisError(error);
      }
      
      // Check for specific errors
      if (error instanceof Error && 
         (error.message.includes("exceeded the maximum allowed size") || 
          error.message.includes("file size exceeds"))) {
        toast({
          title: "Video too large",
          description: "Please upload a smaller video file (max 50MB)",
          variant: "destructive"
        });
      } else if (error instanceof Error && error.message.includes("Authentication")) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again to analyze videos",
          variant: "destructive"
        });
        navigate('/auth');
      } else if (error instanceof Error && error.message.includes("GPT-4o analysis failed")) {
        toast({
          title: "Analysis Service Error",
          description: "The AI analysis service is currently unavailable. Please try again later or use demo mode.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your video. Please try again or enable demo mode.",
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  return {
    isAnalyzing,
    isSaving,
    apiError,
    isDemoMode,
    analysisId,
    handleAnalyzeVideo,
    setApiError,
    setIsDemoMode,
    setAnalysisId
  };
}
