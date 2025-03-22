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
  const [lastProcessTime, setLastProcessTime] = useState<number>(0);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);
  const [alreadySentAnalysis, setAlreadySentAnalysis] = useState<boolean>(false);

  // Initialize MediaPipe pose detection
  const initializePoseDetection = async () => {
    if (!videoRef.current) return;
    
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
  };

  // Process video frames
  const processFrame = async () => {
    if (!poseDetector || !videoRef.current) return;
    
    // Skip processing if video is paused or ended
    if (videoRef.current.paused || videoRef.current.ended) return;
    
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
          if (onPoseAnalysis && !alreadySentAnalysis) {
            const metrics = calculatePoseMetrics(results);
            if (metrics) {
              // Only send analysis updates at a reasonable interval to prevent UI flickering
              const currentTime = Date.now();
              if (currentTime - lastAnalysisTime > 2000) {
                console.log('Calculated pose metrics:', metrics);
                onPoseAnalysis(metrics);
                setLastAnalysisTime(currentTime);
                
                // In demo mode, once we've sent metrics and analysis is shown,
                // we don't need to keep updating it
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
        }
      });
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
  };

  // Handle video play and pause
  const handlePlay = () => {
    console.log('Video playback started - beginning pose detection');
    
    if (!poseDetector) {
      console.log('No pose detector found, initializing now...');
      initializePoseDetection();
      return;
    }
    
    // Start detection loop
    if (detectionInterval) clearInterval(detectionInterval);
    const interval = setInterval(processFrame, 100); // Process every 100ms
    setDetectionInterval(interval);
  };

  const handlePause = () => {
    console.log('Video paused - stopping pose detection');
    if (detectionInterval) {
      clearInterval(detectionInterval);
      setDetectionInterval(null);
    }
  };

  // Reset analysis state when video file changes
  useEffect(() => {
    if (videoFile) {
      setAlreadySentAnalysis(false);
    }
  }, [videoFile]);

  useEffect(() => {
    if (!videoRef.current || !videoFile) return;
    
    console.log('Setting up pose detection for video file:', videoFile.name);
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
  }, [videoRef.current, videoFile, poseDetector]);

  return {
    poseDetector,
    processFrame
  };
};
