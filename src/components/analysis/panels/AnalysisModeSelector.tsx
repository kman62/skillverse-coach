
import React from 'react';
import { BarChart, Camera } from 'lucide-react';

interface AnalysisModeSelectorProps {
  useLocalAnalysis: boolean;
  onToggleAnalysisMode: () => void;
}

const AnalysisModeSelector = ({ useLocalAnalysis, onToggleAnalysisMode }: AnalysisModeSelectorProps) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground mr-2">Analysis Mode:</span>
        <button 
          onClick={onToggleAnalysisMode}
          className={`flex items-center text-xs px-2 py-1 rounded ${
            useLocalAnalysis 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {useLocalAnalysis ? (
            <>
              <Camera size={12} className="mr-1" /> 
              Local MediaPipe
            </>
          ) : (
            <>
              <BarChart size={12} className="mr-1" /> 
              Cloud AI
            </>
          )}
        </button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {useLocalAnalysis ? 'Real-time processing' : 'Advanced feedback'}
      </div>
    </div>
  );
};

export default AnalysisModeSelector;
