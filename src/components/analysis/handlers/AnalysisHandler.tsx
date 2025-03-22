
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeVideo, saveAnalysisResult, AnalysisResponse } from '@/utils/videoAnalysisService';

export const useAnalysisHandler = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnalyzeClick = async (
    videoFile: File | null,
    drill: any,
    sportId: string | undefined,
    drillId: string | undefined,
    poseMetrics: any,
    setIsAnalyzing: (isAnalyzing: boolean) => void,
    setApiError: (error: string | null) => void,
    setIsDemoMode: (isDemoMode: boolean) => void,
    setAnalysisId: (id: string | undefined) => void,
    setAnalysisResult: (result: any) => void,
    setBehaviorAnalysis: (behavior: any) => void,
    handlePoseAnalysis: (metrics: any) => void,
    setIsSaving: (isSaving: boolean) => void
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
    setIsDemoMode(false);
    setAnalysisId(undefined);
    
    const useLocalAnalysis = localStorage.getItem('useLocalAnalysis') === 'true';
    
    if (useLocalAnalysis) {
      setTimeout(() => {
        if (poseMetrics) {
          handlePoseAnalysis(poseMetrics);
        } else {
          setIsDemoMode(true);
          toast({
            title: "Local Analysis Complete",
            description: "Using pose detection for real-time analysis",
          });
        }
        setIsAnalyzing(false);
      }, 2000);
      return;
    }
    
    try {
      const analysisData: AnalysisResponse = await analyzeVideo(
        videoFile, 
        drill?.name || "Technique",
        sportId || "generic"
      );
      
      setAnalysisResult(analysisData.result);
      setBehaviorAnalysis(analysisData.behavior);
      
      if ((window as any).usedFallbackData) {
        setIsDemoMode(true);
        window.dispatchEvent(new CustomEvent('analysis-status', { 
          detail: { isDemoMode: true } 
        }));
      }
      
      setIsSaving(true);
      const saveResult = await saveAnalysisResult(
        videoFile,
        sportId || "generic",
        drillId || "technique",
        analysisData.result,
        analysisData.behavior
      );
      
      if (saveResult?.id) {
        setAnalysisId(saveResult.id);
      }
      
      toast({
        title: "Analysis Complete",
        description: (window as any).usedFallbackData
          ? "Your technique has been analyzed using demo mode" 
          : "Your technique has been successfully analyzed and saved"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error occurred");
      
      if (error instanceof Error && 
         (error.message.includes("exceeded the maximum allowed size") || 
          error.message.includes("file size exceeds"))) {
        toast({
          title: "Video too large",
          description: "Please upload a smaller video file (max 50MB)",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: "There was an error analyzing your video. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
      setIsSaving(false);
    }
  };

  return { handleAnalyzeClick };
};
