
import React, { useRef, useState, useEffect } from 'react';
import { Results } from '@mediapipe/pose';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import PoseCanvas from './PoseCanvas';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  
  // Use the pose detection hook
  const { poseDetector } = usePoseDetection({
    videoRef,
    videoFile,
    onPoseDetection: (detected) => {
      setPoseDetected(detected);
      onPoseDetection(detected);
    },
    onPoseAnalysis,
    setDetectionActive
  });

  // Notify user when pose detection is initialized
  useEffect(() => {
    if (poseDetector) {
      console.log('MediaPipe pose detector is ready');
      toast({
        title: "Pose Detection Ready",
        description: "Play the video to start analyzing your technique",
        duration: 3000,
      });
    }
  }, [poseDetector, toast]);

  // Tell user when video loads to play it
  const handleVideoLoaded = () => {
    toast({
      title: "Video Loaded",
      description: "Press play to begin pose detection",
      duration: 3000,
    });
  };
  
  return (
    <>
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        controls
        src={URL.createObjectURL(videoFile)}
        onLoadedData={handleVideoLoaded}
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
