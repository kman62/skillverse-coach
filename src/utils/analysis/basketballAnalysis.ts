
import { AnalysisResponse } from './analysisTypes';
import { generateFreeThrowAnalysis } from './basketball/freeThrowAnalysis';
import { generateJumpShotAnalysis } from './basketball/jumpShotAnalysis';
import { generateCrossoverAnalysis } from './basketball/crossoverAnalysis';
import { generateGenericBasketballAnalysis } from './basketball/genericBasketballAnalysis';

// Basketball-specific analysis
export const generateBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // Determine if this is a free throw analysis
  if (drillName.toLowerCase().includes("free throw")) {
    return generateFreeThrowAnalysis(drillName, score);
  }
  
  // Determine drill-specific metrics and feedback for other basketball drills
  if (drillName.includes("Jump Shot")) {
    return generateJumpShotAnalysis(drillName, score);
  } else if (drillName.includes("Crossover")) {
    return generateCrossoverAnalysis(drillName, score);
  } else {
    // Generic basketball metrics if drill doesn't match specific patterns
    return generateGenericBasketballAnalysis(drillName, score);
  }
};

// Re-export all analysis functions for potential direct use
export { generateFreeThrowAnalysis } from './basketball/freeThrowAnalysis';
export { generateJumpShotAnalysis } from './basketball/jumpShotAnalysis';
export { generateCrossoverAnalysis } from './basketball/crossoverAnalysis';
export { generateGenericBasketballAnalysis } from './basketball/genericBasketballAnalysis';
