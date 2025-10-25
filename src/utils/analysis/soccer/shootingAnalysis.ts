import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateShootingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Approach & Setup", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Contact Technique", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Power Generation", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Accuracy", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Good approach angle and body positioning", "Clean contact on ball with proper technique", "Strong shot power and velocity", "Accurate placement in goal"],
    improve: ["Work on keeping shots lower and on frame", "Improve weak foot finishing ability", "Develop more variety (chip, volley, header)", "Practice shooting under defensive pressure"]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate consistent finishing from inside and outside box",
    "Practice shooting with both feet 100+ times per week",
    "Develop finishing from various angles and distances",
    "Work on one-touch finishing in game-like scenarios",
    "Build shooting power through technique and leg strength",
    "Study goalkeeper positioning and shot placement"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
