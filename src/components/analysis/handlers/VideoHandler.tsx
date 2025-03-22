
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AnalysisResponse } from '@/utils/videoAnalysisService';

// Maximum file size (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface VideoHandlerProps {
  onVideoSelected: (file: File) => void;
}

export const useVideoHandlers = () => {
  const { toast } = useToast();

  const handleVideoSelected = (file: File, onVideoSelected: (file: File) => void) => {
    // Double-check file size (in addition to VideoUploader's check)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round(file.size / (1024 * 1024));
      toast({
        title: "Video too large",
        description: `Your video is ${sizeMB}MB which exceeds the 50MB limit. Please select a smaller file.`,
        variant: "destructive"
      });
      return;
    }
    
    onVideoSelected(file);
  };

  const handlePoseAnalysis = (
    metrics: any,
    isAnalyzing: boolean,
    analysisResult: any | null,
    setAnalysisResult: (result: any) => void,
    setBehaviorAnalysis: (behavior: any) => void,
    setIsDemoMode: (isDemoMode: boolean) => void,
    poseMetrics: any,
    setPoseMetrics: (metrics: any) => void,
    drill: any
  ) => {
    if (!metrics) return;
    
    // Store the latest metrics
    setPoseMetrics(metrics);
    
    // If we're in the middle of analysis, don't update the UI
    if (isAnalyzing) return;
    
    // If we have metrics but no analysis result yet, create a simple one
    // based on the MediaPipe detection
    if (metrics && !analysisResult) {
      // Convert pose metrics to our analysis format
      const localAnalysis: AnalysisResponse = {
        result: {
          title: `${drill?.name || 'Technique'} Analysis`,
          description: "MediaPipe pose detection analysis",
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
      
      // Update the analysis result with the local MediaPipe analysis
      setAnalysisResult(localAnalysis.result);
      setBehaviorAnalysis(localAnalysis.behavior);
      
      // Set demo mode flag since this is local analysis
      setIsDemoMode(true);
    }
  };

  return {
    handleVideoSelected,
    handlePoseAnalysis
  };
};
