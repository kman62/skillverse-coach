
import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateJumpShotAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    {
      name: "Vertical Alignment",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Release Timing",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Landing Balance",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Shot Arc",
      value: Math.floor(score * 0.8 + Math.random() * 20),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Good lift on your jump",
      "Shot release at peak of jump",
      "Consistent shooting motion"
    ],
    improve: [
      "Work on landing in the same spot you jumped from",
      "Try to achieve a higher arc on your shot",
      "Keep your non-shooting hand more stable"
    ]
  };
  
  const coachingTips = [
    "Practice shooting with a chair under the basket to force a higher arc",
    "Use the 'hop' technique for better balance on catch-and-shoot",
    "Film yourself from the side to analyze your shot arc",
    "Practice shooting after fatigue to build consistency"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
