import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateRunningBackAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Vision, contact balance, speed, receiving ability
  const metrics = [
    {
      name: "Vision & Patience",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Contact Balance",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Acceleration",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Ball Security",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Patient reading of blocking schemes",
      "Good pad level through contact",
      "Quick acceleration through holes",
      "Secure ball carrying technique"
    ],
    improve: [
      "Be more decisive hitting the hole",
      "Lower your pad level before contact",
      "Work on jump cuts in tight spaces",
      "Improve pass protection technique"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate 4.4-4.6 second 40-yard speed",
    "Practice one-cut drills to improve decision speed",
    "Work on catching passes out of the backfield daily",
    "Build lower body strength for contact balance",
    "Study blocking schemes to improve vision",
    "Develop pass protection fundamentals"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
