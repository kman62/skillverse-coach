
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { FileVideo, Upload, Loader2 } from 'lucide-react';
import DemoModeToggle from './panel/DemoModeToggle';
import ConnectionStatus from './panel/ConnectionStatus';
import AnalysisStageIndicator from './panel/AnalysisStageIndicator';
import { checkOpenAIApiKey } from '@/utils/api/apiKeyValidator';

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
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'limited' | 'offline'>('connected');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  
  useEffect(() => {
    // Check connection status on component mount
    checkConnectionStatus();
    
    // Add event listener for analysis stages
    const handleAnalysisStage = (event: CustomEvent) => {
      console.log("Analysis stage event:", event.detail);
      setAnalysisStage(event.detail.stage);
    };
    
    window.addEventListener('analysis-stage', handleAnalysisStage as EventListener);
    
    return () => {
      window.removeEventListener('analysis-stage', handleAnalysisStage as EventListener);
    };
  }, []);
  
  const checkConnectionStatus = async () => {
    setIsCheckingConnection(true);
    try {
      console.log("Testing OpenAI API key validity...");
      const result = await checkOpenAIApiKey();
      console.log("API key check response:", result);
      
      if (result.isValid) {
        setConnectionStatus('connected');
      } else {
        // If the API key check fails but we have some connection, set to limited
        setConnectionStatus('limited');
      }
    } catch (error) {
      // If we can't even reach the check endpoint, set to offline
      console.error('Connection check failed:', error);
      setConnectionStatus('offline');
    } finally {
      setIsCheckingConnection(false);
    }
  };

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
        <ConnectionStatus connectionStatus={connectionStatus} />
        
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
        
        <AnalysisStageIndicator 
          analysisStage={analysisStage}
          isAnalyzing={isAnalyzing}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!isAnalyzing && (
          <>
            <DemoModeToggle 
              isDemoMode={isDemoMode} 
              onToggle={onDemoModeChange} 
              disabled={isAnalyzing} 
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnectionStatus} 
              disabled={isCheckingConnection}
            >
              {isCheckingConnection ? 'Checking...' : 'Check Connection'}
            </Button>
          </>
        )}

        {isAnalyzing ? (
          <Button variant="secondary" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </Button>
        ) : (
          <Button 
            onClick={onAnalyzeClick} 
            disabled={!videoFile || (connectionStatus === 'offline' && !isDemoMode)}
          >
            {connectionStatus === 'offline' && !isDemoMode 
              ? 'Enable Demo Mode to Analyze' 
              : 'Analyze Technique'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VideoAnalysisPanel;
