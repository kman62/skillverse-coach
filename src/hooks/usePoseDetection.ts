
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
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  // Initialize MediaPipe pose detection
  const initializePoseDetection = async () => {
    if (!videoRef.current) {
      console.warn('Video element not ready, delaying initialization');
      return;
    }
    
    try {
      console.log('Initializing MediaPipe pose detector...');
      setDetectionActive(true);
      const detector = await createPoseDetector();
      setPoseDetector(detector);
      console.log('✅ MediaPipe Pose detector initialized successfully');
      return detector;
    } catch (error) {
      console.error('❌ Error initializing pose detector:', error);
      setDetectionActive(false);
      return null;
    }
  };

  // Process video frames
  const processFrame = useCallback(async () => {
    if (!poseDetector || !videoRef.current) {
      console.warn('Cannot process frame: detector or video not ready');
      return;
    }
    
    // Skip processing if video is paused or ended
    if (videoRef.current.paused || videoRef.current.ended) {
      console.log('Video is paused or ended, skipping pose detection');
      return;
    }
    
    // Check if video has loaded metadata
    if (!videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      console.warn('Video dimensions not yet available');
      return;
    }
    
    // Throttle processing to avoid overloading
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
          
          // Calculate metrics from pose data and pass to parent
          if (onPoseAnalysis) {
            const metrics = calculatePoseMetrics(results);
            if (metrics) {
              console.log('Calculated pose metrics:', metrics);
              onPoseAnalysis(metrics);
            } else {
              console.warn('Could not calculate pose metrics from results');
            }
          }
        } else {
          console.log('No pose landmarks detected in this frame');
          onPoseDetection(false);
        }
      });
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
  }, [poseDetector, videoRef, lastProcessTime, onPoseDetection, onPoseAnalysis, setLastProcessTime]);

  // Handle video play and pause
  const handlePlay = useCallback(async () => {
    console.log('Video playback started - beginning pose detection');
    
    if (!poseDetector) {
      console.log('No pose detector found, initializing now...');
      const detector = await initializePoseDetection();
      if (!detector) {
        console.warn('Failed to initialize pose detector on play');
        return;
      }
    }
    
    // Start detection loop
    if (detectionInterval) clearInterval(detectionInterval);
    const interval = setInterval(processFrame, 100); // Process every 100ms
    setDetectionInterval(interval);
  }, [poseDetector, detectionInterval, processFrame, initializePoseDetection]);

  const handlePause = useCallback(() => {
    console.log('Video paused - stopping pose detection');
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
  }, [detectionInterval]);

  useEffect(() => {
    if (!videoRef.current || !videoFile) return;
    
    console.log('Setting up pose detection for video file:', videoFile.name);
    initializePoseDetection();
    
    const video = videoRef.current;
    
    // Set up event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // Initialize pose detection if video autoplay is enabled
    if (!video.paused && !video.ended) {
      handlePlay();
    }
    
    // Clean up
    return () => {
      console.log('Cleaning up pose detection');
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      if (poseDetector) {
        poseDetector.close();
      }
    };
  }, [videoRef.current, videoFile]);

  // Retry initialization if it fails
  useEffect(() => {
    if (!poseDetector && videoFile && initializationAttempts < 3) {
      const timer = setTimeout(() => {
        console.log(`Retrying pose detector initialization (attempt ${initializationAttempts + 1})`);
        setInitializationAttempts(prev => prev + 1);
        initializePoseDetection();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [poseDetector, videoFile, initializationAttempts]);

  return {
    poseDetector,
    processFrame
  };
};
