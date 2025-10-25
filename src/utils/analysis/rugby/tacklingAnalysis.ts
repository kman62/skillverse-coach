import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateRugbyTacklingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Tackle Technique", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Body Position", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Leg Drive", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Wrap & Hold", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Safe tackle technique with proper form", "Good body positioning and approach", "Strong leg drive through contact", "Secure wrap and hold on ball carrier"],
    improve: ["Get lower in tackle approach", "Improve shoulder placement consistency", "Work on tackling larger opponents", "Develop chop tackle for emergency situations"]
  };
  
  const coachingTips = [
    "D1 METRIC: Complete 85%+ of tackle attempts",
    "Practice tackle technique daily with proper progression",
    "Work on tackling from various angles",
    "Build neck and shoulder strength for safety",
    "Develop defensive positioning and reading",
    "Study World Rugby tackle guidelines"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
