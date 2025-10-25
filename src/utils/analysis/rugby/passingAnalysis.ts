import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateRugbyPassingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Passing Accuracy", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Timing", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Pass Distance", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Support Running", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Accurate passes to target", "Good timing releasing the ball", "Sufficient pass distance and velocity", "Strong support running angles"],
    improve: ["Work on passing off both sides equally", "Improve passing under defensive pressure", "Develop longer skip passes", "Practice draw-and-pass timing"]
  };
  
  const coachingTips = [
    "D1 METRIC: Maintain 90%+ pass completion in games",
    "Practice passing drills 200+ reps per week",
    "Develop both spin and pop passes",
    "Work on passing accuracy while running at speed",
    "Build core rotational strength",
    "Study professional backs' passing technique"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
