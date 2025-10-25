import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateReceiverAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Route running, hands, speed (sub 4.5s 40-yard), separation ability
  const metrics = [
    {
      name: "Route Precision",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Hand Technique",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Release off Line",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Separation",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Sharp route breaks creating separation",
      "Strong hands at catch point",
      "Good body positioning on contested catches",
      "Explosive release off the line"
    ],
    improve: [
      "Work on selling routes with head fakes",
      "Improve hand placement for contested catches",
      "Accelerate out of breaks more explosively",
      "Track the ball better over your shoulder"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Run sub-4.5 second 40-yard dash",
    "Practice catching with tennis balls for hand-eye coordination",
    "Work on route stems to set up defenders",
    "Develop chemistry with quarterbacks through repetition",
    "Study defensive back techniques and tendencies",
    "Build core strength for contested catches"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
