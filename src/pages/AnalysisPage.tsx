
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSportById, getDrillById } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Custom hooks
import { useAnalysisState } from '@/hooks/useAnalysisState';
import { useVideoHandlers } from '@/components/analysis/handlers/VideoHandler';
import { useAnalysisHandler } from '@/components/analysis/handlers/AnalysisHandler';

// Components
import AnalysisLayout from '@/components/analysis/layout/AnalysisLayout';
import AnalysisContainer from '@/components/analysis/containers/AnalysisContainer';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  const [drill, setDrill] = useState(drillId && sportId ? getDrillById(sportId, drillId) : null);
  
  // Use custom hooks for state management and handlers
  const {
    videoFile, setVideoFile,
    isAnalyzing, setIsAnalyzing,
    analysisResult, setAnalysisResult,
    behaviorAnalysis, setBehaviorAnalysis,
    apiError, setApiError,
    isSaving, setIsSaving,
    isDemoMode, setIsDemoMode,
    analysisId, setAnalysisId,
    poseMetrics, setPoseMetrics,
    gameplaySituation, setGameplaySituation,
    playType, setPlayType
  } = useAnalysisState();
  
  const { handleVideoSelected, handlePoseAnalysis } = useVideoHandlers();
  const { handleAnalyzeClick } = useAnalysisHandler();
  
  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
    
    if (sportId && drillId) {
      setDrill(getDrillById(sportId, drillId));
    }
  }, [sportId, drillId]);
  
  // Handler for video selection
  const onVideoSelected = (file: File) => {
    handleVideoSelected(file, (selectedFile) => {
      setVideoFile(selectedFile);
      setAnalysisResult(null);
      setBehaviorAnalysis(null);
      setApiError(null);
      setIsDemoMode(false);
      setPoseMetrics(null);
    });
  };
  
  // Handler for pose analysis update
  const onPoseAnalysis = (metrics: any) => {
    handlePoseAnalysis(
      metrics,
      isAnalyzing,
      analysisResult,
      setAnalysisResult,
      setBehaviorAnalysis,
      setIsDemoMode,
      poseMetrics,
      setPoseMetrics,
      drill
    );
  };
  
  // Handler for gameplay situation selection
  const onGameplaySituationChange = (situation: string) => {
    setGameplaySituation(situation);
    setPlayType(undefined); // Reset play type when situation changes
  };
  
  // Handler for play type selection
  const onPlayTypeChange = (play: string) => {
    setPlayType(play);
  };
  
  // Handler for analyze button click
  const onAnalyzeClick = () => {
    handleAnalyzeClick(
      videoFile,
      drill,
      sportId,
      drillId,
      poseMetrics,
      setIsAnalyzing,
      setApiError,
      setIsDemoMode,
      setAnalysisId,
      setAnalysisResult,
      setBehaviorAnalysis,
      onPoseAnalysis,
      setIsSaving,
      gameplaySituation,
      playType
    );
  };

  return (
    <AnalysisLayout isValidDrill={!!sport && !!drill}>
      {sport && drill && (
        <AnalysisContainer
          sport={sport}
          drill={drill}
          videoFile={videoFile}
          isAnalyzing={isAnalyzing}
          isSaving={isSaving}
          onVideoSelected={onVideoSelected}
          onAnalyzeClick={onAnalyzeClick}
          analysisResult={analysisResult}
          behaviorAnalysis={behaviorAnalysis}
          apiError={apiError}
          isDemoMode={isDemoMode}
          analysisId={analysisId}
          sportId={sportId}
          drillId={drillId}
          onPoseAnalysis={onPoseAnalysis}
          onRetry={onAnalyzeClick}
          gameplaySituation={gameplaySituation}
          playType={playType}
          onGameplaySituationChange={onGameplaySituationChange}
          onPlayTypeChange={onPlayTypeChange}
        />
      )}
    </AnalysisLayout>
  );
};

export default AnalysisPage;
