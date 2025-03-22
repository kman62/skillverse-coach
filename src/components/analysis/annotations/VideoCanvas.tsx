
import React, { useRef, useEffect } from 'react';
import { createPoseDetector, detectPose, drawPoseLandmarks } from '@/utils/mediapipe/poseDetection';
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
  
  // Import this function from mediapipe/poseDetection.ts to avoid circular dependencies
  const calculatePoseMetrics = (results: Results): any => {
    if (!results.poseLandmarks) {
      return null;
    }
    
    // Get key landmarks for analysis
    const landmarks = results.poseLandmarks;
    
    // Calculate basic metrics
    const metrics = {
      // Calculate pose symmetry (difference between left and right side positions)
      symmetry: calculateSymmetry(landmarks),
      
      // Calculate stability (how much key points move between frames)
      stability: calculateStability(landmarks),
      
      // Calculate posture score
      posture: calculatePosture(landmarks),
      
      // Calculate form score
      form: calculateForm(landmarks),
      
      // Raw landmark data for further processing
      landmarks: landmarks.map(lm => ({ x: lm.x, y: lm.y, z: lm.z, visibility: lm.visibility }))
    };
    
    return metrics;
  };
  
  // Calculate symmetry between left and right sides
  const calculateSymmetry = (landmarks: any[]): number => {
    // This is a simplified implementation
    // In a real application, you would compare corresponding left/right landmarks
    
    // Example: compare shoulders symmetry
    const leftShoulder = landmarks[11]; // Left shoulder
    const rightShoulder = landmarks[12]; // Right shoulder
    
    if (leftShoulder && rightShoulder) {
      // Calculate height difference (normalized)
      const heightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      // Convert to a 0-100 score (lower difference = higher score)
      return Math.max(0, 100 - (heightDiff * 500));
    }
    
    return 75; // Default value if landmarks are not visible
  };
  
  // Calculate stability of the pose
  const calculateStability = (landmarks: any[]): number => {
    // In a real implementation, this would compare positions across frames
    // For now, we'll use a placeholder implementation
    
    // Check visibility of key landmarks
    const keyLandmarks = [0, 11, 12, 23, 24]; // Nose, shoulders, hips
    const visibilitySum = keyLandmarks
      .map(idx => landmarks[idx]?.visibility || 0)
      .reduce((sum, val) => sum + val, 0);
    
    // Higher visibility generally means more stable detection
    return Math.min(100, (visibilitySum / keyLandmarks.length) * 110);
  };
  
  // Calculate posture score
  const calculatePosture = (landmarks: any[]): number => {
    // Check if spine is straight
    const nose = landmarks[0];
    const shoulderMid = {
      x: (landmarks[11].x + landmarks[12].x) / 2,
      y: (landmarks[11].y + landmarks[12].y) / 2
    };
    const hipMid = {
      x: (landmarks[23].x + landmarks[24].x) / 2,
      y: (landmarks[23].y + landmarks[24].y) / 2
    };
    
    // Calculate angle of deviation from vertical
    const dx = shoulderMid.x - hipMid.x;
    const dy = shoulderMid.y - hipMid.y;
    const angle = Math.abs(Math.atan2(dx, dy));
    
    // Convert to a 0-100 score (lower angle = better posture)
    return Math.max(0, 100 - (angle * 180 / Math.PI) * 2);
  };
  
  // Calculate form score for movement
  const calculateForm = (landmarks: any[]): number => {
    // This is a placeholder - in a real application,
    // you would implement sport-specific form analysis
    
    // For now, we'll base it on overall landmark visibility
    const visibilitySum = landmarks
      .map(lm => lm.visibility || 0)
      .reduce((sum, val) => sum + val, 0);
    
    return Math.min(100, (visibilitySum / landmarks.length) * 130);
  };
  
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
