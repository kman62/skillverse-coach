
import { Results } from '@mediapipe/pose';

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
export const calculateSymmetry = (landmarks: any[]): number => {
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
export const calculateStability = (landmarks: any[]): number => {
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
export const calculatePosture = (landmarks: any[]): number => {
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
export const calculateForm = (landmarks: any[]): number => {
  // This is a placeholder - in a real application,
  // you would implement sport-specific form analysis
  
  // For now, we'll base it on overall landmark visibility
  const visibilitySum = landmarks
    .map(lm => lm.visibility || 0)
    .reduce((sum, val) => sum + val, 0);
  
  return Math.min(100, (visibilitySum / landmarks.length) * 130);
};
