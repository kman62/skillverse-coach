import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateScrummingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Binding Technique", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Body Position", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Leg Drive", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Core Stability", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Strong binding technique", "Good body angle and hip position", "Powerful leg drive through scrum", "Excellent core stability under pressure"],
    improve: ["Keep spine alignment neutral", "Work on timing of engagement", "Improve foot positioning for drive", "Develop sustained pressure technique"]
  };
  
  const coachingTips = [
    "D1 METRIC: Demonstrate technical proficiency and strength",
    "Practice scrummaging technique with scrum machine",
    "Build lower body and core strength",
    "Work on neck strengthening exercises",
    "Study proper scrum engagement sequence",
    "Develop communication within forward pack"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
