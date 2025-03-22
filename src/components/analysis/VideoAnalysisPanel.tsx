
import React, { useState, useEffect } from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { useToast } from '@/components/ui/use-toast';

// Import our new component modules
import ConnectionStatusBanner from './panels/ConnectionStatusBanner';
import AnalysisModeSelector from './panels/AnalysisModeSelector';
import DemoModeNotification from './panels/DemoModeNotification';
import AnalysisProgressIndicator from './panels/AnalysisProgressIndicator';
import AnalyzeButton from './panels/AnalyzeButton';
import AnalysisTips from './panels/AnalysisTips';

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
  
  // Handle analysis progress animation
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

  // Check API connectivity
  useEffect(() => {
    const checkApiConnectivity = async () => {
      try {
        const response = await fetch('https://api.aithlete.io/v1/status', {
          method: 'GET',
          headers: {
            'x-client-id': 'web-client-v1',
          },
        });
        
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('limited');
        }
      } catch (error) {
        setConnectionStatus('offline');
        setUseLocalAnalysis(true);
      }
    };
    
    checkApiConnectivity();
    
    const intervalId = setInterval(checkApiConnectivity, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle video selection
  const handleVideoSelected = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    
    if (file.size > MAX_FILE_SIZE) {
      return;
    }
    
    setUsesDemoData(false);
    onVideoSelected(file);
  };

  // Listen for demo mode event
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

  // Toggle analysis mode
  const toggleAnalysisMode = () => {
    setUseLocalAnalysis(!useLocalAnalysis);
    toast({
      title: !useLocalAnalysis ? "Local Analysis Enabled" : "Cloud Analysis Enabled",
      description: !useLocalAnalysis 
        ? "Using on-device MediaPipe for real-time pose detection" 
        : "Using cloud AI for comprehensive analysis"
    });
  };

  // Handle analyze button click
  const handleAnalyze = () => {
    window.localStorage.setItem('useLocalAnalysis', useLocalAnalysis.toString());
    onAnalyzeClick();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Technique</h2>
      
      <ConnectionStatusBanner connectionStatus={connectionStatus} />
      
      <VideoUploader onVideoSelected={handleVideoSelected} />
      
      <AnalysisModeSelector 
        useLocalAnalysis={useLocalAnalysis} 
        onToggleAnalysisMode={toggleAnalysisMode} 
      />
      
      <DemoModeNotification 
        usesDemoData={usesDemoData} 
        isAnalyzing={isAnalyzing} 
        useLocalAnalysis={useLocalAnalysis} 
      />
      
      <div className="mt-6">
        <AnalysisProgressIndicator 
          isAnalyzing={isAnalyzing} 
          processingProgress={processingProgress} 
          progressPhase={progressPhase} 
        />
        
        <AnalyzeButton 
          videoFile={videoFile} 
          isAnalyzing={isAnalyzing} 
          useLocalAnalysis={useLocalAnalysis} 
          onAnalyze={handleAnalyze} 
        />
      </div>
      
      <AnalysisTips useLocalAnalysis={useLocalAnalysis} />
    </div>
  );
};

export default VideoAnalysisPanel;
