import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { FileVideo, Upload, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import DemoModeToggle from './panel/DemoModeToggle';
import ApiKeyValidator from './panel/ApiKeyValidator';

interface VideoAnalysisPanelProps {
  sport: string;
  drill: string;
  videoFile: File | null;
  isAnalyzing: boolean;
  isSaving: boolean;
  analysisResult: any;
  apiError: string | null;
  isDemoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  onRetry: () => void;
}

const VideoAnalysisPanel: React.FC<VideoAnalysisPanelProps> = ({
  sport,
  drill,
  videoFile,
  isAnalyzing,
  isSaving,
  analysisResult,
  apiError,
  isDemoMode,
  onDemoModeChange,
  onVideoSelected,
  onAnalyzeClick,
  onRetry
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoSelected(file);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Video Analysis</CardTitle>
        <CardDescription>
          Analyze your {sport} {drill} technique.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          {videoFile ? (
            <div className="flex items-center">
              <FileVideo className="h-4 w-4 mr-2 text-gray-500" />
              <span>{videoFile.name}</span>
            </div>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2 text-gray-500" />
              <span>Upload a video file</span>
            </>
          )}
          <Input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="video-upload"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          >
            {videoFile ? 'Change Video' : 'Select Video'}
          </label>
        </div>

        {isAnalyzing && !analysisResult && (
          <Progress value={50} className="w-full" />
        )}

        {apiError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {apiError}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!isAnalyzing && !analysisResult && (
          <>
            <DemoModeToggle 
              isDemoMode={isDemoMode} 
              onToggle={onDemoModeChange} 
              disabled={isAnalyzing} 
            />
            <ApiKeyValidator />
          </>
        )}

        {analysisResult && (
          <div className="text-sm text-muted-foreground flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            Analysis Complete
          </div>
        )}

        {isAnalyzing ? (
          <Button variant="secondary" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </Button>
        ) : analysisResult ? (
          <Button onClick={onRetry}>Retry Analysis</Button>
        ) : (
          <Button onClick={onAnalyzeClick} disabled={!videoFile}>
            Analyze Technique
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoAnalysisPanel;
