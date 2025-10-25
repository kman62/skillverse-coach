import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateQuarterbackAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Arm strength (60+ yards), accuracy, pocket presence, decision-making
  const metrics = [
    {
      name: "Throwing Mechanics",
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
      name: "Release Point",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Accuracy",
      value: Math.floor(score * 0.88 + Math.random() * 12),
      target: 95,
      unit: "%"
    },
    {
      name: "Decision Making",
      value: Math.floor(score * 0.92 + Math.random() * 8),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      "Consistent release point and follow-through",
      "Good weight transfer during throw",
      "Quick decision-making under pressure",
      "Proper footwork in the pocket"
    ],
    improve: [
      "Keep your elbow at proper height",
      "Step toward your target consistently",
      "Increase hip rotation for more velocity",
      "Work on reading defensive coverage faster"
    ]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate 60+ yard throw capability",
    "Practice with different sized targets at various distances",
    "Work on throwing on the run and off-platform",
    "Study film to improve pre-snap reads",
    "Use resistance bands to strengthen throwing motion",
    "Develop touch passes for different routes"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
