import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericVolleyballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    { name: "Technical Skills", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Court Awareness", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Athleticism", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Volleyball IQ", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ], {
    good: ["Strong volleyball fundamentals", "Good court awareness and positioning", "Athletic movement and agility"],
    improve: ["Continue developing position-specific skills", "Work on volleyball-specific conditioning", "Improve tactical decision-making"]
  }, [
    "D1 METRIC: Compete at high club level (AAU, USAV Nationals)",
    "Develop all-around volleyball skills",
    "Build volleyball-specific strength and vertical jump",
    "Study the game to improve volleyball IQ"
  ]);
};
