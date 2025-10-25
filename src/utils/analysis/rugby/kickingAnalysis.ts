import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateRugbyKickingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Kicking Technique", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Accuracy", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Distance", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Kick Selection", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Solid kicking technique and form", "Good accuracy to target areas", "Sufficient distance on punts", "Smart tactical kick selection"],
    improve: ["Work on grubber kick accuracy", "Improve spiral on long kicks", "Develop both feet for kicking", "Practice kicks under pressure"]
  };
  
  const coachingTips = [
    "D1 METRIC: 75%+ goal kicking success rate",
    "Practice various kick types daily (punt, drop, grubber)",
    "Work on kick accuracy to corner and touch",
    "Develop pressure kicking routine",
    "Build leg strength and flexibility",
    "Study professional kickers' techniques"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
