import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericSoccerAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Technical Ability",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Tactical Awareness",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Physical Fitness",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Soccer IQ",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Solid technical fundamentals",
      "Good tactical understanding",
      "Strong fitness and work rate"
    ],
    improve: [
      "Continue developing position-specific skills",
      "Work on soccer-specific conditioning",
      "Improve tactical decision-making"
    ]
  }, [
    "D1 METRIC: Compete at high level (ECNL, MLS Next, DA)",
    "Develop both offensive and defensive capabilities",
    "Build soccer-specific endurance and speed",
    "Study the game to improve soccer IQ"
  ]);
};
