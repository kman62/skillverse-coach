
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';

// Initialize pose model with the desired options
export const createPoseDetector = async (): Promise<Pose> => {
  const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });
  
  // Configure the model
  await pose.setOptions({
    modelComplexity: 1, // 0, 1, or 2 - higher is more accurate but slower
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  
  return pose;
};

// Process a video frame with the pose detector
export const detectPose = async (
  pose: Pose,
  videoElement: HTMLVideoElement,
  onResults: (results: Results) => void
): Promise<void> => {
  // Only process if video is playing
  if (videoElement.paused || videoElement.ended) {
    return;
  }
  
  // Process the current video frame
  await pose.send({ image: videoElement });
  
  // Set the callback to receive results
  pose.onResults(onResults);
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
  if (process.env.NODE_ENV === 'development') {
    const visibleLandmarks = results.poseLandmarks.filter(lm => lm.visibility > 0.7).length;
    const totalLandmarks = results.poseLandmarks.length;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`Landmarks detected: ${visibleLandmarks}/${totalLandmarks}`, 15, 30);
  }
};

// Calculate pose metrics based on landmark positions
export const calculatePoseMetrics = (results: Results): any => {
  if (!results.poseLandmarks) {
    return null;
  }
  
  // Get key landmarks for analysis
  const landmarks = results.poseLandmarks;
  
  // Calculate basic metrics (these would be expanded in a real application)
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
