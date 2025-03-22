
import React from 'react';
import { Activity, Loader2, Brain } from 'lucide-react';

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
    if (!stage) return 'Preparing GPT-4o analysis...';
    
    const stageMap: Record<string, string> = {
      'started': 'Starting GPT-4o analysis...',
      'api-request-gpt4o': 'Connecting to GPT-4o...',
      'api-success-gpt4o': 'GPT-4o analysis completed successfully!',
      'api-error-gpt4o': 'GPT-4o connection error, trying alternatives...',
      'api-failed-gpt4o': 'GPT-4o unavailable, trying alternatives...',
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
      'demo-data-generated': 'Demo analysis complete...',
      'processing-video': 'Processing video frames...',
      'analyzing-technique': 'Analyzing your technique...',
      'generating-feedback': 'Generating personalized feedback...',
      'saving-results': 'Saving your analysis results...'
    };
    
    return stageMap[stage] || stage.replace(/-/g, ' ');
  };
  
  // Determine indicator color based on stage
  const getIndicatorColor = (stage: string | null): string => {
    if (!stage) return 'bg-blue-50 border-blue-100 text-blue-700';
    
    if (stage.includes('error') || stage.includes('failed')) {
      return 'bg-yellow-50 border-yellow-100 text-yellow-700';
    }
    
    if (stage.includes('success') || stage.includes('complete')) {
      return 'bg-green-50 border-green-100 text-green-700';
    }
    
    if (stage.includes('gpt4o') && !stage.includes('failed') && !stage.includes('error')) {
      return 'bg-purple-50 border-purple-100 text-purple-700';
    }
    
    return 'bg-blue-50 border-blue-100 text-blue-700';
  };
  
  // Choose the appropriate icon
  const getIcon = (stage: string | null) => {
    if (isAnalyzing) {
      return <Loader2 size={16} className="mr-2 animate-spin" />;
    }
    
    if (stage && stage.includes('gpt4o') && !stage.includes('failed') && !stage.includes('error')) {
      return <Brain size={16} className="mr-2" />;
    }
    
    return <Activity size={16} className="mr-2" />;
  };
  
  return (
    <div className={`mt-3 p-2.5 border rounded-md text-sm flex items-center ${getIndicatorColor(analysisStage)}`}>
      {getIcon(analysisStage)}
      <span>{getStageDescription(analysisStage)}</span>
    </div>
  );
};

export default AnalysisStageIndicator;
