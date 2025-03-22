
import React, { useRef, useState } from 'react';
import { Results } from '@mediapipe/pose';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import PoseCanvas from './PoseCanvas';

interface VideoCanvasProps {
  videoFile: File;
  analysisResult: any | null;
  onPoseDetection: (poseDetected: boolean) => void;
  onPoseAnalysis?: (metrics: any) => void;
  setDetectionActive: (active: boolean) => void;
}

const VideoCanvas = ({ 
  videoFile, 
  analysisResult, 
  onPoseDetection,
  onPoseAnalysis,
  setDetectionActive
}: VideoCanvasProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseDetected, setPoseDetected] = useState(false);
  const [poseResults, setPoseResults] = useState<Results | undefined>(undefined);
  
  // Use the pose detection hook
  usePoseDetection({
    videoRef,
    videoFile,
    onPoseDetection: (detected) => {
      setPoseDetected(detected);
      onPoseDetection(detected);
    },
    onPoseAnalysis,
    setDetectionActive
  });
  
  return (
    <>
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        controls
        src={URL.createObjectURL(videoFile)}
      />
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <PoseCanvas
        canvasRef={canvasRef}
        videoRef={videoRef}
        results={poseResults}
        analysisResult={analysisResult}
        poseDetected={poseDetected}
      />
    </>
  );
};

export default VideoCanvas;
