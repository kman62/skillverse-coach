import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generatePitchingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Velocity (85+ mph), command, mechanics, pitch variety
  const metrics = [
    {
      name: "Arm Mechanics",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Hip-Shoulder Separation",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Release Point Consistency",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Follow Through",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    },
    {
      name: "Leg Drive",
      value: Math.floor(score * 0.92 + Math.random() * 8),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Strong hip-shoulder separation creating power",
      "Consistent release point for command",
      "Good balance throughout delivery",
      "Proper weight transfer to front leg"
    ],
    improve: [
      "Work on delaying shoulder rotation for more velocity",
      "Keep your eyes locked on target throughout delivery",
      "Drive harder off the rubber with your back leg",
      "Finish with chest over front knee for better command"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Aim for 85+ mph fastball velocity by senior year",
    "Long toss 3x/week to build arm strength (120+ feet)",
    "Use weighted ball program to increase velocity safely",
    "Develop 2-3 quality secondary pitches with command",
    "Film yourself from side view to check mechanics",
    "Work on quick tempo to keep hitters off balance"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
