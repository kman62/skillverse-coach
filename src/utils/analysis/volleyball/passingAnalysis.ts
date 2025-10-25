import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateVolleyballPassingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Passing efficiency (2.0+ rating), platform consistency, movement
  const metrics = [
    { name: "Platform Angle", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Footwork", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Pass Accuracy", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Reading Serve", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Solid platform angle and arm position", "Good footwork to ball", "Accurate passes to target", "Effective serve reading"],
    improve: ["Work on passing tough serves", "Improve movement to ball speed", "Develop better communication", "Practice passing from various court positions"]
  };
  
  const coachingTips = [
    "D1 METRIC: Achieve 2.0+ passing rating (3-point scale)",
    "Practice passing 200+ serves per week",
    "Work on movement patterns to ball",
    "Develop passing from all six rotations",
    "Build lower body strength for stability",
    "Study server tendencies and patterns"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
