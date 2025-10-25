import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericGolfAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Setup & Posture",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Swing Mechanics",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Consistency",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Ball Striking",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Solid fundamentals and setup",
      "Consistent swing mechanics",
      "Good overall ball striking"
    ],
    improve: [
      "Continue developing all aspects of game",
      "Work on golf-specific fitness",
      "Improve course management skills"
    ]
  }, [
    "D1 METRIC: Shoot consistently in mid-70s or better",
    "Develop balanced game (driving, irons, short game, putting)",
    "Build mental toughness and course management",
    "Compete in junior tournaments regularly"
  ]);
};
