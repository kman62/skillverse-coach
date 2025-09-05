
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysisErrors } from './useAnalysisErrors';
import { performVideoAnalysis, saveAnalysisData } from '@/utils/analysis/analysisService';

export function useVideoAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
      onAnalysisError: (error: Error) => void
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
    
    // Skip auth check for testing
    // if (!user) {
    //   console.log('User not authenticated, redirecting to auth page');
    //   toast({
    //     title: "Authentication required",
    //     description: "Please sign in to analyze videos",
    //     variant: "destructive"
    //   });
    //   navigate('/auth');
    //   return;
    // }
    
    // Reset states
    setIsAnalyzing(true);
    setApiError(null);
    setAnalysisId(undefined);
    
    callbacks.onAnalysisStart();
    
    console.log('Current user:', user.id);
    
    try {
      // Step 1: Analyze the video
      const analysisResult = await performVideoAnalysis(
        videoFile,
        sportId,
        drillId
      );
      
      // Update UI with results
      callbacks.onAnalysisComplete(analysisResult.result, analysisResult.behavior);
      
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
        description: "Your technique has been successfully analyzed and saved"
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
    analysisId,
    handleAnalyzeVideo,
    setApiError,
    setAnalysisId
  };
}
