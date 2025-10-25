import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateDriverAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Distance (280+ yards), accuracy, ball flight control
  const metrics = [
    {
      name: "Setup & Alignment",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Backswing Plane",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Impact Position",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Follow-Through",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Solid setup with good posture",
      "Consistent swing plane",
      "Good hip rotation and power generation",
      "Balanced finish position"
    ],
    improve: [
      "Maintain spine angle through impact",
      "Increase hip rotation in downswing",
      "Work on consistent face control",
      "Improve tempo and rhythm"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Drive ball 280+ yards with 70%+ fairway accuracy",
    "Practice with alignment sticks for consistency",
    "Work on launch angle optimization (10-14 degrees)",
    "Develop shot shaping ability (draw and fade)",
    "Build rotational power and flexibility",
    "Track ball speed and smash factor metrics"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
