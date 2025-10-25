import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGoalkeeperAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Positioning", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Shot Stopping", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Distribution", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Command of Box", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Excellent positioning and angles", "Strong shot-stopping technique", "Accurate distribution to start attacks", "Confident commanding the penalty area"],
    improve: ["Work on footwork to improve positioning", "Develop diving technique on low shots", "Improve distribution range and accuracy", "Be more vocal organizing defense"]
  };
  
  const coachingTips = [
    "D1 METRIC: Maintain save percentage above 75%",
    "Practice shot-stopping drills 200+ saves per week",
    "Develop both hands and feet distribution skills",
    "Work on cross-claiming and 1v1 situations",
    "Build explosiveness for diving saves",
    "Study professional goalkeepers' positioning"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
