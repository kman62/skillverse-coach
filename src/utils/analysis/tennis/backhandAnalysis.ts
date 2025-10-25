import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateBackhandAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Two-handed vs one-handed proficiency, slice variation
  const metrics = [
    {
      name: "Unit Turn",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Contact Point",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Weight Transfer",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Consistency",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Good shoulder turn and preparation",
      "Solid contact point positioning",
      "Effective weight transfer through shot",
      "Consistent shot depth and placement"
    ],
    improve: [
      "Work on earlier unit turn",
      "Maintain contact point further forward",
      "Increase follow-through extension",
      "Develop slice backhand variety"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate consistent depth and pace on backhands",
    "Practice both flat and topspin backhands",
    "Develop reliable slice backhand for variety",
    "Work on backhand down-the-line",
    "Build wrist and forearm strength",
    "Practice transition from defense to offense"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
