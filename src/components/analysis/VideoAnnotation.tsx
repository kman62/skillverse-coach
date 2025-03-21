
import React, { useEffect, useRef, useState } from 'react';

interface VideoAnnotationProps {
  videoFile: File | null;
  analysisResult: any | null;
  isDemoMode?: boolean;
}

const VideoAnnotation = ({ videoFile, analysisResult, isDemoMode }: VideoAnnotationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
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
    
    // Draw annotations based on current video time
    const drawAnnotations = () => {
      if (!ctx || !analysisResult) return;
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate some demo annotations if we have analysis results
      if (analysisResult) {
        // Draw frame
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        // Draw different annotations based on video time
        const currentTime = video.currentTime;
        const totalTime = video.duration || 1;
        const progress = currentTime / totalTime;
        
        // Simulate different annotations at different points in the video
        if (progress < 0.33) {
          // Initial stance analysis
          drawStanceAnalysis(ctx, canvas.width, canvas.height);
        } else if (progress < 0.66) {
          // Movement analysis
          drawMovementAnalysis(ctx, canvas.width, canvas.height, currentTime);
        } else {
          // Form completion analysis
          drawCompletionAnalysis(ctx, canvas.width, canvas.height);
        }
        
        // Always show score
        const score = analysisResult.score || 75;
        drawScore(ctx, score, canvas.width, canvas.height);
      }
      
      // Request next frame if video is playing
      if (!video.paused && !video.ended) {
        requestAnimationFrame(drawAnnotations);
      }
    };
    
    // Handle video events
    const handlePlay = () => {
      setIsPlaying(true);
      drawAnnotations();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleTimeUpdate = () => {
      if (video.paused || video.ended) {
        drawAnnotations();
      }
    };
    
    // Set up event listeners
    video.addEventListener('loadedmetadata', updateCanvasDimensions);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    // Clean up
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasDimensions);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef.current, canvasRef.current, videoFile, analysisResult]);
  
  const drawStanceAnalysis = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // Draw stance guide lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; // green
    ctx.lineWidth = 2;
    
    // Foot position indicators
    const footY = height * 0.85;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.beginPath();
    ctx.ellipse(width * 0.4, footY, 30, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(width * 0.6, footY, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body alignment line
    ctx.beginPath();
    ctx.moveTo(width * 0.5, height * 0.3);
    ctx.lineTo(width * 0.5, height * 0.8);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(20, 50, 150, 30);
    ctx.fillStyle = 'rgba(34, 197, 94, 1)';
    ctx.font = '14px sans-serif';
    ctx.fillText('STANCE ANALYSIS', 35, 70);
  };
  
  const drawMovementAnalysis = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    time: number
  ) => {
    // Draw movement trajectory
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)'; // yellow
    ctx.lineWidth = 3;
    
    // Oscillation based on time for animation effect
    const oscillation = Math.sin(time * 5) * 20;
    
    // Movement arc
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.6);
    ctx.quadraticCurveTo(
      width * 0.5, 
      height * 0.3 + oscillation, 
      width * 0.7, 
      height * 0.6
    );
    ctx.stroke();
    
    // Direction arrow
    const arrowSize = 15;
    const arrowX = width * 0.6;
    const arrowY = height * 0.5 + oscillation;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
    ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
    ctx.closePath();
    ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
    ctx.fill();
    
    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(20, 50, 180, 30);
    ctx.fillStyle = 'rgba(234, 179, 8, 1)';
    ctx.font = '14px sans-serif';
    ctx.fillText('MOVEMENT ANALYSIS', 35, 70);
  };
  
  const drawCompletionAnalysis = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    // Draw form completion indicators
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)'; // purple
    ctx.lineWidth = 2;
    
    // Form completion zone
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.4);
    ctx.bezierCurveTo(
      width * 0.3, height * 0.2,
      width * 0.7, height * 0.2,
      width * 0.8, height * 0.4
    );
    ctx.lineTo(width * 0.7, height * 0.7);
    ctx.lineTo(width * 0.3, height * 0.7);
    ctx.closePath();
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.fill();
    ctx.stroke();
    
    // Checkmark for good completion
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, height * 0.5);
    ctx.lineTo(width * 0.45, height * 0.6);
    ctx.lineTo(width * 0.6, height * 0.4);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(20, 50, 200, 30);
    ctx.fillStyle = 'rgba(168, 85, 247, 1)';
    ctx.font = '14px sans-serif';
    ctx.fillText('COMPLETION ANALYSIS', 35, 70);
  };
  
  const drawScore = (
    ctx: CanvasRenderingContext2D, 
    score: number,
    width: number, 
    height: number
  ) => {
    // Draw score in top right corner
    const scoreX = width - 70;
    const scoreY = 30;
    const scoreRadius = 25;
    
    // Score background
    ctx.beginPath();
    ctx.arc(scoreX, scoreY, scoreRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fill();
    
    // Score border - color based on score
    let borderColor = 'rgba(239, 68, 68, 0.9)'; // red
    if (score >= 70) borderColor = 'rgba(234, 179, 8, 0.9)'; // yellow
    if (score >= 85) borderColor = 'rgba(34, 197, 94, 0.9)'; // green
    
    ctx.beginPath();
    ctx.arc(scoreX, scoreY, scoreRadius, 0, Math.PI * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Score text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score.toString(), scoreX, scoreY);
  };
  
  if (!videoFile) return null;
  
  return (
    <div className="relative w-full">
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
      {isDemoMode && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Demo Annotations
        </div>
      )}
    </div>
  );
};

export default VideoAnnotation;
