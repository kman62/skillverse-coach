
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisState } from '@/hooks/useAnalysisState';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import AnalysisPageLayout from '@/components/analysis/layout/AnalysisPageLayout';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import VideoAnalysisPanel from '@/components/analysis/VideoAnalysisPanel';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const { user } = useAuth();
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const [usesDemoData, setUsesDemoData] = useState(false);
  
  const {
    sport,
    drill,
    videoFile,
    isAnalyzing,
    setIsAnalyzing,
    analysisResult,
    setAnalysisResult,
    behaviorAnalysis,
    setBehaviorAnalysis,
    apiError,
    setApiError,
    isSaving,
    setIsSaving,
    analysisId,
    setAnalysisId,
    poseMetrics,
    handleVideoSelected,
    handlePoseAnalysis,
    navigate
  } = useAnalysisState();

  const {
    handleAnalyzeVideo,
    useDemoMode,
    setUseDemoMode
  } = useVideoAnalysis();

  useEffect(() => {
    console.log("Auth state on AnalysisPage load:", { 
      isAuthenticated: !!user,
      userId: user?.id,
      sportId,
      drillId
    });
    
    const handleAnalysisStage = (event: CustomEvent) => {
      console.log("Analysis stage update:", event.detail.stage);
      setAnalysisStage(event.detail.stage);
      
      if (event.detail.stage === 'using-fallback-analysis' || 
          event.detail.stage === 'using-demo-data') {
        setUsesDemoData(true);
      }
      
      if (event.detail.stage === 'analysis-complete' || 
          event.detail.stage === 'api-success-gpt4o' || 
          event.detail.stage.includes('failed') || 
          event.detail.stage.includes('error')) {
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setIsSaving(false);
        }, 500);
      }
    };
    
    window.addEventListener('analysis-stage', handleAnalysisStage as EventListener);
    
    return () => {
      window.removeEventListener('analysis-stage', handleAnalysisStage as EventListener);
    };
  }, [sportId, drillId, user, setIsAnalyzing, setIsSaving]);

  const handleAnalyzeClick = async () => {
    setAnalysisStage('started');
    setUsesDemoData(false);
    
    await handleAnalyzeVideo(
      videoFile,
      sportId,
      drillId,
      poseMetrics,
      navigate,
      {
        onAnalysisStart: () => {
          setIsAnalyzing(true);
        },
        onAnalysisComplete: (result, behavior, isDemoMode) => {
          setAnalysisResult(result);
          setBehaviorAnalysis(behavior);
          setUsesDemoData(isDemoMode);
          
          setAnalysisStage('analysis-complete');
          
          setIsAnalyzing(false);
          setIsSaving(false);
        },
        onAnalysisError: (error) => {
          setApiError(error.message);
          
          setIsAnalyzing(false);
          setIsSaving(false);
        }
      }
    );
  };

  const handleDemoModeChange = (enabled: boolean) => {
    setUseDemoMode(enabled);
    console.log("Demo mode changed to:", enabled);
  };

  return (
    <AnalysisPageLayout
      heading={drill?.name || 'Analysis'}
      description={drill?.description || 'Analyze your technique with AI'}
      backLink={`/sports/${sportId}/drills`}
      sport={sport}
      drill={drill}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <VideoAnalysisPanel
            videoFile={videoFile}
            isAnalyzing={isAnalyzing}
            onVideoSelected={handleVideoSelected}
            onAnalyzeClick={handleAnalyzeClick}
            analysisStage={analysisStage}
            analysisWorking={!!analysisResult}
            useDemoMode={useDemoMode}
            onDemoModeChange={handleDemoModeChange}
            usesDemoData={usesDemoData}
          />
        </div>
        
        <div className="lg:col-span-7">
          <AnalysisContent
            sport={sport}
            drill={drill}
            videoFile={videoFile}
            isAnalyzing={isAnalyzing}
            isSaving={isSaving}
            analysisResult={analysisResult}
            behaviorAnalysis={behaviorAnalysis}
            apiError={apiError}
            analysisId={analysisId}
            sportId={sportId}
            drillId={drillId}
            onVideoSelected={handleVideoSelected}
            onAnalyzeClick={handleAnalyzeClick}
            onRetry={handleAnalyzeClick}
            onPoseAnalysis={handlePoseAnalysis}
            analysisStage={analysisStage}
            usesDemoData={usesDemoData}
          />
        </div>
      </div>
    </AnalysisPageLayout>
  );
};

export default AnalysisPage;
