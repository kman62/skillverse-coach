
import { useToast } from "@/components/ui/use-toast";
import { generateBasketballAnalysis } from "@/utils/analysis/basketballAnalysis";
import { generateBaseballAnalysis } from "@/utils/analysis/baseballAnalysis";
import { generateFootballAnalysis } from "@/utils/analysis/footballAnalysis";
import { generateGolfAnalysis } from "@/utils/analysis/golfAnalysis";
import { generateSoccerAnalysis } from "@/utils/analysis/soccerAnalysis";
import { generateTennisAnalysis } from "@/utils/analysis/tennisAnalysis";
import { v4 as uuidv4 } from 'uuid';

// Mock behavior analysis generator
const generateBehaviorAnalysis = (score: number) => {
  return {
    consistency: Math.floor(score * 0.9 + Math.random() * 10),
    preRoutine: Math.floor(score * 0.85 + Math.random() * 15),
    habits: Math.floor(score * 0.95 + Math.random() * 5),
    timing: Math.floor(score * 0.8 + Math.random() * 20),
    fatigue: Math.floor(score * 0.7 + Math.random() * 30),
  };
};

export const useAnalysisHandler = () => {
  const { toast } = useToast();

  const handleAnalyzeClick = async (
    videoFile: File | null,
    drill: any,
    sportId?: string,
    drillId?: string,
    poseMetrics?: any,
    setIsAnalyzing?: (value: boolean) => void,
    setApiError?: (value: string | null) => void,
    setIsDemoMode?: (value: boolean) => void,
    setAnalysisId?: (value: string) => void,
    setAnalysisResult?: (value: any) => void,
    setBehaviorAnalysis?: (value: any) => void,
    onPoseAnalysis?: (metrics: any) => void,
    setIsSaving?: (value: boolean) => void,
    gameplaySituation?: string,
    playType?: string
  ) => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video file first",
        variant: "destructive",
      });
      return;
    }

    // Clear previous errors and set analyzing state
    if (setApiError) setApiError(null);
    if (setIsAnalyzing) setIsAnalyzing(true);
    
    try {
      // Demo mode with mock data (in real app, this would use actual analysis API)
      const score = Math.floor(70 + Math.random() * 30); // Random score between 70-100
      
      // Generate analysis result based on sport type
      let analysisResult;
      
      if (sportId === "basketball") {
        analysisResult = generateBasketballAnalysis(drill.name, score, gameplaySituation, playType);
      } else if (sportId === "baseball") {
        analysisResult = generateBaseballAnalysis(drill.name, score);
      } else if (sportId === "football") {
        analysisResult = generateFootballAnalysis(drill.name, score);
      } else if (sportId === "golf") {
        analysisResult = generateGolfAnalysis(drill.name, score);
      } else if (sportId === "soccer") {
        analysisResult = generateSoccerAnalysis(drill.name, score);
      } else if (sportId === "tennis") {
        analysisResult = generateTennisAnalysis(drill.name, score);
      } else {
        // Default generic analysis
        analysisResult = {
          title: `${drill.name} Analysis`,
          description: `Detailed breakdown of your ${drill.name.toLowerCase()} technique.`,
          score: score,
          metrics: [
            {
              name: "Form",
              value: Math.floor(score * 0.9 + Math.random() * 10),
              target: 95,
              unit: "%"
            },
            {
              name: "Consistency",
              value: Math.floor(score * 0.85 + Math.random() * 15),
              target: 90,
              unit: "%"
            },
            {
              name: "Power",
              value: Math.floor(score * 0.95 + Math.random() * 5),
              target: 100,
              unit: "%"
            },
            {
              name: "Control",
              value: Math.floor(score * 0.8 + Math.random() * 20),
              target: 95,
              unit: "%"
            }
          ],
          feedback: {
            good: [
              "Good overall technique",
              "Nice body position throughout the movement",
              "Consistent execution"
            ],
            improve: [
              "Focus on better follow through",
              "Work on maintaining proper form when fatigued",
              "Improve timing of key movement phases"
            ]
          },
          coachingTips: [
            "Practice this movement pattern daily",
            "Record yourself to check your form regularly",
            "Use resistance training to build specific strength for this movement",
            "Focus on quality over quantity in practice"
          ]
        };
      }
      
      // Generate behavior analysis
      const behaviorAnalysis = generateBehaviorAnalysis(score);
      
      // Wait a bit to simulate actual processing (remove in production)
      setTimeout(() => {
        // Generate unique analysis ID
        const uniqueId = uuidv4();
        
        if (setIsDemoMode) setIsDemoMode(true);
        if (setAnalysisId) setAnalysisId(uniqueId);
        if (setAnalysisResult) setAnalysisResult(analysisResult);
        if (setBehaviorAnalysis) setBehaviorAnalysis(behaviorAnalysis);
        if (setIsAnalyzing) setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Your technique has been analyzed successfully",
        });
      }, 2000);

    } catch (error) {
      console.error("Analysis error:", error);
      if (setApiError) {
        setApiError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during analysis"
        );
      }
      if (setIsAnalyzing) setIsAnalyzing(false);
      
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your video",
        variant: "destructive",
      });
    }
  };

  return { handleAnalyzeClick };
};
