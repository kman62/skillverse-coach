import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericFootballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Athleticism",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Technique",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Effort Level",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Fundamentals",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Good overall football fundamentals",
      "Athletic movement patterns",
      "High effort and intensity"
    ],
    improve: [
      "Continue refining position-specific skills",
      "Work on football-specific strength training",
      "Improve game situation awareness"
    ]
  }, [
    "D1 METRIC: Demonstrate sport-specific speed and strength",
    "Build overall strength and conditioning",
    "Study film to improve football IQ",
    "Practice position-specific drills regularly"
  ]);
};
