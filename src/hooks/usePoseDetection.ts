
import { useEffect, useState, RefObject } from 'react';
import { createPoseDetector, detectPose, calculatePoseMetrics } from '@/utils/mediapipe/poseDetection';
import { Results } from '@mediapipe/pose';

interface UsePoseDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoFile: File | null;
  onPoseDetection: (poseDetected: boolean) => void;
  onPoseAnalysis?: (metrics: any) => void;
  setDetectionActive: (active: boolean) => void;
}

export const usePoseDetection = ({
  videoRef,
  videoFile,
  onPoseDetection,
  onPoseAnalysis,
  setDetectionActive
}: UsePoseDetectionProps) => {
  const [poseDetector, setPoseDetector] = useState<any>(null);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize MediaPipe pose detection
  const initializePoseDetection = async () => {
    if (!videoRef.current) return;
    
    try {
      setDetectionActive(true);
      const detector = await createPoseDetector();
      setPoseDetector(detector);
      console.log('MediaPipe Pose detector initialized');
    } catch (error) {
      console.error('Error initializing pose detector:', error);
      setDetectionActive(false);
    }
  };

  // Process video frames
  const processFrame = async () => {
    if (!poseDetector || !videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
    
    try {
      await detectPose(poseDetector, videoRef.current, (results: Results) => {
        if (results.poseLandmarks) {
          onPoseDetection(true);
          
          // Calculate metrics from pose data and pass to parent
          if (onPoseAnalysis) {
            const metrics = calculatePoseMetrics(results);
            if (metrics) {
              onPoseAnalysis(metrics);
            }
          }
        } else {
          onPoseDetection(false);
        }
      });
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
  };

  // Handle video play and pause
  const handlePlay = () => {
    if (!poseDetector) {
      initializePoseDetection();
    }
    
    // Start detection loop
    if (detectionInterval) clearInterval(detectionInterval);
    const interval = setInterval(processFrame, 100); // Process every 100ms
    setDetectionInterval(interval);
  };

  const handlePause = () => {
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
  };

  useEffect(() => {
    if (!videoRef.current || !videoFile) return;
    
    const video = videoRef.current;
    
    // Set up event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // Initialize pose detection if video is already playing
    if (!video.paused && !video.ended) {
      handlePlay();
    }
    
    // Clean up
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      if (poseDetector) {
        poseDetector.close();
      }
    };
  }, [videoRef.current, videoFile, poseDetector]);

  return {
    poseDetector,
    processFrame
  };
};
