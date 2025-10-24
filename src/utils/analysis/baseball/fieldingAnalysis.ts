import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateFieldingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Quick feet, soft hands, arm strength, quick release
  const metrics = [
    {
      name: "Fielding Position",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Footwork",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Glove Work",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Transfer Speed",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Low, athletic fielding position",
      "Good footwork through the ball",
      "Clean glove-to-hand transfer",
      "Proper momentum toward target"
    ],
    improve: [
      "Get lower on ground balls for better control",
      "Work on smoother glove-to-hand transfer",
      "Take more direct routes to the ball",
      "Keep glove out in front of body"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Infielders need sub-2.0 second pop time (catch to throw)",
    "Practice barehand drills to improve hand-eye coordination",
    "Work on first step quickness with reaction drills",
    "Build arm strength with long toss program",
    "Take 100+ ground balls per week minimum",
    "Study proper footwork patterns for double plays"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
