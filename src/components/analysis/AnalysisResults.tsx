
import React from 'react';
import AnalysisCard from '@/components/ui/AnalysisCard';
import BehaviorAnalysis from '@/components/ui/BehaviorAnalysis';
import VideoAnnotation from '@/components/analysis/VideoAnnotation';
import FeedbackSystem from '@/components/analysis/FeedbackSystem';
import CoachingTips from '@/components/analysis/CoachingTips';
import ActionButtons from '@/components/analysis/ActionButtons';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsProps {
  analysisResult: any;
  behaviorAnalysis: any;
  videoFile: File | null;
  onRetry?: () => void;
  analysisId?: string;
  sportId?: string;
  drillId?: string;
  onPoseAnalysis?: (metrics: any) => void;
}

const AnalysisResults = ({
  analysisResult,
  behaviorAnalysis,
  videoFile,
  onRetry,
  analysisId,
  sportId,
  drillId,
  onPoseAnalysis
}: AnalysisResultsProps) => {
  // Log analysis data for debugging
  React.useEffect(() => {
    if (analysisResult) {
      console.log("Analysis Results Component Rendering:", {
        title: analysisResult.title,
        metrics: analysisResult.metrics?.map((m: any) => m.name).join(', '),
        analysisType: analysisResult.analysisType || "undefined"
      });
    }
  }, [analysisResult]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Provider Badge */}
      {analysisResult.provider && (
        <div className="flex justify-end">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {analysisResult.provider === 'gpt-4o' ? 'Analyzed by GPT-4o' : analysisResult.provider}
          </Badge>
        </div>
      )}
      
      {/* Video with annotations */}
      {videoFile && (
        <div className="rounded-lg border border-border overflow-hidden bg-black relative">
          <VideoAnnotation 
            videoFile={videoFile} 
            analysisResult={analysisResult}
            onPoseAnalysis={onPoseAnalysis}
          />
        </div>
      )}
      
      <AnalysisCard 
        title={analysisResult.title || 'Technique Analysis'}
        description={analysisResult.description || 'Analysis of your technique and performance'}
        score={analysisResult.score || 0}
        metrics={analysisResult.metrics || []}
        feedback={analysisResult.feedback || { good: [], improve: [] }}
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
      {analysisResult.coachingTips && analysisResult.coachingTips.length > 0 && (
        <CoachingTips tips={analysisResult.coachingTips} />
      )}
      
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
