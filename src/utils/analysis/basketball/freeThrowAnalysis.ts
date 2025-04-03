
import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

/**
 * Specialized analysis function for Free Throw technique based on 5 key criteria
 */
export const generateFreeThrowAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const timestamp = new Date().toISOString();
  console.log(`🏀 [${timestamp}] Free Throw Analysis triggered for "${drillName}" with base score ${score}`);
  
  // Calculate individual component scores
  const baselineScore = score;
  
  // Calculate component scores with small variations
  const preparationScore = Math.min(100, Math.max(50, baselineScore + (Math.random() * 10 - 5)));
  const handPlacementScore = Math.min(100, Math.max(50, baselineScore + (Math.random() * 10 - 5)));
  const aimingScore = Math.min(100, Math.max(50, baselineScore + (Math.random() * 10 - 5)));
  const motionScore = Math.min(100, Math.max(50, baselineScore + (Math.random() * 10 - 5)));
  const evaluationScore = Math.min(100, Math.max(50, baselineScore + (Math.random() * 10 - 5)));
  
  // Log the component scores for debugging
  console.log(`🏀 Free Throw Analysis components: 
    - Preparation: ${Math.round(preparationScore)}
    - Hand Placement: ${Math.round(handPlacementScore)}
    - Aiming & Focus: ${Math.round(aimingScore)}
    - Shooting Motion: ${Math.round(motionScore)}
    - Adjustment: ${Math.round(evaluationScore)}
  `);
  
  // Define the metrics based on the 5 key criteria for free throws
  const metrics = [
    {
      name: "Preparation",
      value: Math.round(preparationScore),
      target: 95,
      unit: "%"
    },
    {
      name: "Hand Placement",
      value: Math.round(handPlacementScore),
      target: 95, 
      unit: "%"
    },
    {
      name: "Aiming & Focus",
      value: Math.round(aimingScore),
      target: 98,
      unit: "%"
    },
    {
      name: "Shooting Motion",
      value: Math.round(motionScore),
      target: 95,
      unit: "%"
    },
    {
      name: "Adjustment",
      value: Math.round(evaluationScore),
      target: 90,
      unit: "%"
    }
  ];
  
  // Create tailored feedback based on scores
  const goodFeedback = [];
  const improveFeedback = [];
  
  // Preparation feedback
  if (preparationScore > 80) {
    goodFeedback.push("Excellent balanced stance with feet properly positioned");
  } else {
    improveFeedback.push("Work on a more consistent approach and balanced stance at the line");
  }
  
  // Hand placement feedback
  if (handPlacementScore > 80) {
    goodFeedback.push("Good fingertip control of the ball with proper hand positioning");
  } else {
    improveFeedback.push("Focus on proper hand placement with fingertip control, not palm contact");
  }
  
  // Aiming feedback
  if (aimingScore > 80) {
    goodFeedback.push("Consistent eye focus on the target throughout the shooting process");
  } else {
    improveFeedback.push("Maintain your gaze on a specific target point on the rim throughout the shot");
  }
  
  // Motion feedback
  if (motionScore > 80) {
    goodFeedback.push("Smooth, synchronized shooting motion with good follow-through");
  } else {
    improveFeedback.push("Work on a more fluid shooting motion with consistent follow-through");
  }
  
  // If we need additional feedback items to meet the minimum of 3
  while (goodFeedback.length < 3) {
    const additionalGood = [
      "Good rhythm in your pre-shot routine",
      "Consistent ball positioning before the shot",
      "Proper alignment of shooting arm with the basket"
    ];
    
    // Add items that aren't already in the list
    for (const item of additionalGood) {
      if (!goodFeedback.includes(item)) {
        goodFeedback.push(item);
        if (goodFeedback.length >= 3) break;
      }
    }
  }
  
  while (improveFeedback.length < 3) {
    const additionalImprove = [
      "Try to maintain more consistent rhythm in your routine",
      "Keep your elbow aligned with the basket throughout the shot",
      "Hold your follow-through position longer to build muscle memory"
    ];
    
    // Add items that aren't already in the list
    for (const item of additionalImprove) {
      if (!improveFeedback.includes(item)) {
        improveFeedback.push(item);
        if (improveFeedback.length >= 3) break;
      }
    }
  }
  
  // Expert coaching tips specific to free throws
  const coachingTips = [
    "Practice the 'BEEF' method: Balance, Eyes, Elbow, Follow-through",
    "Use visualization techniques before each shot - see the ball going through the net",
    "Create a consistent pre-shot routine with the same number of dribbles and breaths every time",
    "Practice free throws when physically tired to simulate game conditions"
  ];
  
  // Create a localStorage record of the analysis execution
  try {
    const analysisLog = JSON.parse(localStorage.getItem('freeThrowAnalysisLog') || '[]');
    analysisLog.push({
      timestamp,
      drillName,
      score,
      components: {
        preparation: Math.round(preparationScore),
        handPlacement: Math.round(handPlacementScore),
        aiming: Math.round(aimingScore),
        motion: Math.round(motionScore),
        evaluation: Math.round(evaluationScore)
      }
    });
    // Keep only the last 50 entries
    if (analysisLog.length > 50) {
      analysisLog.shift();
    }
    localStorage.setItem('freeThrowAnalysisLog', JSON.stringify(analysisLog));
  } catch (error) {
    console.error('Error logging free throw analysis:', error);
  }
  
  // Log completion of analysis
  console.log(`🏀 [${timestamp}] Free Throw Analysis completed for "${drillName}"`);
  
  // Return the complete free throw analysis
  return buildAnalysisResponse(
    drillName,
    score,
    metrics,
    {
      good: goodFeedback.slice(0, 3),
      improve: improveFeedback.slice(0, 3)
    },
    coachingTips
  );
};
