import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateLinemanAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Technique, strength, footwork, hand placement
  const metrics = [
    {
      name: "Hand Technique",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Footwork",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Leverage",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Finish",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Strong hand placement and punch",
      "Good pad level and leverage",
      "Quick feet in pass protection",
      "Consistent finish on blocks"
    ],
    improve: [
      "Keep your pad level lower at contact",
      "Widen your base for better balance",
      "Improve hand placement quickness",
      "Work on sustaining blocks longer"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Bench press 225 lbs for 20+ reps",
    "Practice hand placement drills daily",
    "Work on footwork with ladder and cone drills",
    "Build core and lower body strength",
    "Study film to understand blocking schemes",
    "Develop both run and pass blocking skills"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
