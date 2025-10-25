import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generatePuttingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Putting average, three-putt avoidance, short putt conversion
  const metrics = [
    {
      name: "Alignment",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Stroke Path",
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
      name: "Green Reading",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Consistent setup and alignment",
      "Smooth pendulum stroke",
      "Good distance control and pace",
      "Effective green reading skills"
    ],
    improve: [
      "Work on starting putts on intended line",
      "Improve speed control on long putts",
      "Develop better feel for grain and slope",
      "Practice lag putting from 30+ feet"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Maintain sub-30 putts per round average",
    "Practice gate drills for stroke path",
    "Work on 3-6 foot putts until automatic",
    "Develop lag putting to avoid three-putts",
    "Build pre-putt routine for consistency",
    "Study green reading techniques"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
