
import React, { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import EmptyState from '@/components/analysis/states/EmptyState';
import ErrorState from '@/components/analysis/states/ErrorState';
import LoadingState from '@/components/analysis/states/LoadingState';
import AnalysisResults from '@/components/analysis/AnalysisResults';

interface ResultsPanelProps {
  isAnalyzing: boolean;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
  videoFile: File | null;
  apiError?: string | null;
  isDemoMode?: boolean;
  onRetry?: () => void;
  analysisId?: string;
  sportId?: string;
  drillId?: string;
  onPoseAnalysis?: (metrics: any) => void;
  gameplaySituation?: string;
  playType?: string;
}

const ResultsPanel = ({ 
  isAnalyzing, 
  analysisResult, 
  behaviorAnalysis, 
  videoFile, 
  apiError,
  isDemoMode,
  onRetry,
  analysisId,
  sportId,
  drillId,
  onPoseAnalysis,
  gameplaySituation,
  playType
}: ResultsPanelProps) => {
  const [selectedGameplay, setSelectedGameplay] = useState<string | undefined>(gameplaySituation);
  const [selectedPlay, setSelectedPlay] = useState<string | undefined>(playType);
  
  // Update the local state when props change
  useEffect(() => {
    setSelectedGameplay(gameplaySituation);
    setSelectedPlay(playType);
  }, [gameplaySituation, playType]);
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      {!analysisResult && !isAnalyzing && !apiError && (
        <EmptyState />
      )}
      
      {apiError && !isAnalyzing && (
        <ErrorState errorMessage={apiError} onRetry={onRetry} />
      )}
      
      {isAnalyzing && (
        <LoadingState />
      )}
      
      {analysisResult && !isAnalyzing && (
        <AnalysisResults 
          analysisResult={analysisResult}
          behaviorAnalysis={behaviorAnalysis}
          videoFile={videoFile}
          isDemoMode={isDemoMode}
          onRetry={onRetry}
          analysisId={analysisId}
          sportId={sportId}
          drillId={drillId}
          onPoseAnalysis={onPoseAnalysis}
          gameplaySituation={selectedGameplay}
          playType={selectedPlay}
        />
      )}
    </div>
  );
};

export default ResultsPanel;
