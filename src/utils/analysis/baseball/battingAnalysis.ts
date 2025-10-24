import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateBattingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Exit velocity (90+ mph), bat speed, launch angle, contact quality
  const metrics = [
    {
      name: "Bat Path",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Hip Rotation",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Load & Timing",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Contact Point",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    },
    {
      name: "Extension",
      value: Math.floor(score * 0.92 + Math.random() * 8),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Strong hip rotation generating power",
      "Hands stay inside the ball well",
      "Good balance throughout swing",
      "Excellent extension through contact"
    ],
    improve: [
      "Keep your front shoulder closed longer",
      "Work on driving back hip through the zone",
      "Reduce uppercut for more consistent contact",
      "Stay back on off-speed pitches"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Target 90+ mph exit velocity off tee by senior year",
    "Use tee work daily to groove swing path",
    "Track your launch angle - aim for 10-25 degrees",
    "Develop opposite field power, not just pull",
    "Practice hitting to all fields for better bat control",
    "Build rotational power with medicine ball throws"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
