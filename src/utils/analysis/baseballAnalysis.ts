
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse, generateGenericAnalysis } from './analysisHelpers';

// Baseball-specific analysis
export const generateBaseballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  let metrics = [];
  let feedback = { good: [], improve: [] };
  let coachingTips = [];
  
  if (drillName.includes("Pitching")) {
    metrics = [
      {
        name: "Arm Slot Consistency",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Stride Length",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Hip-Shoulder Separation",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Balance Point",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good momentum towards home plate",
        "Consistent arm slot through delivery",
        "Strong front side at release"
      ],
      improve: [
        "Work on maintaining better posture through release",
        "Focus on hip-shoulder separation timing",
        "Keep your head still during delivery"
      ]
    };
    
    coachingTips = [
      "Practice with a towel to groove your arm path",
      "Use video analysis from both sides to check alignment",
      "Work on long toss to build arm strength naturally",
      "Practice balance drills on both legs"
    ];
  } else if (drillName.includes("Batting") || drillName.includes("Hitting")) {
    metrics = [
      {
        name: "Weight Transfer",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Hip Rotation",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Bat Path",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Head Position",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good bat path through the zone",
        "Proper weight transfer from back to front",
        "Head remains still through the swing"
      ],
      improve: [
        "Work on keeping your hands inside the ball",
        "Focus on hip rotation before upper body",
        "Try to maintain balance through follow-through"
      ]
    };
    
    coachingTips = [
      "Practice with a tee to work on specific zones",
      "Use soft toss drills to improve timing",
      "Work on tracking the ball from release point",
      "Practice hitting to all fields"
    ];
  } else {
    // Generic baseball analysis for other drills
    return generateGenericAnalysis(drillName, score);
  }
  
  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
