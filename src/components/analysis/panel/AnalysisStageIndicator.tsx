
import React from 'react';
import { Activity, Loader2 } from 'lucide-react';

interface AnalysisStageIndicatorProps {
  analysisStage: string | null;
  isAnalyzing: boolean;
}

const AnalysisStageIndicator = ({ 
  analysisStage, 
  isAnalyzing 
}: AnalysisStageIndicatorProps) => {
  if (!analysisStage && !isAnalyzing) return null;
  
  // Get human-readable stage description
  const getStageDescription = (stage: string | null): string => {
    if (!stage) return 'Preparing analysis...';
    
    const stageMap: Record<string, string> = {
      'started': 'Starting analysis...',
      'api-request-primary': 'Connecting to primary analysis server...',
      'api-error-primary': 'Primary server error, trying alternatives...',
      'api-failed-primary': 'Switching to backup server...',
      'api-request-fallback': 'Connecting to backup analysis server...',
      'api-error-fallback': 'Backup server error, trying alternatives...',
      'api-failed-fallback': 'Using local analysis...',
      'api-success-primary': 'Analysis complete, processing results...',
      'api-success-fallback': 'Analysis complete from backup server...',
      'api-failed-all': 'All servers unavailable, using demo mode...',
      'using-demo-data': 'Using demo data for analysis...',
      'demo-data-generated': 'Demo analysis complete...'
    };
    
    return stageMap[stage] || stage.replace(/-/g, ' ');
  };
  
  return (
    <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex items-center">
      {isAnalyzing ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Activity size={16} className="mr-2" />
      )}
      <span>{getStageDescription(analysisStage)}</span>
    </div>
  );
};

export default AnalysisStageIndicator;
