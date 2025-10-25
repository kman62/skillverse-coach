import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateLinebackerAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Pursuit angles, tackling, coverage ability, instincts
  const metrics = [
    {
      name: "Pursuit Angles",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Tackling Form",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Coverage Drops",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Read & React",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Quick diagnosis of plays",
      "Efficient pursuit angles to ball carrier",
      "Strong tackling fundamentals",
      "Good coverage technique in drops"
    ],
    improve: [
      "Improve reaction time to offensive keys",
      "Work on shedding blocks more quickly",
      "Develop better coverage footwork",
      "Stay lower when engaging blockers"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate 4.5-4.7 second 40-yard speed",
    "Study offensive formations and tendencies",
    "Practice coverage drops and man coverage",
    "Work on block destruction techniques",
    "Develop lateral agility with cone drills",
    "Build both strength and speed"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
