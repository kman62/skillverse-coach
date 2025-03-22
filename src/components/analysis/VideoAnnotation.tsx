
import React, { useState, useEffect } from 'react';
import VideoCanvas from '@/components/analysis/annotations/VideoCanvas';
import StatusIndicators from '@/components/analysis/annotations/StatusIndicators';

interface VideoAnnotationProps {
  videoFile: File | null;
  analysisResult: any | null;
  isDemoMode?: boolean;
  onPoseAnalysis?: (metrics: any) => void;
}

const VideoAnnotation = ({ 
  videoFile, 
  analysisResult, 
  isDemoMode,
  onPoseAnalysis 
}: VideoAnnotationProps) => {
  const [poseDetected, setPoseDetected] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  const [stablePoseDetection, setStablePoseDetection] = useState(false);
  
  // Stabilize pose detection status to prevent UI flickering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (poseDetected) {
      // If pose is detected, update stable state immediately
      setStablePoseDetection(true);
    } else {
      // If pose is lost, wait a bit before updating UI to prevent flickering
      timer = setTimeout(() => {
        setStablePoseDetection(false);
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [poseDetected]);
  
  // In demo mode, always show pose as detected after a brief delay
  useEffect(() => {
    if (isDemoMode && !stablePoseDetection) {
      const timer = setTimeout(() => {
        setStablePoseDetection(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isDemoMode, stablePoseDetection]);
  
  if (!videoFile) return null;
  
  return (
    <div className="relative w-full">
      <VideoCanvas 
        videoFile={videoFile}
        analysisResult={analysisResult}
        onPoseDetection={(detected) => setPoseDetected(detected)}
        onPoseAnalysis={onPoseAnalysis}
        setDetectionActive={setDetectionActive}
      />
      <StatusIndicators 
        detectionActive={detectionActive}
        poseDetected={stablePoseDetection}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};

export default VideoAnnotation;
