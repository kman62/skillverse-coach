
import React from 'react';
import { BarChart } from 'lucide-react';
import EmptyState from '@/components/analysis/states/EmptyState';
import ErrorState from '@/components/analysis/states/ErrorState';
import LoadingState from '@/components/analysis/states/LoadingState';
import AnalysisResults from '@/components/analysis/AnalysisResults';
import GameplaySelector from '@/components/analysis/GameplaySelector';

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
  onGameplaySituationChange?: (situation: string) => void;
  onPlayTypeChange?: (play: string) => void;
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
  playType,
  onGameplaySituationChange,
  onPlayTypeChange
}: ResultsPanelProps) => {
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {analysisResult ? 'Analysis Results' : 'Game Configuration'}
      </h2>
      
      {!analysisResult && !isAnalyzing && !apiError && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BarChart size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Game Analysis Setup</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-center mb-6">
            Configure the gameplay situation and specific play to receive personalized feedback on your technique.
          </p>
          
          <GameplaySelector 
            gameplaySituation={gameplaySituation}
            playType={playType}
            onGameplaySituationChange={onGameplaySituationChange}
            onPlayTypeChange={onPlayTypeChange}
          />
        </div>
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
          gameplaySituation={gameplaySituation}
          playType={playType}
        />
      )}
    </div>
  );
};

export default ResultsPanel;
