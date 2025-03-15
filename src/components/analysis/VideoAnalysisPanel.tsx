
import React from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { BarChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoAnalysisPanelProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
}

const VideoAnalysisPanel = ({ 
  videoFile, 
  isAnalyzing, 
  onVideoSelected,
  onAnalyzeClick 
}: VideoAnalysisPanelProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Technique</h2>
      <VideoUploader onVideoSelected={onVideoSelected} />
      
      <div className="mt-6">
        <button
          onClick={onAnalyzeClick}
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
              <BarChart size={18} className="mr-2" />
              Analyze Technique
            </>
          )}
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-3">Tips for Best Results</h3>
        <ul className="space-y-2 pl-5">
          <li className="text-muted-foreground text-sm list-disc">
            Ensure good lighting and a clear background
          </li>
          <li className="text-muted-foreground text-sm list-disc">
            Position the camera to capture your full body movement
          </li>
          <li className="text-muted-foreground text-sm list-disc">
            Perform the technique at a normal speed
          </li>
          <li className="text-muted-foreground text-sm list-disc">
            Wear appropriate clothing that makes it easy to see your form
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoAnalysisPanel;
