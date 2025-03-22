
import React, { useState, useEffect } from 'react';
import VideoUploader from '@/components/ui/VideoUploader';
import { BarChart, Info, AlertTriangle } from 'lucide-react';
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

  // Update progress bar during "analysis"
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      setProcessingProgress(0);
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          // Different speed for different phases
          const phaseThresholds = [
            { threshold: 20, phase: 'Initializing analysis...' },
            { threshold: 40, phase: 'Processing video frames...' },
            { threshold: 60, phase: 'Analyzing technique...' },
            { threshold: 80, phase: 'Generating feedback...' },
            { threshold: 90, phase: 'Finalizing results...' },
          ];
          
          // Update the phase text based on progress
          for (const { threshold, phase } of phaseThresholds) {
            if (prev < threshold) {
              setProgressPhase(phase);
              break;
            }
          }
          
          // Slowly increase progress, capping at 90% until complete
          const increment = Math.random() * 3 + (prev < 30 ? 2 : prev < 60 ? 1 : 0.5);
          const newProgress = prev + increment;
          return newProgress < 90 ? newProgress : 90;
        });
      }, 200);
    } else {
      // Reset or complete progress
      setProcessingProgress(isAnalyzing ? 90 : 0);
      setProgressPhase('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  // Check API connectivity when component mounts
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
          // API is reachable but returned an error
          setConnectionStatus('limited');
        }
      } catch (error) {
        // API is not reachable
        setConnectionStatus('offline');
      }
    };
    
    checkApiConnectivity();
    
    // Recheck connectivity every 5 minutes
    const intervalId = setInterval(checkApiConnectivity, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleVideoSelected = (file: File) => {
    // Check if file is too large before passing it to parent
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    
    if (file.size > MAX_FILE_SIZE) {
      // This error is now handled in the VideoUploader component
      // But we still check here to prevent passing large files up
      return;
    }
    
    // Reset the demo data indicator when a new video is selected
    setUsesDemoData(false);
    onVideoSelected(file);
  };

  // Handler for connection failures (when we use mock data)
  // This is called by AnalysisPage after catching a connection error
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
      
      {/* API Status Indicator */}
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
              : 'Analysis service is currently offline. Demo mode will be used automatically.'}
          </p>
        </div>
      )}
      
      <VideoUploader onVideoSelected={handleVideoSelected} />
      
      {usesDemoData && !isAnalyzing && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
          <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Using demo mode. The API connection could not be established, so simulated analysis data will be shown.
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
          <li className="text-muted-foreground text-sm list-disc">
            Keep videos under 50MB for optimal processing
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoAnalysisPanel;
