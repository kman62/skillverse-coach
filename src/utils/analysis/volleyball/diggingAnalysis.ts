import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateDiggingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Digs per set, defensive range, anticipation
  const metrics = [
    { name: "Court Position", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Reaction Time", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Platform Control", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Pursuit", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Good defensive court positioning", "Quick reaction to attacks", "Controlled platform on digs", "Relentless ball pursuit"],
    improve: ["Work on reading hitter's shoulder", "Improve lateral range", "Develop emergency digging techniques", "Practice transition from defense to offense"]
  };
  
  const coachingTips = [
    "D1 METRIC: Average 3+ digs per set",
    "Practice defensive drills 200+ contacts per week",
    "Work on reading attacker approach and arm",
    "Develop court awareness and communication",
    "Build lateral agility and reaction speed",
    "Study opponent hitting patterns and shots"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
