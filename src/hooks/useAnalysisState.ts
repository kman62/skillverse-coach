
import { useState } from 'react';
import { AnalysisResponse } from '@/utils/videoAnalysisService';

export interface AnalysisState {
  videoFile: File | null;
  isAnalyzing: boolean;
  analysisResult: any | null;
  behaviorAnalysis: any | null;
  apiError: string | null;
  isSaving: boolean;
  isDemoMode: boolean;
  analysisId: string | undefined;
  poseMetrics: any;
  gameplaySituation: string | undefined;
  playType: string | undefined;
}

export const useAnalysisState = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const [poseMetrics, setPoseMetrics] = useState<any>(null);
  const [gameplaySituation, setGameplaySituation] = useState<string | undefined>(undefined);
  const [playType, setPlayType] = useState<string | undefined>(undefined);

  return {
    videoFile,
    setVideoFile,
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
    isDemoMode,
    setIsDemoMode,
    analysisId,
    setAnalysisId,
    poseMetrics,
    setPoseMetrics,
    gameplaySituation,
    setGameplaySituation,
    playType,
    setPlayType
  };
};
