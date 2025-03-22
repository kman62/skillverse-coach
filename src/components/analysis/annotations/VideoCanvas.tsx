
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use the pose detection hook
  const { poseDetector, processFrame } = usePoseDetection({
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
      
      // Force a frame process to check if detection works
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        console.log('Video is playing, processing initial frame');
        processFrame();
      }
    }
  }, [poseDetector, toast, processFrame]);

  // Tell user when video loads to play it
  const handleVideoLoaded = () => {
    console.log('Video loaded and ready for playback', {
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      videoFile: videoFile.name,
      fileSize: videoFile.size
    });
    setVideoLoaded(true);
    setVideoError(null);
    toast({
      title: "Video Loaded",
      description: "Press play to begin pose detection",
      duration: 3000,
    });
  };

  // Handle errors loading video
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const errorMessage = (e.target as HTMLVideoElement).error?.message || 'Unknown error';
    console.error('Error loading video:', errorMessage, e);
    setVideoError(errorMessage);
    setVideoLoaded(false);
    toast({
      title: "Video Error",
      description: `There was a problem loading the video: ${errorMessage}. Please try another file.`,
      variant: "destructive",
      duration: 5000,
    });
  };
  
  // Force play button to be visible for better user experience
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.controls = true;
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        controls
        src={URL.createObjectURL(videoFile)}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        playsInline
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

      {videoLoaded && !poseDetector && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 p-2 rounded text-xs">
          Pose detector loading...
        </div>
      )}
      
      {videoError && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-800 p-2 rounded text-xs">
          Error: {videoError}
        </div>
      )}
    </>
  );
};

export default VideoCanvas;
