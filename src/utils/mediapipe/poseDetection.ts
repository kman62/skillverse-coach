
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { calculatePoseMetrics } from './poseMetrics';

// Initialize pose model with the desired options
export const createPoseDetector = async (): Promise<Pose> => {
  console.log('Creating pose detector with MediaPipe...');
  
  const pose = new Pose({
    locateFile: (file) => {
      const url = `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      console.log(`Loading MediaPipe file: ${url}`);
      return url;
    }
  });
  
  return new Promise((resolve, reject) => {
    // Set a timeout in case something hangs
    const timeoutId = setTimeout(() => {
      reject(new Error('MediaPipe initialization timed out after 10 seconds'));
    }, 10000);
    
    // Configure the model
    try {
      pose.setOptions({
        modelComplexity: 1, // 0, 1, or 2 - higher is more accurate but slower
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      console.log('MediaPipe pose detector configured successfully');
      clearTimeout(timeoutId);
      resolve(pose);
    } catch (error) {
      console.error('Failed to configure MediaPipe:', error);
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

// Process a video frame with the pose detector
export const detectPose = async (
  pose: Pose,
  videoElement: HTMLVideoElement,
  onResults: (results: Results) => void
): Promise<void> => {
  // Only process if video is playing
  if (videoElement.paused || videoElement.ended) {
    console.log('Video not playing, skipping pose detection');
    return;
  }
  
  // Check if video is ready
  if (videoElement.readyState < 2) {
    console.warn('Video not ready for processing yet (readyState:', videoElement.readyState, ')');
    return;
  }
  
  try {
    // Set the callback to receive results
    pose.onResults(onResults);
    
    // Process the current video frame
    // Updated to match the expected InputMap type without timestamp
    await pose.send({ 
      image: videoElement
    });
  } catch (error) {
    console.error('Error processing video frame:', error);
  }
};

// Draw pose landmarks on a canvas
export const drawPoseLandmarks = (
  ctx: CanvasRenderingContext2D,
  results: Results,
  width: number,
  height: number
) => {
  if (!results.poseLandmarks) {
    return;
  }
  
  // Draw landmarks
  ctx.fillStyle = '#00FF00';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  
  // Draw pose landmarks
  for (const landmark of results.poseLandmarks) {
    const x = landmark.x * width;
    const y = landmark.y * height;
    const z = landmark.z;
    
    // Adjust size based on z-value (distance from camera)
    const landmarkSize = Math.max(5, 10 - Math.abs(z) * 20);
    
    // Draw landmark point
    ctx.beginPath();
    ctx.arc(x, y, landmarkSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
  
  // Draw connections between landmarks
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 3;
  
  for (const connection of POSE_CONNECTIONS) {
    const start = results.poseLandmarks[connection[0]];
    const end = results.poseLandmarks[connection[1]];
    
    if (!start || !end) continue;
    
    ctx.beginPath();
    ctx.moveTo(start.x * width, start.y * height);
    ctx.lineTo(end.x * width, end.y * height);
    ctx.stroke();
  }
  
  // Draw visibility scores for debugging
  const visibleLandmarks = results.poseLandmarks.filter(lm => lm.visibility > 0.7).length;
  const totalLandmarks = results.poseLandmarks.length;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(10, 10, 200, 30);
  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText(`Landmarks detected: ${visibleLandmarks}/${totalLandmarks}`, 15, 30);
};

// Export the metric calculation function for use in other components
export { calculatePoseMetrics };
