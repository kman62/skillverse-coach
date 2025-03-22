import React, { useState, useEffect } from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { useToast } from '@/components/ui/use-toast';
import ConnectionStatus from './panel/ConnectionStatus';
import AnalysisProgress from './panel/AnalysisProgress';
import AnalysisButton from './panel/AnalysisButton';
import DemoModeAlert from './panel/DemoModeAlert';
import AnalysisStageIndicator from './panel/AnalysisStageIndicator';
import TechniqueGuidelines from './panel/TechniqueGuidelines';
import DemoModeToggle from './panel/DemoModeToggle';

interface VideoAnalysisPanelProps {
  videoFile: File | null;
  isAnalyzing: boolean;
  onVideoSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  isDemoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

const VideoAnalysisPanel = ({ 
  videoFile, 
  isAnalyzing, 
  onVideoSelected,
  onAnalyzeClick,
  isDemoMode,
  onDemoModeChange
}: VideoAnalysisPanelProps) => {
  const { toast } = useToast();
  const [processingProgress, setProcessingProgress] = useState(0);
  const [usesDemoData, setUsesDemoData] = useState(false);
  const [progressPhase, setProgressPhase] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'limited' | 'offline'>('connected');
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      setProcessingProgress(0);
      
      const phaseThresholds = [
        { threshold: 20, phase: 'Initializing analysis...' },
        { threshold: 40, phase: 'Processing video frames...' },
        { threshold: 60, phase: 'Analyzing technique...' },
        { threshold: 80, phase: 'Generating feedback...' },
        { threshold: 99, phase: 'Finalizing results...' },
      ];
      
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          const getIncrement = (progress: number) => {
            if (progress < 30) return Math.random() * 2 + 1;
            if (progress < 60) return Math.random() * 1.5 + 0.5;
            if (progress < 80) return Math.random() * 1 + 0.3;
            return Math.random() * 0.5 + 0.1;
          };
          
          const increment = getIncrement(prev);
          const newProgress = prev + increment;
          
          for (const { threshold, phase } of phaseThresholds) {
            if (prev < threshold && newProgress >= threshold) {
              setProgressPhase(phase);
              break;
            } else if (prev < threshold) {
              break;
            }
          }
          
          return newProgress < 99 ? newProgress : 99;
        });
      }, 200);
      
      setProgressPhase('Initializing analysis...');
    } else {
      if (processingProgress > 0 && processingProgress < 100) {
        setProcessingProgress(100);
        setProgressPhase('Analysis complete!');
        
        const resetTimeout = setTimeout(() => {
          setProcessingProgress(0);
          setProgressPhase('');
        }, 1500);
        
        return () => clearTimeout(resetTimeout);
      } else {
        setProcessingProgress(0);
        setProgressPhase('');
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  useEffect(() => {
    const handleAnalysisStage = (event: CustomEvent) => {
      if (event.detail?.stage) {
        const stage = event.detail.stage;
        console.log(`Analysis stage detected: ${stage}`, event.detail);
        setAnalysisStage(stage);
        
        if (stage === 'api-request-primary') {
          setProcessingProgress(25);
          setProgressPhase('Connecting to analysis server...');
          
          toast({
            title: "Connecting to analysis server",
            description: "Sending video for analysis...",
          });
        } else if (stage === 'api-failed-primary') {
          setProcessingProgress(30);
          setProgressPhase('Trying backup server...');
          
          toast({
            title: "Primary server unavailable",
            description: "Trying backup server...",
            variant: "default"
          });
        } else if (stage === 'api-success-primary' || stage === 'api-success-fallback') {
          setProcessingProgress(90);
          setProgressPhase('Processing results...');
          
          toast({
            title: "Video analysis complete",
            description: "Processing results...",
          });
        } else if (stage === 'using-demo-data') {
          setUsesDemoData(true);
          setProcessingProgress(95);
          setProgressPhase('Preparing demo results...');
        }
      }
    };
    
    window.addEventListener('analysis-stage' as any, handleAnalysisStage);
    
    return () => {
      window.removeEventListener('analysis-stage' as any, handleAnalysisStage);
    };
  }, [toast]);

  useEffect(() => {
    const checkApiConnectivity = async () => {
      try {
        console.log("Checking API connectivity...");
        const response = await fetch('https://api.aithlete.io/v1/status', {
          method: 'GET',
          headers: {
            'x-client-id': 'web-client-v1',
          },
        });
        
        console.log("API connectivity check result:", { 
          status: response.status, 
          ok: response.ok 
        });
        
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('limited');
        }
      } catch (error) {
        console.error("API connectivity check failed:", error);
        setConnectionStatus('offline');
      }
    };
    
    checkApiConnectivity();
    
    const intervalId = setInterval(checkApiConnectivity, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleVideoSelected = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    
    if (file.size > MAX_FILE_SIZE) {
      return;
    }
    
    setUsesDemoData(false);
    setAnalysisStage(null);
    onVideoSelected(file);
  };

  useEffect(() => {
    const handleConnectionStatus = (event: CustomEvent) => {
      if (event.detail?.isDemoMode) {
        setUsesDemoData(true);
      }
    };
    
    window.addEventListener('analysis-status' as any, handleConnectionStatus);
    
    return () => {
      window.removeEventListener('analysis-status' as any, handleConnectionStatus);
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Technique</h2>
      
      <ConnectionStatus connectionStatus={connectionStatus} />
      
      <VideoUploader onVideoSelected={handleVideoSelected} />
      
      <DemoModeToggle 
        isDemoMode={isDemoMode} 
        onToggle={onDemoModeChange}
        disabled={isAnalyzing}
      />
      
      <AnalysisStageIndicator 
        analysisStage={analysisStage} 
        isAnalyzing={isAnalyzing} 
      />
      
      <DemoModeAlert 
        usesDemoData={usesDemoData || isDemoMode} 
        isAnalyzing={isAnalyzing} 
      />
      
      <div className="mt-6">
        <AnalysisProgress 
          isAnalyzing={isAnalyzing} 
          processingProgress={processingProgress} 
          progressPhase={progressPhase} 
        />
        
        <AnalysisButton 
          videoFile={videoFile} 
          isAnalyzing={isAnalyzing} 
          onClick={onAnalyzeClick}
          isDemoMode={isDemoMode}
        />
      </div>
      
      <TechniqueGuidelines />
    </div>
  );
};

export default VideoAnalysisPanel;
