
import React from 'react';
import { BarChart } from 'lucide-react';
import AnalysisCard from '@/components/ui/AnalysisCard';
import BehaviorAnalysis from '@/components/ui/BehaviorAnalysis';

interface ResultsPanelProps {
  isAnalyzing: boolean;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
}

const ResultsPanel = ({ isAnalyzing, analysisResult, behaviorAnalysis }: ResultsPanelProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      {!analysisResult && !isAnalyzing && (
        <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center">
          <div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium">No Analysis Yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Upload a video and click "Analyze Technique" to receive personalized feedback.
            </p>
          </div>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center animate-pulse">
          <div>
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Analyzing Your Technique</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Please wait while our AI analyzes your movement patterns...
            </p>
          </div>
        </div>
      )}
      
      {analysisResult && !isAnalyzing && (
        <div className="animate-fade-in space-y-6">
          <AnalysisCard 
            title={analysisResult.title}
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
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
