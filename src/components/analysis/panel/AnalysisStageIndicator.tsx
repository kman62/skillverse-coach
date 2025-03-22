
import React from 'react';
import { Activity } from 'lucide-react';

interface AnalysisStageIndicatorProps {
  analysisStage: string | null;
  isAnalyzing: boolean;
}

const AnalysisStageIndicator = ({ 
  analysisStage, 
  isAnalyzing 
}: AnalysisStageIndicatorProps) => {
  if (!analysisStage || !isAnalyzing) return null;
  
  return (
    <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex items-center">
      <Activity size={14} className="mr-1.5" />
      <span>Current stage: {analysisStage.replace(/-/g, ' ')}</span>
    </div>
  );
};

export default AnalysisStageIndicator;
