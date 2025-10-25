import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateIronAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Greens in regulation, distance control, ball striking
  const metrics = [
    {
      name: "Ball-First Contact",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Divot Pattern",
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
      name: "Trajectory",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Clean ball-first contact",
      "Consistent divot pattern after ball",
      "Good distance control and trajectory",
      "Solid impact position"
    ],
    improve: [
      "Work on weight shift to front foot",
      "Maintain lag through impact",
      "Improve face control for draws/fades",
      "Develop better distance gapping"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Hit 60%+ greens in regulation",
    "Practice with specific yardage targets",
    "Work on trajectory control (high/low shots)",
    "Develop consistent pre-shot routine",
    "Track dispersion patterns for each club",
    "Build consistent swing tempo"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
