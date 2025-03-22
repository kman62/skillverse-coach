
import React, { useState, useEffect } from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { BarChart, Info, AlertTriangle, Camera, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

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

  useEffect(() => {
    // Listen for analysis stages
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
      
      {connectionStatus !== 'connected' && (
        <div className={`mb-4 p-3 rounded-md flex items-start gap-2 ${
          connectionStatus === 'limited' 
            ? 'bg-yellow-50 border border-yellow-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <AlertTriangle size={18} className={`flex-shrink-0 mt-0.5 ${
            connectionStatus === 'limited' ? 'text-yellow-500' : 'text-red-500'
          }`} />
          <p className={`text-sm ${
            connectionStatus === 'limited' ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {connectionStatus === 'limited' 
              ? 'Analysis service is operating in limited capacity. Some features may be slower than usual.' 
              : 'Analysis service is currently offline. Local analysis will be used automatically.'}
          </p>
        </div>
      )}
      
      <VideoUploader onVideoSelected={handleVideoSelected} />
      
      {analysisStage && isAnalyzing && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 flex items-center">
          <Activity size={14} className="mr-1.5" />
          <span>Current stage: {analysisStage.replace(/-/g, ' ')}</span>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Analysis Mode:</span>
          <button 
            onClick={toggleAnalysisMode}
            className={`flex items-center text-xs px-2 py-1 rounded ${
              useLocalAnalysis 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}
          >
            {useLocalAnalysis ? (
              <>
                <Camera size={12} className="mr-1" /> 
                Local MediaPipe
              </>
            ) : (
              <>
                <BarChart size={12} className="mr-1" /> 
                Cloud AI
              </>
            )}
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {useLocalAnalysis ? 'Real-time processing' : 'Advanced feedback'}
        </div>
      </div>
      
      {usesDemoData && !isAnalyzing && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
          <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Using demo mode. The API connection could not be established, so {
              useLocalAnalysis ? 'local' : 'simulated'
            } analysis data will be shown.
          </p>
        </div>
      )}
      
      <div className="mt-6">
        {isAnalyzing && (
          <div className="mb-5 space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{progressPhase}</span>
              <span className="font-medium">{Math.round(processingProgress)}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
            <div className="grid grid-cols-5 w-full mt-1">
              {['Initializing', 'Processing', 'Analyzing', 'Generating', 'Finalizing'].map((phase, i) => (
                <div key={phase} className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mb-1 ${processingProgress >= (i+1)*20 ? 'bg-primary' : 'bg-muted'}`}></div>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">{phase}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={() => {
            window.localStorage.setItem('useLocalAnalysis', useLocalAnalysis.toString());
            onAnalyzeClick();
          }}
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
              {useLocalAnalysis ? <Camera size={18} className="mr-2" /> : <BarChart size={18} className="mr-2" />}
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
          <li className="text-muted-foreground text-sm list-disc">
            Keep videos under 50MB for optimal processing
          </li>
          {useLocalAnalysis && (
            <li className="text-muted-foreground text-sm list-disc font-medium text-green-700">
              Make sure your face and full body are visible for better pose detection
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VideoAnalysisPanel;
