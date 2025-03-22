
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisState } from '@/hooks/useAnalysisState';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import AnalysisPageLayout from '@/components/analysis/layout/AnalysisPageLayout';
import AnalysisContent from '@/components/analysis/AnalysisContent';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const { user } = useAuth();
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
    isDemoMode,
    setIsDemoMode,
    analysisId,
    setAnalysisId,
    poseMetrics,
    handleVideoSelected,
    handlePoseAnalysis,
    navigate
  } = useAnalysisState();

  const {
    handleAnalyzeVideo,
  } = useVideoAnalysis();

  useEffect(() => {
    // Log authentication status for debugging
    console.log("Auth state on AnalysisPage load:", { 
      isAuthenticated: !!user,
      userId: user?.id,
      sportId,
      drillId
    });
  }, [sportId, drillId, user]);

  const handleAnalyzeClick = async () => {
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
        onAnalysisComplete: (result, behavior) => {
          setAnalysisResult(result);
          setBehaviorAnalysis(behavior);
        },
        onAnalysisError: (error) => {
          setApiError(error.message);
        },
        forceDemoMode: isDemoMode
      }
    );
  };

  const handleDemoModeToggle = (enabled: boolean) => {
    console.log(`Demo mode ${enabled ? 'enabled' : 'disabled'} by user`);
    setIsDemoMode(enabled);
    
    // Reset any previous analysis when toggling
    if (analysisResult) {
      setAnalysisResult(null);
      setBehaviorAnalysis(null);
    }
  };

  return (
    <AnalysisPageLayout sport={sport} drill={drill}>
      <AnalysisContent
        sport={sport}
        drill={drill}
        videoFile={videoFile}
        isAnalyzing={isAnalyzing}
        isSaving={isSaving}
        analysisResult={analysisResult}
        behaviorAnalysis={behaviorAnalysis}
        apiError={apiError}
        isDemoMode={isDemoMode}
        onDemoModeChange={handleDemoModeToggle}
        analysisId={analysisId}
        sportId={sportId}
        drillId={drillId}
        onVideoSelected={handleVideoSelected}
        onAnalyzeClick={handleAnalyzeClick}
        onRetry={handleAnalyzeClick}
        onPoseAnalysis={handlePoseAnalysis}
      />
    </AnalysisPageLayout>
  );
};

export default AnalysisPage;
