
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  processingProgress: number;
  progressPhase: string;
}

const AnalysisProgress = ({ 
  isAnalyzing, 
  processingProgress, 
  progressPhase 
}: AnalysisProgressProps) => {
  if (!isAnalyzing) return null;
  
  // Ensure the progress value is always between 0 and 100
  const normalizedProgress = Math.min(Math.max(processingProgress, 0), 100);
  
  // Calculate which phase is active based on progress percentage
  const getPhaseActive = (phaseIndex: number): boolean => {
    const thresholds = [0, 20, 40, 60, 80, 100];
    return normalizedProgress >= thresholds[phaseIndex] && normalizedProgress < thresholds[phaseIndex + 1];
  };
  
  return (
    <div className="mb-5 space-y-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{progressPhase}</span>
        <span className="font-medium">{Math.round(normalizedProgress)}%</span>
      </div>
      <Progress value={normalizedProgress} className="h-2" />
      <div className="grid grid-cols-5 w-full mt-1">
        {['Initializing', 'Processing', 'Analyzing', 'Generating', 'Finalizing'].map((phase, i) => (
          <div key={phase} className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mb-1 ${
              normalizedProgress >= (i+1)*20 ? 'bg-primary' : 
              getPhaseActive(i) ? 'bg-primary animate-pulse' : 'bg-muted'
            }`}></div>
            <span className={`text-[10px] ${
              getPhaseActive(i) ? 'text-primary font-medium' : 'text-muted-foreground'
            } hidden sm:inline`}>{phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisProgress;
