import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateServeAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Serve speed (100+ mph for men), consistency, variety
  const metrics = [
    {
      name: "Toss Consistency",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Racquet Path",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Power Generation",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Placement",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Consistent ball toss placement",
      "Good shoulder rotation and power",
      "Solid follow-through mechanics",
      "Effective placement variety"
    ],
    improve: [
      "Increase leg drive for more power",
      "Work on pronation for better spin",
      "Develop second serve consistency",
      "Improve toss placement for different serves"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Serve speed 100+ mph for men, 80+ mph for women",
    "Practice serving 100+ balls daily",
    "Develop three serve variations (flat, slice, kick)",
    "Work on second serve consistency (70%+ in)",
    "Build shoulder and core strength",
    "Study professional serving techniques"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
