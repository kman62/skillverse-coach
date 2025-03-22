
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
  
  return (
    <div className="mb-5 space-y-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{progressPhase}</span>
        <span className="font-medium">{Math.round(processingProgress)}%</span>
      </div>
      <Progress value={processingProgress} className="h-2" />
      <div className="grid grid-cols-5 w-full mt-1">
        {['Initializing', 'Processing', 'Analyzing', 'Generating', 'Finalizing'].map((phase, i) => (
          <div key={phase} className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mb-1 ${processingProgress >= (i+1)*20 ? 'bg-primary' : 'bg-muted'}`}></div>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">{phase}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisProgress;
