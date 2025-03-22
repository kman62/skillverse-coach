
import React, { useRef, useEffect } from 'react';
import { createPoseDetector, detectPose, drawPoseLandmarks, calculatePoseMetrics } from '@/utils/mediapipe/poseDetection';
import { Results } from '@mediapipe/pose';
import { drawAnalysisAnnotations } from './AnnotationUtils';

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
  
  // Setup canvas and video synchronization
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !videoFile) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Match canvas dimensions to video
    const updateCanvasDimensions = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    // Initialize MediaPipe pose detection
    let poseDetector: any = null;
    let detectionInterval: NodeJS.Timeout | null = null;
    
    const initializePoseDetection = async () => {
      try {
        setDetectionActive(true);
        poseDetector = await createPoseDetector();
        console.log('MediaPipe Pose detector initialized');
      } catch (error) {
        console.error('Error initializing pose detector:', error);
        setDetectionActive(false);
      }
    };
    
    // Process video frames
    const processFrame = async () => {
      if (!poseDetector || !video || video.paused || video.ended) return;
      
      try {
        await detectPose(poseDetector, video, (results: Results) => {
          // Clear the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw pose landmarks
          if (results.poseLandmarks) {
            onPoseDetection(true);
            drawPoseLandmarks(ctx, results, canvas.width, canvas.height);
            
            // Calculate metrics from pose data and pass to parent
            if (onPoseAnalysis) {
              const metrics = calculatePoseMetrics(results);
              if (metrics) {
                onPoseAnalysis(metrics);
              }
            }
          } else {
            onPoseDetection(false);
            // Draw a message if no pose is detected
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(canvas.width/2 - 100, 20, 200, 30);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No pose detected', canvas.width/2, 40);
          }
          
          // Draw custom annotations based on analysis result
          if (analysisResult) {
            drawAnalysisAnnotations(
              ctx, 
              canvas.width, 
              canvas.height, 
              video.currentTime, 
              video.duration,
              analysisResult
            );
          }
          
          // Add timestamp for debugging
          ctx.fillStyle = 'white';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(`Time: ${video.currentTime.toFixed(1)}s`, canvas.width - 10, canvas.height - 10);
        });
      } catch (error) {
        console.error('Error in pose detection:', error);
      }
    };
    
    // Handle video events
    const handlePlay = () => {
      if (!poseDetector) {
        initializePoseDetection();
      }
      
      // Start detection loop
      if (detectionInterval) clearInterval(detectionInterval);
      detectionInterval = setInterval(processFrame, 100); // Process every 100ms
    };
    
    const handlePause = () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
      }
    };
    
    // Set up event listeners
    video.addEventListener('loadedmetadata', updateCanvasDimensions);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // Initialize pose detection if video is already playing
    if (!video.paused && !video.ended) {
      handlePlay();
    }
    
    // Clean up
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasDimensions);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      if (poseDetector) {
        poseDetector.close();
      }
    };
  }, [videoRef.current, canvasRef.current, videoFile, analysisResult, onPoseDetection, onPoseAnalysis, setDetectionActive]);
  
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
    </>
  );
};

export default VideoCanvas;
