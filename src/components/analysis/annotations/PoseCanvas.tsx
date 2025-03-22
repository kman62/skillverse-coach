
import React, { useEffect, RefObject } from 'react';
import { Results } from '@mediapipe/pose';
import { drawPoseLandmarks } from '@/utils/mediapipe/poseDetection';
import { drawAnalysisAnnotations } from './AnnotationUtils';

interface PoseCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  videoRef: RefObject<HTMLVideoElement>;
  results?: Results;
  analysisResult: any | null;
  poseDetected: boolean;
  gameplaySituation?: string;
}

const PoseCanvas: React.FC<PoseCanvasProps> = ({
  canvasRef,
  videoRef,
  results,
  analysisResult,
  poseDetected,
  gameplaySituation = "regular"
}) => {
  // Handle canvas drawing
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Match canvas dimensions to video
    const updateCanvasDimensions = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };
    
    video.addEventListener('loadedmetadata', updateCanvasDimensions);
    
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasDimensions);
    };
  }, [canvasRef, videoRef]);

  // Render function for drawing on canvas
  const renderCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pose landmarks if available
    if (results?.poseLandmarks) {
      drawPoseLandmarks(ctx, results, canvas.width, canvas.height);
    } else if (!poseDetected) {
      // Draw a message if no pose is detected
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(canvas.width/2 - 100, 20, 200, 30);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No pose detected', canvas.width/2, 40);
    }
    
    // Draw custom annotations based on analysis result and gameplay situation
    if (analysisResult) {
      drawAnalysisAnnotations(
        ctx, 
        canvas.width, 
        canvas.height, 
        video.currentTime, 
        video.duration,
        analysisResult,
        gameplaySituation
      );
    }
    
    // Add gameplay situation indicator
    if (gameplaySituation !== "regular") {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, canvas.height - 40, 180, 30);
      ctx.fillStyle = 'white';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      const formattedGameplay = gameplaySituation
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      ctx.fillText(`Gameplay: ${formattedGameplay}`, 20, canvas.height - 20);
    }
    
    // Add timestamp for debugging
    ctx.fillStyle = 'white';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Time: ${video.currentTime.toFixed(1)}s`, canvas.width - 10, canvas.height - 10);
    
    // Request animation frame for continuous rendering
    requestAnimationFrame(renderCanvas);
  };

  // Start rendering when component mounts
  useEffect(() => {
    const animationId = requestAnimationFrame(renderCanvas);
    return () => cancelAnimationFrame(animationId);
  }, [results, analysisResult, poseDetected]);

  return null; // This is a pure render component with no visible elements
};

export default PoseCanvas;
