import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateCatchingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Pop time (<2.0s to 2B), receiving, blocking, leadership
  const metrics = [
    {
      name: "Receiving Stance",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Blocking Technique",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Transfer Quickness",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Throwing Mechanics",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Strong receiving position with flexibility",
      "Quick feet on throw downs",
      "Excellent glove-to-hand transfer",
      "Good blocking technique with chest down"
    ],
    improve: [
      "Work on receiving pitches on edges with softer hands",
      "Keep weight slightly forward for better blocking",
      "Shorten arm action for quicker release",
      "Stay lower in receiving stance"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Sub-2.0 second pop time to second base",
    "Practice receiving work daily - focus on framing",
    "Work on footwork with chair drill",
    "Build arm strength for accurate throws",
    "Study opposing hitters' tendencies",
    "Develop strong rapport with pitching staff"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
