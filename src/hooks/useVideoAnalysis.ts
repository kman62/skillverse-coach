
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysisErrors } from './useAnalysisErrors';
import { performVideoAnalysis, saveAnalysisData } from '@/utils/analysis/analysisService';

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
  const { handleAnalysisError } = useAnalysisErrors();

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
    
    // Reset states
    setIsAnalyzing(true);
    setApiError(null);
    setIsDemoMode(callbacks.forceDemoMode || false);
    setAnalysisId(undefined);
    
    callbacks.onAnalysisStart();
    
    console.log('Current user:', user.id);
    console.log('Demo mode:', callbacks.forceDemoMode ? 'ENABLED (user selected)' : 'DISABLED');
    
    try {
      // Step 1: Analyze the video
      const analysisResult = await performVideoAnalysis(
        videoFile,
        sportId,
        drillId,
        callbacks.forceDemoMode
      );
      
      // Update UI with results
      callbacks.onAnalysisComplete(analysisResult.result, analysisResult.behavior);
      
      if (analysisResult.isDemoMode) {
        console.log('Using demo mode for analysis');
        setIsDemoMode(true);
        window.dispatchEvent(new CustomEvent('analysis-status', { 
          detail: { isDemoMode: true } 
        }));
      }
      
      // Step 2: Save the results
      setIsSaving(true);
      
      // Save analysis results
      const saveResult = await saveAnalysisData(
        videoFile,
        sportId,
        drillId,
        analysisResult.result,
        analysisResult.behavior
      );
      
      if (saveResult?.id) {
        console.log('Analysis saved with ID:', saveResult.id);
        setAnalysisId(saveResult.id);
        
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
      
      // Show success message
      toast({
        title: "Analysis Complete",
        description: isDemoMode || callbacks.forceDemoMode
          ? "Your technique has been analyzed using demo mode" 
          : "Your technique has been successfully analyzed and saved"
      });
    } catch (error) {
      if (error instanceof Error) {
        setApiError(handleAnalysisError(error, navigate));
        callbacks.onAnalysisError(error);
      } else {
        setApiError("Unknown error occurred");
        callbacks.onAnalysisError(new Error("Unknown error occurred"));
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
