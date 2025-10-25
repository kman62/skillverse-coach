import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateVolleyAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Net play ability, quick hands, anticipation
  const metrics = [
    {
      name: "Ready Position",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Reaction Time",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Punch Technique",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Court Coverage",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Athletic ready position at net",
      "Quick hands and reaction time",
      "Solid punch technique with little backswing",
      "Good movement and court coverage"
    ],
    improve: [
      "Keep racquet head higher in ready position",
      "Move forward more on approach",
      "Improve low volley technique",
      "Work on touch and feel on drop volleys"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate confident net play and finishing ability",
    "Practice reaction volleys with partner feeds",
    "Develop both forehand and backhand volleys equally",
    "Work on approach shot then volley combinations",
    "Build quick-twitch footwork",
    "Study serve-and-volley patterns"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
