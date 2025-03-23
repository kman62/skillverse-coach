
import React from 'react';
import BreadcrumbNav from '@/components/analysis/BreadcrumbNav';
import DrillInfo from '@/components/analysis/DrillInfo';
import VideoAnalysisPanel from '@/components/analysis/VideoAnalysisPanel';
import ResultsPanel from '@/components/analysis/ResultsPanel';
import { Sport, Drill } from '@/lib/constants';

interface AnalysisContentProps {
  sport: Sport | null;
  drill: Drill | null;
  videoFile: File | null;
  isAnalyzing: boolean;
  isSaving: boolean;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
  apiError: string | null;
  isDemoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
  analysisId?: string;
  sportId?: string;
  drillId?: string;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  onRetry: () => void;
  onPoseAnalysis: (metrics: any) => void;
}

const AnalysisContent = ({
  sport,
  drill,
  videoFile,
  isAnalyzing,
  isSaving,
  analysisResult,
  behaviorAnalysis,
  apiError,
  isDemoMode,
  onDemoModeChange,
  analysisId,
  sportId,
  drillId,
  onVideoSelected,
  onAnalyzeClick,
  onRetry,
  onPoseAnalysis
}: AnalysisContentProps) => {
  return (
    <>
      <BreadcrumbNav sport={sport} drill={drill} />
      <DrillInfo drill={drill} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <VideoAnalysisPanel
          videoFile={videoFile}
          isAnalyzing={isAnalyzing || isSaving}
          isDemoMode={isDemoMode}
          onDemoModeChange={onDemoModeChange}
          onVideoSelected={onVideoSelected}
          onAnalyzeClick={onAnalyzeClick}
        />
        
        <ResultsPanel
          isAnalyzing={isAnalyzing || isSaving}
          analysisResult={analysisResult}
          behaviorAnalysis={behaviorAnalysis}
          videoFile={videoFile}
          apiError={apiError}
          isDemoMode={isDemoMode}
          onRetry={onRetry}
          analysisId={analysisId}
          sportId={sportId}
          drillId={drillId}
          onPoseAnalysis={onPoseAnalysis}
        />
      </div>
    </>
  );
};

export default AnalysisContent;
