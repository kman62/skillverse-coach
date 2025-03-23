
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalysisState } from '@/hooks/useAnalysisState';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import AnalysisPageLayout from '@/components/analysis/layout/AnalysisPageLayout';
import AnalysisContent from '@/components/analysis/AnalysisContent';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const { user } = useAuth();
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
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
    
    // Listen for analysis stage updates
    const handleAnalysisStage = (event: CustomEvent) => {
      console.log("Analysis stage update:", event.detail.stage);
      setAnalysisStage(event.detail.stage);
      
      // Automatically clear the loading states when analysis is complete
      if (event.detail.stage === 'analysis-complete' || 
          event.detail.stage === 'api-success-gpt4o' || 
          event.detail.stage.includes('failed') || 
          event.detail.stage.includes('error')) {
        
        // Add a small delay to ensure the results are displayed
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
    // Reset analysis stage
    setAnalysisStage('started');
    
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
          
          // Explicitly set the final stage
          setAnalysisStage('analysis-complete');
          
          // Ensure loading state is cleared
          setIsAnalyzing(false);
          setIsSaving(false);
        },
        onAnalysisError: (error) => {
          setApiError(error.message);
          
          // Ensure loading state is cleared
          setIsAnalyzing(false);
          setIsSaving(false);
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
      setAnalysisStage(null);
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
        analysisStage={analysisStage}
      />
    </AnalysisPageLayout>
  );
};

export default AnalysisPage;
