
import { useEffect, useState, RefObject, useCallback } from 'react';
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
  const [lastProcessTime, setLastProcessTime] = useState<number>(0);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);
  const [alreadySentAnalysis, setAlreadySentAnalysis] = useState<boolean>(false);
  const [detectionAttempts, setDetectionAttempts] = useState<number>(0);

  const initializePoseDetector = useCallback(async () => {
    if (!videoRef.current) {
      console.log('Cannot initialize pose detector - video ref is null');
      return;
    }
    
    try {
      console.log('Initializing MediaPipe pose detector...');
      setDetectionActive(true);
      const detector = await createPoseDetector();
      setPoseDetector(detector);
      console.log('✅ MediaPipe Pose detector initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing pose detector:', error);
      setDetectionActive(false);
    }
  }, [videoRef, setDetectionActive]);

  const processFrame = useCallback(async () => {
    if (!poseDetector || !videoRef.current) {
      console.log('Cannot process frame - detector or video not ready');
      return;
    }
    
    if (videoRef.current.paused || videoRef.current.ended) {
      console.log('Video is paused or ended, skipping frame processing');
      return;
    }
    
    const now = Date.now();
    if (now - lastProcessTime < 100) return;
    setLastProcessTime(now);
    
    try {
      console.log('Processing video frame at time:', videoRef.current.currentTime);
      await detectPose(poseDetector, videoRef.current, (results: Results) => {
        if (results.poseLandmarks) {
          const visibleLandmarks = results.poseLandmarks.filter(lm => lm.visibility > 0.5).length;
          console.log(`Detected ${visibleLandmarks}/${results.poseLandmarks.length} landmarks`);
          
          onPoseDetection(true);
          
          if (onPoseAnalysis && !alreadySentAnalysis) {
            const metrics = calculatePoseMetrics(results);
            if (metrics) {
              const currentTime = Date.now();
              if (currentTime - lastAnalysisTime > 2000) {
                console.log('Calculated pose metrics:', metrics);
                onPoseAnalysis(metrics);
                setLastAnalysisTime(currentTime);
                
                // Check if we're in demo mode via a property on the window object
                if (window.usedFallbackData) {
                  console.log('Demo mode detected - setting alreadySentAnalysis to true');
                  setAlreadySentAnalysis(true);
                }
              }
            }
          }
        } else {
          console.log('No pose landmarks detected in this frame');
          onPoseDetection(false);
          
          // Increment detection attempts for tracking purposes
          setDetectionAttempts(prev => prev + 1);
          
          // If we've tried several times and still can't detect a pose, log a warning
          if (detectionAttempts > 10) {
            console.warn('Multiple attempts to detect pose have failed. Make sure the person is visible in the video.');
          }
        }
      });
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
  }, [poseDetector, videoRef, lastProcessTime, onPoseDetection, onPoseAnalysis, alreadySentAnalysis, lastAnalysisTime, detectionAttempts]);

  const handlePlay = useCallback(() => {
    console.log('Video playback started - beginning pose detection');
    
    if (!poseDetector) {
      console.log('No pose detector found, initializing now...');
      initializePoseDetector();
      return;
    }
    
    if (detectionInterval) clearInterval(detectionInterval);
    console.log('Setting up detection interval');
    const interval = setInterval(() => {
      processFrame();
    }, 100);
    setDetectionInterval(interval);
  }, [poseDetector, detectionInterval, initializePoseDetector, processFrame]);

  const handlePause = useCallback(() => {
    console.log('Video paused - stopping pose detection');
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
  }, [detectionInterval]);

  useEffect(() => {
    if (videoFile) {
      console.log('Video file changed, resetting analysis state', {
        fileName: videoFile.name,
        fileSize: videoFile.size,
        fileType: videoFile.type
      });
      setAlreadySentAnalysis(false);
      setDetectionAttempts(0);
      
      // If we already have a pose detector and we change the video file,
      // make sure to clean up the old detector
      if (poseDetector) {
        console.log('Cleaning up existing pose detector');
        poseDetector.close();
        setPoseDetector(null);
      }
    }
  }, [videoFile, poseDetector]);

  useEffect(() => {
    if (!videoRef.current || !videoFile) {
      console.log('Video ref or file not available, skipping pose detection setup');
      return;
    }
    
    console.log('Setting up pose detection for video file:', videoFile.name);
    const video = videoRef.current;
    
    // Add event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // Initialize detection on mount if video is already playing
    if (!video.paused && !video.ended) {
      console.log('Video is already playing, initializing detection now');
      handlePlay();
    } else {
      console.log('Video is paused initially, waiting for play event');
    }
    
    return () => {
      console.log('Cleaning up pose detection');
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      if (detectionInterval) {
        console.log('Clearing detection interval');
        clearInterval(detectionInterval);
      }
      
      if (poseDetector) {
        console.log('Closing pose detector');
        poseDetector.close();
      }
    };
  }, [videoRef.current, videoFile, handlePlay, handlePause, detectionInterval, poseDetector]);

  return {
    poseDetector,
    processFrame
  };
};
