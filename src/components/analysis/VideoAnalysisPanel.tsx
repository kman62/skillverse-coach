
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { FileVideo, Upload, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import DemoModeToggle from './panel/DemoModeToggle';
import ApiKeyValidator from './panel/ApiKeyValidator';

interface VideoAnalysisPanelProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  isDemoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
}

const VideoAnalysisPanel: React.FC<VideoAnalysisPanelProps> = ({
  videoFile,
  isAnalyzing,
  isDemoMode,
  onDemoModeChange,
  onVideoSelected,
  onAnalyzeClick
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
          Analyze your technique with AI
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

        {isAnalyzing && (
          <Progress value={50} className="w-full" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!isAnalyzing && (
          <>
            <DemoModeToggle 
              isDemoMode={isDemoMode} 
              onToggle={onDemoModeChange} 
              disabled={isAnalyzing} 
            />
            <ApiKeyValidator />
          </>
        )}

        {isAnalyzing ? (
          <Button variant="secondary" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </Button>
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
