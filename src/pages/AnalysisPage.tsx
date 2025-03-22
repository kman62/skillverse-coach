
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
    
    try {
      // Pass sportId to the analysis function
      const analysisData: AnalysisResponse = await analyzeVideo(
        videoFile, 
        drill?.name || "Technique",
        sportId || "generic"
      );
      
      setAnalysisResult(analysisData.result);
      setBehaviorAnalysis(analysisData.behavior);
      
      // If we received analysis data but it was from the fallback, set demo mode
      if ((window as any).usedFallbackData) {
        setIsDemoMode(true);
        // Notify the VideoAnalysisPanel via a custom event
        window.dispatchEvent(new CustomEvent('analysis-status', { 
          detail: { isDemoMode: true } 
        }));
      }
      
      // Save the analysis results to Supabase
      setIsSaving(true);
      const saveResult = await saveAnalysisResult(
        videoFile,
        sportId || "generic",
        drillId || "technique",
        analysisData.result,
        analysisData.behavior
      );
      
      // Set the analysis ID if available
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
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Video Upload */}
            <VideoAnalysisPanel
              videoFile={videoFile}
              isAnalyzing={isAnalyzing || isSaving}
              onVideoSelected={handleVideoSelected}
              onAnalyzeClick={handleAnalyzeClick}
            />
            
            {/* Right Column: Analysis Results */}
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
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisPage;
