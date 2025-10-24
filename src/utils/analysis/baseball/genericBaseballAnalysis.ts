import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericBaseballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Athleticism",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Body Control",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Fundamentals",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Technique",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Good overall baseball mechanics",
      "Athletic movement patterns",
      "Solid fundamental technique"
    ],
    improve: [
      "Continue refining technical skills",
      "Work on sport-specific strength training",
      "Focus on game situation awareness"
    ]
  }, [
    "D1 METRIC: Run sub-7.0 second 60-yard dash",
    "Build overall strength and conditioning",
    "Study the game to improve baseball IQ",
    "Practice game-like situations regularly"
  ]);
};
