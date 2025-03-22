
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
  const [videoReady, setVideoReady] = useState(false);
  const { toast } = useToast();
  
  // Use the pose detection hook
  const { poseDetector, processFrame } = usePoseDetection({
    videoRef,
    videoFile,
    onPoseDetection: (detected, results) => {
      setPoseDetected(detected);
      onPoseDetection(detected);
      if (results) {
        setPoseResults(results);
      }
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
    console.log('Video loaded successfully, dimensions:', 
      videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
    setVideoReady(true);
    toast({
      title: "Video Loaded",
      description: "Press play to begin pose detection",
      duration: 3000,
    });
  };

  // Force frame processing when video is playing
  useEffect(() => {
    if (!videoRef.current || !poseDetector || !videoReady) return;
    
    const video = videoRef.current;
    
    // Process frames when video is playing
    const checkVideoPlaying = () => {
      if (!video.paused && !video.ended) {
        console.log('Video is playing - processing frame');
        processFrame();
      }
    };
    
    // Process frames more frequently for better detection
    const intervalId = setInterval(checkVideoPlaying, 100);
    
    // Also process frames on timeupdate events
    const onTimeUpdate = () => {
      if (!video.paused && !video.ended) {
        processFrame();
      }
    };
    
    video.addEventListener('timeupdate', onTimeUpdate);
    
    return () => {
      clearInterval(intervalId);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [poseDetector, processFrame, videoReady]);
  
  return (
    <>
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        controls
        playsInline
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
