
import { AnalysisResponse } from './analysisTypes';
import { generateFreeThrowAnalysis } from './basketball/freeThrowAnalysis';
import { generateJumpShotAnalysis } from './basketball/jumpShotAnalysis';
import { generateCrossoverAnalysis } from './basketball/crossoverAnalysis';
import { generateGenericBasketballAnalysis } from './basketball/genericBasketballAnalysis';

// Basketball-specific analysis
export const generateBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // Determine if this is a free throw analysis
  if (drillName.toLowerCase().includes("free throw")) {
    console.log(`🏀 Basketball Analysis routing to Free Throw Analysis for "${drillName}"`);
    return generateFreeThrowAnalysis(drillName, score);
  }
  
  // Determine drill-specific metrics and feedback for other basketball drills
  if (drillName.includes("Jump Shot")) {
    console.log(`🏀 Basketball Analysis routing to Jump Shot Analysis for "${drillName}"`);
    return generateJumpShotAnalysis(drillName, score);
  } else if (drillName.includes("Crossover")) {
    console.log(`🏀 Basketball Analysis routing to Crossover Analysis for "${drillName}"`);
    return generateCrossoverAnalysis(drillName, score);
  } else {
    console.log(`🏀 Basketball Analysis using Generic Basketball Analysis for "${drillName}"`);
    // Generic basketball metrics if drill doesn't match specific patterns
    return generateGenericBasketballAnalysis(drillName, score);
  }
};

// Re-export all analysis functions for potential direct use
export { generateFreeThrowAnalysis } from './basketball/freeThrowAnalysis';
export { generateJumpShotAnalysis } from './basketball/jumpShotAnalysis';
export { generateCrossoverAnalysis } from './basketball/crossoverAnalysis';
export { generateGenericBasketballAnalysis } from './basketball/genericBasketballAnalysis';
