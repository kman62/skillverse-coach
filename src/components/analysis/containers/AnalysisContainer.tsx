
import React from 'react';
import BreadcrumbNav from '@/components/analysis/BreadcrumbNav';
import DrillInfo from '@/components/analysis/DrillInfo';
import VideoAnalysisPanel from '@/components/analysis/VideoAnalysisPanel';
import ResultsPanel from '@/components/analysis/ResultsPanel';

interface AnalysisContainerProps {
  sport: any;
  drill: any;
  videoFile: File | null;
  isAnalyzing: boolean;
  isSaving: boolean;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
  apiError: string | null;
  isDemoMode: boolean;
  analysisId?: string;
  sportId?: string;
  drillId?: string;
  onPoseAnalysis?: (metrics: any) => void;
  onRetry: () => void;
}

const AnalysisContainer = ({
  sport,
  drill,
  videoFile,
  isAnalyzing,
  isSaving,
  onVideoSelected,
  onAnalyzeClick,
  analysisResult,
  behaviorAnalysis,
  apiError,
  isDemoMode,
  analysisId,
  sportId,
  drillId,
  onPoseAnalysis,
  onRetry
}: AnalysisContainerProps) => {
  return (
    <>
      <BreadcrumbNav sport={sport} drill={drill} />
      <DrillInfo drill={drill} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <VideoAnalysisPanel
          videoFile={videoFile}
          isAnalyzing={isAnalyzing || isSaving}
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

export default AnalysisContainer;
