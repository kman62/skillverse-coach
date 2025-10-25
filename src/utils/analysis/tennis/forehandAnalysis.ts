import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateForehandAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Consistency, power, topspin generation, court coverage
  const metrics = [
    {
      name: "Preparation",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Contact Point",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Topspin Generation",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Follow-Through",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Early racquet preparation",
      "Consistent contact point in strike zone",
      "Good low-to-high swing path",
      "Strong follow-through and recovery"
    ],
    improve: [
      "Increase hip and shoulder rotation",
      "Work on maintaining contact point forward",
      "Generate more racquet head speed",
      "Improve footwork for better positioning"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Hit with 60+ mph ball speed and heavy topspin",
    "Practice cross-court and down-the-line targets",
    "Develop inside-out forehand for court control",
    "Work on hitting on the run",
    "Build rotational core strength",
    "Practice rally tolerance (20+ ball rallies)"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
