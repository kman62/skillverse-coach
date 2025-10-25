import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericRugbyAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Technical Skills",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Physical Conditioning",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Game Awareness",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Rugby IQ",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Strong rugby fundamentals",
      "Good physical conditioning",
      "Solid game awareness"
    ],
    improve: [
      "Continue developing position-specific skills",
      "Work on rugby-specific conditioning",
      "Improve tactical understanding"
    ]
  }, [
    "D1 METRIC: Compete at high-level club rugby",
    "Develop both forward and back skills",
    "Build rugby-specific strength and endurance",
    "Study the game to improve rugby IQ"
  ]);
};
