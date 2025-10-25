import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateServingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Serve velocity, accuracy, aces, serving errors
  const metrics = [
    { name: "Toss Consistency", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Contact Mechanics", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Serve Velocity", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Placement", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Consistent toss placement", "Strong contact mechanics", "Good serve velocity and power", "Effective placement targeting"],
    improve: ["Work on serve variety (float, topspin, jump)", "Improve serving under pressure", "Develop seam serving accuracy", "Practice serving specific zones"]
  };
  
  const coachingTips = [
    "D1 METRIC: 90%+ serve accuracy with 1+ aces per set",
    "Practice serving 100+ serves daily",
    "Develop multiple serve types",
    "Work on jump serve for power",
    "Build shoulder strength and flexibility",
    "Study opponent passing formations"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
