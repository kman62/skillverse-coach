
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
    setIsDemoMode(false);
    setAnalysisId(undefined);
    
    callbacks.onAnalysisStart();
    
    console.log('Starting analysis for', videoFile.name, 'in', sportId, drillId);
    console.log('Current user:', user.id);
    
    const useLocalAnalysis = localStorage.getItem('useLocalAnalysis') === 'true';
    console.log('Using local analysis?', useLocalAnalysis);
    
    let analysisResult: any = null;
    let behaviorAnalysis: any = null;
    
    if (useLocalAnalysis) {
      setTimeout(() => {
        if (poseMetrics) {
          console.log('Using existing pose metrics for local analysis');
          // Generate analysis data from poseMetrics
          const localAnalysisData = generateLocalAnalysisData(poseMetrics, drillId || 'technique');
          analysisResult = localAnalysisData.result;
          behaviorAnalysis = localAnalysisData.behavior;
          
          // Set results
          callbacks.onAnalysisComplete(analysisResult, behaviorAnalysis);
        } else {
          console.log('No pose metrics available, using demo mode');
          setIsDemoMode(true);
          // Set window property to indicate we're using fallback data
          window.usedFallbackData = true;
          
          // Generate basic demo data
          const demoData = generateDemoAnalysisData(drillId || 'technique');
          analysisResult = demoData.result;
          behaviorAnalysis = demoData.behavior;
          
          // Set results
          callbacks.onAnalysisComplete(analysisResult, behaviorAnalysis);
          
          toast({
            title: "Local Analysis Complete",
            description: "Using demo mode for analysis",
          });
        }
        
        setIsAnalyzing(false);
        
        // Save analysis to database even for local analysis
        saveLocalAnalysisToDatabase(
          videoFile,
          sportId || 'generic',
          drillId || 'technique',
          analysisResult,
          behaviorAnalysis,
          user.id,
          setIsSaving,
          setAnalysisId,
          toast
        );
      }, 2000);
      return;
    }
    
    try {
      console.log('Initiating API-based video analysis');
      const analysisData: AnalysisResponse = await analyzeVideo(
        videoFile, 
        callbacks?.onAnalysisComplete ? drillId || "Technique" : "Technique",
        sportId || "generic"
      );
      
      console.log('Analysis completed successfully:', analysisData);
      callbacks.onAnalysisComplete(analysisData.result, analysisData.behavior);
      
      if (window.usedFallbackData) {
        console.log('API indicated fallback data was used');
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
        description: isDemoMode 
          ? "Your technique has been analyzed using demo mode" 
          : "Your technique has been successfully analyzed and saved"
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error occurred");
      
      if (error instanceof Error) {
        callbacks.onAnalysisError(error);
      }
      
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

  // Helper function to save local analysis to database
  const saveLocalAnalysisToDatabase = async (
    videoFile: File,
    sportId: string,
    drillId: string,
    analysisResult: any,
    behaviorAnalysis: any,
    userId: string,
    setIsSaving: (value: boolean) => void,
    setAnalysisId: (value: string | undefined) => void,
    toast: any
  ) => {
    try {
      console.log('Saving local analysis to database...');
      setIsSaving(true);
      
      // Save analysis to database
      const saveResult = await saveAnalysisResult(
        videoFile,
        sportId,
        drillId,
        analysisResult,
        behaviorAnalysis
      );
      
      if (saveResult?.id) {
        console.log('Local analysis saved with ID:', saveResult.id);
        setAnalysisId(saveResult.id);
        
        toast({
          title: "Analysis Saved",
          description: "Your local analysis has been saved to your account",
          variant: "default"
        });
      } else {
        console.warn('Failed to save local analysis');
      }
    } catch (error) {
      console.error('Error saving local analysis:', error);
      toast({
        title: "Warning",
        description: "Analysis completed but there was an issue saving it to the database",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate basic demo analysis data
  const generateDemoAnalysisData = (drillName: string) => {
    return {
      result: {
        title: `${drillName} Analysis`,
        description: "Demo analysis mode",
        score: 78,
        metrics: [
          { name: "Form", value: 76, target: 90, unit: "%" },
          { name: "Speed", value: 82, target: 85, unit: "%" },
          { name: "Technique", value: 79, target: 95, unit: "%" },
          { name: "Balance", value: 74, target: 90, unit: "%" }
        ],
        feedback: {
          good: [
            "Good overall technique",
            "Consistent movements",
            "Good effort"
          ],
          improve: [
            "Focus on form over speed",
            "Maintain better balance",
            "Keep practicing for better results"
          ]
        },
        coachingTips: [
          "Practice this drill regularly",
          "Focus on technique before speed",
          "Record yourself to track progress",
          "Compare your form with reference videos"
        ]
      },
      behavior: {
        consistency: [
          {
            name: "Movement Pattern",
            description: "Your movement pattern could be improved.",
            quality: "needs-improvement",
            icon: null
          },
          {
            name: "Position Stability",
            description: "Your position stability is good.",
            quality: "good",
            icon: null
          }
        ],
        preRoutine: [
          {
            name: "Setup Position",
            description: "Your initial position looks good.",
            quality: "good",
            icon: null
          }
        ],
        habits: [
          {
            name: "Body Alignment",
            description: "Your body alignment needs improvement.",
            quality: "needs-improvement",
            icon: null
          }
        ],
        timing: {
          average: "1.5s",
          consistency: 82,
          isRushing: false,
          attempts: [{ attemptNumber: 1, duration: "1.5s" }]
        },
        fatigue: {
          level: "low",
          signs: ["No signs of fatigue detected"],
          recommendations: [
            "Continue with regular practice",
            "Focus on technique refinement"
          ]
        }
      }
    };
  };
  
  // Generate analysis from pose metrics
  const generateLocalAnalysisData = (metrics: any, drillName: string) => {
    return {
      result: {
        title: `${drillName} Analysis`,
        description: "Local pose detection analysis",
        score: Math.round((metrics.symmetry + metrics.stability + metrics.posture + metrics.form) / 4),
        metrics: [
          {
            name: "Form Quality",
            value: Math.round(metrics.form),
            target: 95,
            unit: "%"
          },
          {
            name: "Posture",
            value: Math.round(metrics.posture),
            target: 90,
            unit: "%"
          },
          {
            name: "Balance",
            value: Math.round(metrics.stability),
            target: 95,
            unit: "%"
          },
          {
            name: "Symmetry",
            value: Math.round(metrics.symmetry),
            target: 90,
            unit: "%"
          }
        ],
        feedback: {
          good: [
            "Real-time pose detection is working",
            "Your movement is being tracked successfully",
            `Your overall form score is ${Math.round(metrics.form)}%`
          ],
          improve: [
            "Make sure your full body is visible in the frame",
            "Try to maintain better posture during the movement",
            "Focus on balanced, symmetric movements"
          ]
        },
        coachingTips: [
          "Continue with slow, controlled movements for better tracking",
          "Try different angles to ensure all key body parts are visible",
          "Maintain good lighting for more accurate pose detection",
          "Compare your form with reference videos of proper technique"
        ]
      },
      behavior: {
        consistency: [
          {
            name: "Movement Pattern",
            description: "Your movement pattern shows good consistency.",
            quality: metrics.stability > 80 ? "good" : "needs-improvement",
            icon: null
          },
          {
            name: "Position Stability",
            description: "Your position stability could be improved.",
            quality: metrics.stability > 85 ? "good" : "needs-improvement",
            icon: null
          }
        ],
        preRoutine: [
          {
            name: "Setup Position",
            description: "Your initial position looks good.",
            quality: metrics.posture > 80 ? "good" : "needs-improvement",
            icon: null
          },
          {
            name: "Balance",
            description: "Your balance is stable throughout the movement.",
            quality: metrics.stability > 80 ? "good" : "needs-improvement",
            icon: null
          }
        ],
        habits: [
          {
            name: "Body Alignment",
            description: "Your body alignment is good during the movement.",
            quality: metrics.posture > 75 ? "good" : "needs-improvement",
            icon: null
          },
          {
            name: "Movement Flow",
            description: "Your movement flow is smooth and controlled.",
            quality: metrics.form > 80 ? "good" : "needs-improvement",
            icon: null
          }
        ],
        timing: {
          average: "Real-time analysis",
          consistency: Math.round(metrics.stability),
          isRushing: false,
          attempts: [{ attemptNumber: 1, duration: "Real-time" }]
        },
        fatigue: {
          level: "low",
          signs: [
            "MediaPipe analysis doesn't track fatigue",
            "Consider recording multiple attempts for fatigue analysis"
          ],
          recommendations: [
            "Focus on maintaining proper form throughout the movement",
            "Take breaks between attempts to prevent fatigue"
          ]
        }
      }
    };
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
