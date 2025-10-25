import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generatePassingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "First Touch", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Pass Accuracy", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Vision & Decision", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Weight of Pass", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Clean first touch setting up passes", "High accuracy on short and medium passes", "Good vision identifying passing lanes", "Appropriate weight and pace on passes"],
    improve: ["Work on longer range passing accuracy", "Improve weak foot passing consistency", "Develop quicker decision-making", "Practice through-balls with proper weight"]
  };
  
  const coachingTips = [
    "D1 METRIC: Maintain 85%+ pass completion rate in games",
    "Practice passing with both feet equally",
    "Work on various pass types (ground, lofted, driven)",
    "Develop vision with head-up dribbling",
    "Build core strength for longer passes",
    "Study professional midfielders' positioning"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
