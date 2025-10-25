import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateSettingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Setting accuracy, decision-making, hand technique, assist percentage
  const metrics = [
    { name: "Hand Technique", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Set Accuracy", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Decision Making", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Set Tempo", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Clean hand contact on sets", "Accurate set placement to targets", "Smart distribution decisions", "Good tempo control on sets"],
    improve: ["Work on setting from different positions", "Improve back set consistency", "Develop quicker decision-making", "Practice setting under pressure"]
  };
  
  const coachingTips = [
    "D1 METRIC: Maintain 10+ assists per set average",
    "Practice setting 500+ balls per week",
    "Develop all set types (high, quick, back, shoot)",
    "Work on footwork to ball for square shoulders",
    "Build hand and wrist strength",
    "Study hitter tendencies and preferences"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
