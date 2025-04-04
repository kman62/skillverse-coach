
import React, { useState, useEffect } from 'react';
import VideoCanvas from '@/components/analysis/annotations/VideoCanvas';
import StatusIndicators from '@/components/analysis/annotations/StatusIndicators';

interface VideoAnnotationProps {
  videoFile: File | null;
  analysisResult: any | null;
  onPoseAnalysis?: (metrics: any) => void;
}

const VideoAnnotation = ({ 
  videoFile, 
  analysisResult, 
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
  
  useEffect(() => {
    // Log the analysis type when the component mounts or analysisResult changes
    if (analysisResult && analysisResult.analysisType) {
      console.log(`VideoAnnotation received analysis with type: ${analysisResult.analysisType}`);
    }
  }, [analysisResult]);
  
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
      />
    </div>
  );
};

export default VideoAnnotation;
