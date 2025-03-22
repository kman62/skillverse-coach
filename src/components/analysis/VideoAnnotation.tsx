
import React, { useState } from 'react';
import VideoCanvas from '@/components/analysis/annotations/VideoCanvas';
import StatusIndicators from '@/components/analysis/annotations/StatusIndicators';

interface VideoAnnotationProps {
  videoFile: File | null;
  analysisResult: any | null;
  isDemoMode?: boolean;
  onPoseAnalysis?: (metrics: any) => void;
  gameplaySituation?: string;
}

const VideoAnnotation = ({ 
  videoFile, 
  analysisResult, 
  isDemoMode,
  onPoseAnalysis,
  gameplaySituation = "regular"
}: VideoAnnotationProps) => {
  const [poseDetected, setPoseDetected] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  
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
        poseDetected={poseDetected}
        isDemoMode={isDemoMode}
      />
    </div>
  );
};

export default VideoAnnotation;
