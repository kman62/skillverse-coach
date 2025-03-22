import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSportById, getDrillById } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { analyzeVideo, saveAnalysisResult, AnalysisResponse } from '@/utils/videoAnalysisService';
import { useAuth } from '@/contexts/AuthContext';

// Components
import BreadcrumbNav from '@/components/analysis/BreadcrumbNav';
import DrillInfo from '@/components/analysis/DrillInfo';
import VideoAnalysisPanel from '@/components/analysis/VideoAnalysisPanel';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import NotFoundMessage from '@/components/analysis/NotFoundMessage';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  const [drill, setDrill] = useState(drillId && sportId ? getDrillById(sportId, drillId) : null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const [poseMetrics, setPoseMetrics] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
    
    if (sportId && drillId) {
      setDrill(getDrillById(sportId, drillId));
    }
  }, [sportId, drillId]);
  
  const handleVideoSelected = (file: File) => {
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
    
    setVideoFile(file);
    setAnalysisResult(null);
    setBehaviorAnalysis(null);
    setApiError(null);
    setIsDemoMode(false);
    setPoseMetrics(null);
  };
  
  const handlePoseAnalysis = (metrics: any) => {
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
  
  const handleAnalyzeClick = async () => {
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
        description: isDemoMode 
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
  
  if (!sport || !drill) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <NotFoundMessage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12 pt-4">
          <BreadcrumbNav sport={sport} drill={drill} />
          <DrillInfo drill={drill} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <VideoAnalysisPanel
              videoFile={videoFile}
              isAnalyzing={isAnalyzing || isSaving}
              onVideoSelected={handleVideoSelected}
              onAnalyzeClick={handleAnalyzeClick}
            />
            
            <ResultsPanel
              isAnalyzing={isAnalyzing || isSaving}
              analysisResult={analysisResult}
              behaviorAnalysis={behaviorAnalysis}
              videoFile={videoFile}
              apiError={apiError}
              isDemoMode={isDemoMode}
              onRetry={handleAnalyzeClick}
              analysisId={analysisId}
              sportId={sportId}
              drillId={drillId}
              onPoseAnalysis={handlePoseAnalysis}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisPage;
