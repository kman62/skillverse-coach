import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateDribblingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: 1v1 ability, change of pace, close control, creativity
  const metrics = [
    {
      name: "Close Control",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Change of Direction",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Speed with Ball",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Move Effectiveness",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Excellent close ball control",
      "Sharp changes of direction",
      "Good speed while maintaining control",
      "Effective moves beating defenders"
    ],
    improve: [
      "Use both feet more equally while dribbling",
      "Add more deception before acceleration",
      "Keep head up more while dribbling",
      "Develop quicker first step out of moves"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Win 60%+ of 1v1 attacking situations",
    "Practice ball mastery drills daily (100+ touches)",
    "Develop signature moves for 1v1 situations",
    "Work on accelerating out of touches",
    "Build ankle and foot strength for control",
    "Study top dribblers' techniques and timing"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
