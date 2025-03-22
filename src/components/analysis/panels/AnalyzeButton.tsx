
import React from 'react';
import { BarChart, Camera } from 'lucide-react';

interface AnalyzeButtonProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  useLocalAnalysis: boolean;
  onAnalyze: () => void;
}

const AnalyzeButton = ({ 
  videoFile, 
  isAnalyzing, 
  useLocalAnalysis, 
  onAnalyze 
}: AnalyzeButtonProps) => {
  return (
    <button
      onClick={onAnalyze}
      disabled={!videoFile || isAnalyzing}
      className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center transition-colors ${
        !videoFile || isAnalyzing 
          ? "bg-primary/60 cursor-not-allowed" 
          : "bg-primary hover:bg-primary/90"
      }`}
    >
      {isAnalyzing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        </>
      ) : (
        <>
          {useLocalAnalysis ? <Camera size={18} className="mr-2" /> : <BarChart size={18} className="mr-2" />}
          Analyze Technique
        </>
      )}
    </button>
  );
};

export default AnalyzeButton;
