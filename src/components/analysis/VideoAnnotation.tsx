
import React, { useEffect, useRef, useState } from 'react';
import { createPoseDetector, detectPose, drawPoseLandmarks, calculatePoseMetrics } from '@/utils/mediapipe/poseDetection';
import { Results } from '@mediapipe/pose';

interface VideoAnnotationProps {
  videoFile: File | null;
  analysisResult: any | null;
  isDemoMode?: boolean;
  onPoseAnalysis?: (metrics: any) => void;
}

const VideoAnnotation = ({ 
  videoFile, 
  analysisResult, 
  isDemoMode,
  onPoseAnalysis 
}: VideoAnnotationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poseDetected, setPoseDetected] = useState(false);
  const [detectionActive, setDetectionActive] = useState(false);
  
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
            setPoseDetected(true);
            drawPoseLandmarks(ctx, results, canvas.width, canvas.height);
            
            // Calculate metrics from pose data
            const metrics = calculatePoseMetrics(results);
            
            // Pass metrics to parent component if callback provided
            if (metrics && onPoseAnalysis) {
              onPoseAnalysis(metrics);
            }
          } else {
            setPoseDetected(false);
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
            drawAnalysisAnnotations(ctx, canvas.width, canvas.height, video.currentTime, video.duration);
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
      setIsPlaying(true);
      if (!poseDetector) {
        initializePoseDetection();
      }
      
      // Start detection loop
      if (detectionInterval) clearInterval(detectionInterval);
      detectionInterval = setInterval(processFrame, 100); // Process every 100ms
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
      }
    };
    
    // Draw analysis annotations based on current video time
    const drawAnalysisAnnotations = (
      ctx: CanvasRenderingContext2D, 
      width: number, 
      height: number,
      currentTime: number,
      totalDuration: number
    ) => {
      // Only draw if we have analysis results
      if (!analysisResult) return;
      
      // Calculate progress through video
      const progress = totalDuration ? currentTime / totalDuration : 0;
      
      // Frame around the video
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      
      // Draw different annotations based on video time
      if (progress < 0.33) {
        drawStanceAnalysis(ctx, width, height);
      } else if (progress < 0.66) {
        drawMovementAnalysis(ctx, width, height, currentTime);
      } else {
        drawCompletionAnalysis(ctx, width, height);
      }
      
      // Always show score
      const score = analysisResult.score || 75;
      drawScore(ctx, score, width, height);
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
  }, [videoRef.current, canvasRef.current, videoFile, analysisResult]);
  
  // These are the original annotation drawing functions
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
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {detectionActive && (
          <div className={`px-2 py-1 rounded text-xs ${poseDetected ? 'bg-green-600/70' : 'bg-yellow-600/70'} text-white`}>
            {poseDetected ? 'Pose Detected' : 'Searching...'}
          </div>
        )}
        {isDemoMode && (
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
            Demo Annotations
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnnotation;
