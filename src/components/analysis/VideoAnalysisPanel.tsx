
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { FileVideo, Upload, Loader2, AlertTriangle } from 'lucide-react';
import DemoModeToggle from './panel/DemoModeToggle';
import ConnectionStatus from './panel/ConnectionStatus';
import AnalysisStageIndicator from './panel/AnalysisStageIndicator';
import AnalysisButton from './panel/AnalysisButton';
import { useToast } from '@/hooks/use-toast';
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
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check connection status on component mount
    checkConnectionStatus();
    
    // Add event listener for analysis stages
    const handleAnalysisStage = (event: CustomEvent) => {
      console.log("Analysis stage event:", event.detail);
      setAnalysisStage(event.detail.stage);
      
      // Update progress based on stage
      const stageProgressMap: Record<string, number> = {
        'started': 10,
        'api-request-gpt4o': 20,
        'processing-video': 30,
        'analyzing-technique': 60,
        'generating-feedback': 80,
        'api-success-gpt4o': 90,
        'analysis-complete': 100
      };
      
      if (stageProgressMap[event.detail.stage]) {
        setProcessingProgress(stageProgressMap[event.detail.stage]);
      }
      
      // If we get an error, show toast notification
      if (event.detail.stage.includes('error') || event.detail.stage.includes('failed')) {
        toast({
          title: "Analysis Error",
          description: "There was an error analyzing your video. Try using Demo Mode instead.",
          variant: "destructive",
        });
      }
    };
    
    window.addEventListener('analysis-stage', handleAnalysisStage as EventListener);
    
    return () => {
      window.removeEventListener('analysis-stage', handleAnalysisStage as EventListener);
    };
  }, [toast]);
  
  const checkConnectionStatus = async () => {
    setIsCheckingConnection(true);
    try {
      console.log("Testing OpenAI API key validity...");
      const result = await checkOpenAIApiKey();
      console.log("API key check response:", result);
      
      if (result.isValid) {
        setConnectionStatus('connected');
        toast({
          title: "Connected to GPT-4o",
          description: "Successfully connected to OpenAI's GPT-4o API.",
          variant: "default",
        });
      } else {
        // If the API key check fails but we have some connection, set to limited
        setConnectionStatus('limited');
        toast({
          title: "Limited Connection",
          description: "There may be issues with the GPT-4o connection. Consider using Demo Mode.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // If we can't even reach the check endpoint, set to offline
      console.error('Connection check failed:', error);
      setConnectionStatus('offline');
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI analysis service. Please use Demo Mode.",
        variant: "destructive",
      });
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

  const showDemoModeAlert = connectionStatus === 'offline' && !isDemoMode;

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
              <span className="text-sm truncate max-w-[200px]">{videoFile.name}</span>
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
          <Progress value={processingProgress} className="w-full" />
        )}
        
        <AnalysisStageIndicator 
          analysisStage={analysisStage}
          isAnalyzing={isAnalyzing}
        />
        
        {showDemoModeAlert && (
          <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-700 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Connection to GPT-4o is unavailable. Enable Demo Mode below to analyze videos with pre-generated feedback.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="w-full">
          <AnalysisButton
            videoFile={videoFile}
            isAnalyzing={isAnalyzing}
            onClick={onAnalyzeClick}
            isDemoMode={isDemoMode}
          />
        </div>
        
        <div className="flex w-full justify-between items-center">
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoAnalysisPanel;
