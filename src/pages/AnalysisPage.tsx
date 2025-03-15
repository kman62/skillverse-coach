
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSportById, getDrillById } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { generateMockAnalysisData } from '@/utils/mockAnalysisData';

// Components
import BreadcrumbNav from '@/components/analysis/BreadcrumbNav';
import DrillInfo from '@/components/analysis/DrillInfo';
import VideoAnalysisPanel from '@/components/analysis/VideoAnalysisPanel';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import NotFoundMessage from '@/components/analysis/NotFoundMessage';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  const [drill, setDrill] = useState(drillId && sportId ? getDrillById(sportId, drillId) : null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
    
    if (sportId && drillId) {
      setDrill(getDrillById(sportId, drillId));
    }
  }, [sportId, drillId]);
  
  const handleVideoSelected = (file: File) => {
    setVideoFile(file);
    setAnalysisResult(null);
    setBehaviorAnalysis(null);
  };
  
  const handleAnalyzeClick = () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout (would be replaced with actual analysis API call)
    setTimeout(() => {
      const { result, behavior } = generateMockAnalysisData(drill?.name || "Technique");
      
      setAnalysisResult(result);
      setBehaviorAnalysis(behavior);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Your technique has been successfully analyzed"
      });
    }, 3000);
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
              isAnalyzing={isAnalyzing}
              onVideoSelected={handleVideoSelected}
              onAnalyzeClick={handleAnalyzeClick}
            />
            
            {/* Right Column: Analysis Results */}
            <ResultsPanel
              isAnalyzing={isAnalyzing}
              analysisResult={analysisResult}
              behaviorAnalysis={behaviorAnalysis}
              videoFile={videoFile}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisPage;
