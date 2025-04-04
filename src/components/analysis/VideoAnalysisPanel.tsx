
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from 'lucide-react';
import ConnectionStatus from './panel/ConnectionStatus';
import AnalysisStageIndicator from './panel/AnalysisStageIndicator';
import AnalysisButton from './panel/AnalysisButton';
import FileSelector from './panel/FileSelector';
import ConnectionCheck from './panel/ConnectionCheck';
import { useToast } from '@/hooks/use-toast';
import { checkOpenAIApiKey } from '@/utils/api/apiKeyValidator';

interface VideoAnalysisPanelProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  analysisStage?: string | null;
}

const VideoAnalysisPanel: React.FC<VideoAnalysisPanelProps> = ({
  videoFile,
  isAnalyzing,
  onVideoSelected,
  onAnalyzeClick,
  analysisStage
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'limited' | 'offline'>('connected');
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    checkConnectionStatus();
    
    const handleAnalysisStage = (event: CustomEvent) => {
      console.log("Analysis stage event:", event.detail);
      
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
      
      if (event.detail.stage.includes('error') || event.detail.stage.includes('failed')) {
        toast({
          title: "Analysis Error",
          description: "There was an error analyzing your video.",
          variant: "destructive",
        });
      }
      
      if (event.detail.stage === 'analysis-complete') {
        setTimeout(() => {
          setProcessingProgress(0);
        }, 1000);
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
        setConnectionStatus('limited');
        toast({
          title: "Limited Connection",
          description: "There may be issues with the GPT-4o connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('offline');
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI analysis service.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const showOfflineAlert = connectionStatus === 'offline';

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
        
        <FileSelector 
          videoFile={videoFile} 
          onVideoSelected={onVideoSelected} 
          disabled={isAnalyzing}
        />

        {isAnalyzing && (
          <Progress value={processingProgress} className="w-full" />
        )}
        
        <AnalysisStageIndicator 
          analysisStage={analysisStage}
          isAnalyzing={isAnalyzing}
        />
        
        {showOfflineAlert && (
          <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-700 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Connection to GPT-4o is unavailable. Try again later.
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
          />
        </div>
        
        <div className="flex justify-end w-full">
          <ConnectionCheck 
            isCheckingConnection={isCheckingConnection}
            onCheckConnection={checkConnectionStatus}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoAnalysisPanel;
