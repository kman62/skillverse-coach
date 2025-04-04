
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSportById, getDrillById } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

export function useAnalysisState() {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  const [drill, setDrill] = useState(drillId && sportId ? getDrillById(sportId, drillId) : null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const [poseMetrics, setPoseMetrics] = useState<any>(null);
  const [detectionActive, setDetectionActive] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
    
    if (sportId && drillId) {
      setDrill(getDrillById(sportId, drillId));
    }
  }, [sportId, drillId]);

  const handleVideoSelected = (file: File) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round(file.size / (1024 * 1024));
      toast({
        title: "Video too large",
        description: `Your video is ${sizeMB}MB which exceeds the 50MB limit. Please select a smaller file.`,
        variant: "destructive"
      });
      return;
    }
    
    console.log('Video selected:', file.name, 'size:', Math.round(file.size / 1024), 'KB');
    setVideoFile(file);
    setAnalysisResult(null);
    setBehaviorAnalysis(null);
    setApiError(null);
    setPoseMetrics(null);
    setDetectionActive(false);
  };

  const handlePoseAnalysis = (metrics: any) => {
    if (!metrics) return;
    
    console.log('Received pose analysis metrics:', metrics);
    
    // Store the latest metrics
    setPoseMetrics(metrics);
    
    // If we're in the middle of analysis, don't update the UI
    if (isAnalyzing) {
      console.log('Currently analyzing, skipping UI update');
      return;
    }
  };

  return {
    sport,
    drill,
    videoFile,
    isAnalyzing,
    setIsAnalyzing,
    analysisResult,
    setAnalysisResult,
    behaviorAnalysis,
    setBehaviorAnalysis,
    apiError,
    setApiError,
    isSaving,
    setIsSaving,
    analysisId,
    setAnalysisId,
    poseMetrics,
    setPoseMetrics,
    handleVideoSelected,
    handlePoseAnalysis,
    navigate
  };
}
