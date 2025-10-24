
import { AnalysisResponse } from './analysisTypes';
import { generatePitchingAnalysis } from './baseball/pitchingAnalysis';
import { generateBattingAnalysis } from './baseball/battingAnalysis';
import { generateFieldingAnalysis } from './baseball/fieldingAnalysis';
import { generateCatchingAnalysis } from './baseball/catchingAnalysis';
import { generateGenericBaseballAnalysis } from './baseball/genericBaseballAnalysis';

// Baseball-specific analysis
export const generateBaseballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const normalizedDrillName = drillName.toLowerCase();
  
  console.log(`⚾ Baseball Analysis processing drill: "${drillName}" (normalized: "${normalizedDrillName}")`);
  
  if (normalizedDrillName.includes("pitch") || normalizedDrillName.includes("throw")) {
    console.log(`⚾ Baseball Analysis routing to Pitching Analysis for "${drillName}"`);
    return generatePitchingAnalysis(drillName, score);
  } else if (normalizedDrillName.includes("bat") || normalizedDrillName.includes("hit") || normalizedDrillName.includes("swing")) {
    console.log(`⚾ Baseball Analysis routing to Batting Analysis for "${drillName}"`);
    return generateBattingAnalysis(drillName, score);
  } else if (normalizedDrillName.includes("field") || normalizedDrillName.includes("ground") || normalizedDrillName.includes("infield")) {
    console.log(`⚾ Baseball Analysis routing to Fielding Analysis for "${drillName}"`);
    return generateFieldingAnalysis(drillName, score);
  } else if (normalizedDrillName.includes("catch") || normalizedDrillName.includes("receiv") || normalizedDrillName.includes("block")) {
    console.log(`⚾ Baseball Analysis routing to Catching Analysis for "${drillName}"`);
    return generateCatchingAnalysis(drillName, score);
  } else {
    console.log(`⚾ Baseball Analysis using Generic Baseball Analysis for "${drillName}"`);
    return generateGenericBaseballAnalysis(drillName, score);
  }
};

// Re-export all analysis functions for potential direct use
export { generatePitchingAnalysis } from './baseball/pitchingAnalysis';
export { generateBattingAnalysis } from './baseball/battingAnalysis';
export { generateFieldingAnalysis } from './baseball/fieldingAnalysis';
export { generateCatchingAnalysis } from './baseball/catchingAnalysis';
export { generateGenericBaseballAnalysis } from './baseball/genericBaseballAnalysis';
