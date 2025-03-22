
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, Brain } from 'lucide-react';

interface AnalysisButtonProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  onClick: () => void;
  isDemoMode?: boolean;
}

const AnalysisButton = ({ 
  videoFile, 
  isAnalyzing, 
  onClick,
  isDemoMode = false
}: AnalysisButtonProps) => {
  const buttonDisabled = !videoFile || isAnalyzing;
  
  return (
    <Button 
      onClick={onClick}
      className="w-full mt-4 text-base py-6"
      disabled={buttonDisabled}
    >
      {isAnalyzing ? (
        <>
          <span className="animate-pulse">
            {isDemoMode ? "Running Demo Analysis..." : "Analyzing with GPT-4o..."}
          </span>
        </>
      ) : (
        <>
          <Brain size={18} className="mr-2" />
          {videoFile 
            ? isDemoMode 
              ? "Run Demo Analysis" 
              : "Analyze with GPT-4o" 
            : "Select Video to Analyze"}
        </>
      )}
    </Button>
  );
};

export default AnalysisButton;
