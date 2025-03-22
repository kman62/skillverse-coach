
import React, { useState, useEffect } from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { useToast } from '@/components/ui/use-toast';
import ConnectionStatus from './panel/ConnectionStatus';
import AnalysisProgress from './panel/AnalysisProgress';
import AnalysisButton from './panel/AnalysisButton';
import AnalysisModeSwitcher from './panel/AnalysisModeSwitcher';
import DemoModeAlert from './panel/DemoModeAlert';
import AnalysisStageIndicator from './panel/AnalysisStageIndicator';
import TechniqueGuidelines from './panel/TechniqueGuidelines';

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
  const { toast } = useToast();
  const [processingProgress, setProcessingProgress] = useState(0);
  const [usesDemoData, setUsesDemoData] = useState(false);
  const [progressPhase, setProgressPhase] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'limited' | 'offline'>('connected');
  const [useLocalAnalysis, setUseLocalAnalysis] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  
  // Progress simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      setProcessingProgress(0);
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          const phaseThresholds = [
            { threshold: 20, phase: 'Initializing analysis...' },
            { threshold: 40, phase: 'Processing video frames...' },
            { threshold: 60, phase: 'Analyzing technique...' },
            { threshold: 80, phase: 'Generating feedback...' },
            { threshold: 90, phase: 'Finalizing results...' },
          ];
          
          for (const { threshold, phase } of phaseThresholds) {
            if (prev < threshold) {
              setProgressPhase(phase);
              break;
            }
          }
          
          const increment = Math.random() * 3 + (prev < 30 ? 2 : prev < 60 ? 1 : 0.5);
          const newProgress = prev + increment;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 200);
    } else {
      setProcessingProgress(isAnalyzing ? 90 : 0);
      setProgressPhase('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  // Analysis stage listener
  useEffect(() => {
    const handleAnalysisStage = (event: CustomEvent) => {
      if (event.detail?.stage) {
        const stage = event.detail.stage;
        console.log(`Analysis stage detected: ${stage}`, event.detail);
        setAnalysisStage(stage);
        
        // Show toast notifications for important stages
        if (stage === 'api-request-primary') {
          toast({
            title: "Connecting to analysis server",
            description: "Sending video for analysis...",
          });
        } else if (stage === 'api-failed-primary') {
          toast({
            title: "Primary server unavailable",
            description: "Trying backup server...",
            variant: "default"
          });
        } else if (stage === 'api-success-primary' || stage === 'api-success-fallback') {
          toast({
            title: "Video analysis complete",
            description: "Processing results...",
          });
        } else if (stage === 'using-demo-data') {
          setUsesDemoData(true);
        }
      }
    };
    
    window.addEventListener('analysis-stage' as any, handleAnalysisStage);
    
    return () => {
      window.removeEventListener('analysis-stage' as any, handleAnalysisStage);
    };
  }, [toast]);

  // API connectivity check
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
        setUseLocalAnalysis(true);
      }
    };
    
    checkApiConnectivity();
    
    const intervalId = setInterval(checkApiConnectivity, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Video selection handler
  const handleVideoSelected = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    
    if (file.size > MAX_FILE_SIZE) {
      return;
    }
    
    setUsesDemoData(false);
    setAnalysisStage(null);
    onVideoSelected(file);
  };

  // Demo mode detection
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

  // Toggle between local and cloud analysis
  const toggleAnalysisMode = () => {
    setUseLocalAnalysis(!useLocalAnalysis);
    toast({
      title: !useLocalAnalysis ? "Local Analysis Enabled" : "Cloud Analysis Enabled",
      description: !useLocalAnalysis 
        ? "Using on-device MediaPipe for real-time pose detection" 
        : "Using cloud AI for comprehensive analysis"
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Technique</h2>
      
      <ConnectionStatus connectionStatus={connectionStatus} />
      
      <VideoUploader onVideoSelected={handleVideoSelected} />
      
      <AnalysisStageIndicator 
        analysisStage={analysisStage} 
        isAnalyzing={isAnalyzing} 
      />
      
      <AnalysisModeSwitcher 
        useLocalAnalysis={useLocalAnalysis} 
        toggleAnalysisMode={toggleAnalysisMode} 
      />
      
      <DemoModeAlert 
        usesDemoData={usesDemoData} 
        isAnalyzing={isAnalyzing} 
        useLocalAnalysis={useLocalAnalysis} 
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
          useLocalAnalysis={useLocalAnalysis} 
          onClick={() => {
            window.localStorage.setItem('useLocalAnalysis', useLocalAnalysis.toString());
            onAnalyzeClick();
          }} 
        />
      </div>
      
      <TechniqueGuidelines useLocalAnalysis={useLocalAnalysis} />
    </div>
  );
};

export default VideoAnalysisPanel;
