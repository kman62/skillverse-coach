import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateDefensiveBackAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Coverage skills, ball skills, speed (sub 4.5s), tackling
  const metrics = [
    {
      name: "Coverage Technique",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Ball Skills",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Backpedal & Transition",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Tackling",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Smooth backpedal and transitions",
      "Good hand placement in press coverage",
      "Strong ball tracking and hands",
      "Solid tackling fundamentals"
    ],
    improve: [
      "Work on hip turn speed in transitions",
      "Improve anticipation on route breaks",
      "Keep tighter cushion in coverage",
      "Break down better before tackling"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Run sub-4.5 second 40-yard dash",
    "Practice catching tennis balls for ball skills",
    "Work on backpedal and hip turn drills daily",
    "Study receiver release moves and tendencies",
    "Develop press coverage technique",
    "Build open-field tackling skills"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
