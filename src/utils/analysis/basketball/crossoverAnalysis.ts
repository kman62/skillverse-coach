
import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateCrossoverAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    {
      name: "Ball Control",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Change of Speed",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Body Deception",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Footwork",
      value: Math.floor(score * 0.8 + Math.random() * 20),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Good ball transfer from hand to hand",
      "Effective use of head and shoulder fakes",
      "Low and controlled dribble"
    ],
    improve: [
      "Focus on more explosive push-off from your plant foot",
      "Keep your dribble lower for better control",
      "Try incorporating change of pace with your crossover"
    ]
  };
  
  const coachingTips = [
    "Practice crossovers with a tennis ball to improve hand control",
    "Use cones to simulate defenders and practice change of direction",
    "Film yourself from defender's view to analyze your deception",
    "Incorporate hesitation moves to make crossovers more effective"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
