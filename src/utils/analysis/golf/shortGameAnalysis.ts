import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateShortGameAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Scrambling ability, up-and-down percentage, creativity
  const metrics = [
    {
      name: "Setup & Posture",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Club Selection",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Distance Control",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Spin Control",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Good club selection for situation",
      "Solid setup and ball position",
      "Excellent distance control",
      "Appropriate spin for shot type"
    ],
    improve: [
      "Work on bump-and-run shots",
      "Develop flop shot for tight pins",
      "Improve feel for different lies",
      "Practice from various distances"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Achieve 60%+ up-and-down from around green",
    "Practice 100+ short game shots per week",
    "Develop multiple shot options for same situation",
    "Work on bunker play from various lies",
    "Master distance control with wedges",
    "Build creativity through varied practice"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
