
import { AnalysisResponse } from './analysisTypes';
import { generateFreeThrowAnalysis } from './basketball/freeThrowAnalysis';
import { generateJumpShotAnalysis } from './basketball/jumpShotAnalysis';
import { generateCrossoverAnalysis } from './basketball/crossoverAnalysis';
import { generateGenericBasketballAnalysis } from './basketball/genericBasketballAnalysis';

// Basketball-specific analysis
export const generateBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // Normalize the drill name for improved matching
  const normalizedDrillName = drillName.toLowerCase();
  
  console.log(`🏀 Basketball Analysis processing drill: "${drillName}" (normalized: "${normalizedDrillName}")`);
  
  // Free Throw detection - explicitly check for the drill ID pattern and common variations
  if (normalizedDrillName.includes("free-throw") || 
      normalizedDrillName.includes("free throw") || 
      normalizedDrillName.includes("freethrow") ||
      normalizedDrillName === "free-throw-front" ||
      normalizedDrillName === "free-throw-side") {
    console.log(`🏀 Basketball Analysis routing to Free Throw Analysis for "${drillName}"`);
    return generateFreeThrowAnalysis(drillName, score);
  }
  
  // Determine drill-specific metrics and feedback for other basketball drills
  if (normalizedDrillName.includes("jump shot")) {
    console.log(`🏀 Basketball Analysis routing to Jump Shot Analysis for "${drillName}"`);
    return generateJumpShotAnalysis(drillName, score);
  } else if (normalizedDrillName.includes("crossover")) {
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
