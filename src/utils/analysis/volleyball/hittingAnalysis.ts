import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateHittingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Kill percentage, approach mechanics, arm swing speed
  const metrics = [
    { name: "Approach Mechanics", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Arm Swing", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Contact Point", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Shot Placement", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Strong approach timing and footwork", "Good arm swing mechanics and speed", "Consistent contact point at peak", "Effective shot placement variety"],
    improve: ["Work on faster arm swing speed", "Improve approach angle consistency", "Develop more shot variation (tips, rolls)", "Practice hitting different sets (high, quick, back)"]
  };
  
  const coachingTips = [
    "D1 METRIC: Achieve 35%+ kill percentage in games",
    "Practice approach footwork 100+ times daily",
    "Develop hitting against live blocking",
    "Work on arm care and shoulder strengthening",
    "Build vertical jump for higher contact point",
    "Study opponent blocking tendencies"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
