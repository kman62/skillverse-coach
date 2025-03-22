
import React from 'react';
import AnalysisCard from '@/components/ui/AnalysisCard';
import BehaviorAnalysis from '@/components/ui/BehaviorAnalysis';
import VideoAnnotation from '@/components/analysis/VideoAnnotation';
import FeedbackSystem from '@/components/analysis/FeedbackSystem';
import DemoModeIndicator from '@/components/analysis/DemoModeIndicator';
import CoachingTips from '@/components/analysis/CoachingTips';
import ActionButtons from '@/components/analysis/ActionButtons';

interface AnalysisResultsProps {
  analysisResult: any;
  behaviorAnalysis: any;
  videoFile: File | null;
  isDemoMode?: boolean;
  onRetry?: () => void;
  analysisId?: string;
  sportId?: string;
  drillId?: string;
  onPoseAnalysis?: (metrics: any) => void;
  gameplaySituation?: string;
}

const AnalysisResults = ({
  analysisResult,
  behaviorAnalysis,
  videoFile,
  isDemoMode,
  onRetry,
  analysisId,
  sportId,
  drillId,
  onPoseAnalysis,
  gameplaySituation = "regular"
}: AnalysisResultsProps) => {
  // Function to adjust the analysis result title based on gameplay situation
  const getTitleWithGameplay = () => {
    if (gameplaySituation === "regular") {
      return analysisResult.title;
    }
    
    const formattedGameplay = gameplaySituation
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return `${analysisResult.title}: ${formattedGameplay}`;
  };
  
  return (
    <div className="animate-fade-in space-y-6">
      {/* Demo mode indicator */}
      {isDemoMode && <DemoModeIndicator />}
      
      {/* Video with annotations */}
      {videoFile && (
        <div className="rounded-lg border border-border overflow-hidden bg-black relative">
          <VideoAnnotation 
            videoFile={videoFile} 
            analysisResult={analysisResult}
            isDemoMode={isDemoMode}
            onPoseAnalysis={onPoseAnalysis}
          />
        </div>
      )}
      
      <AnalysisCard 
        title={getTitleWithGameplay()}
        description={analysisResult.description}
        score={analysisResult.score}
        metrics={analysisResult.metrics}
        feedback={analysisResult.feedback}
      />
      
      {behaviorAnalysis && (
        <BehaviorAnalysis 
          consistency={behaviorAnalysis.consistency}
          preRoutine={behaviorAnalysis.preRoutine}
          habits={behaviorAnalysis.habits}
          timing={behaviorAnalysis.timing}
          fatigue={behaviorAnalysis.fatigue}
        />
      )}
      
      {/* Coaching Tips Section */}
      <CoachingTips tips={analysisResult.coachingTips} />
      
      {/* Feedback System */}
      <FeedbackSystem 
        analysisId={analysisId}
        sportId={sportId || "generic"}
        drillId={drillId || "technique"}
        score={analysisResult.score || 0}
      />
      
      {/* Action Buttons */}
      <ActionButtons onRetry={onRetry} />
    </div>
  );
};

export default AnalysisResults;
