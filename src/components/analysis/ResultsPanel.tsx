
import React from 'react';
import { BarChart, Share2, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import AnalysisCard from '@/components/ui/AnalysisCard';
import BehaviorAnalysis from '@/components/ui/BehaviorAnalysis';
import { Button } from '@/components/ui/button';

interface ResultsPanelProps {
  isAnalyzing: boolean;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
  videoFile: File | null;
  apiError?: string | null;
}

const ResultsPanel = ({ isAnalyzing, analysisResult, behaviorAnalysis, videoFile, apiError }: ResultsPanelProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
      
      {!analysisResult && !isAnalyzing && !apiError && (
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
      
      {apiError && !isAnalyzing && (
        <div className="bg-card rounded-xl border border-destructive h-[500px] flex items-center justify-center p-6 text-center">
          <div>
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-destructive" />
            </div>
            <h3 className="text-lg font-medium">Analysis Error</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              {apiError || "There was an error analyzing your video. Please try again."}
            </p>
            <p className="text-muted-foreground mt-4 text-sm max-w-sm mx-auto">
              Note: We're showing fallback analysis results below for demonstration purposes.
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
          {/* Video with annotations */}
          {videoFile && (
            <div className="rounded-lg border border-border overflow-hidden bg-black relative">
              <video 
                className="w-full aspect-video object-contain" 
                controls
                src={URL.createObjectURL(videoFile)}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Analysis Overlay Active
              </div>
            </div>
          )}
          
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
              timing={behaviorAnalysis.timing}
              fatigue={behaviorAnalysis.fatigue}
            />
          )}
          
          {/* Coaching Tips Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-3">Coaching Tips</h3>
            <div className="space-y-3">
              {analysisResult.coachingTips.map((tip: string, index: number) => (
                <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-1 bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" className="flex-1">
              <Save size={16} className="mr-2" />
              Save Results
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
            <Button variant="default" className="flex-1">
              <RefreshCw size={16} className="mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
