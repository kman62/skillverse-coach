import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericTennisAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Footwork",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Stroke Mechanics",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Court Positioning",
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
  ], {
    good: [
      "Good overall tennis fundamentals",
      "Athletic court movement",
      "Solid stroke mechanics"
    ],
    improve: [
      "Continue developing stroke variety",
      "Work on tennis-specific conditioning",
      "Improve tactical decision-making"
    ]
  }, [
    "D1 METRIC: Compete at high-level junior tournaments (UTR 10+)",
    "Build tennis-specific fitness and endurance",
    "Develop all-court game capabilities",
    "Study match strategy and patterns"
  ]);
};
