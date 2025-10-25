
import { AnalysisResponse } from './analysisTypes';
import { generateQuarterbackAnalysis } from './football/quarterbackAnalysis';
import { generateReceiverAnalysis } from './football/receiverAnalysis';
import { generateRunningBackAnalysis } from './football/runningBackAnalysis';
import { generateLinemanAnalysis } from './football/linemanAnalysis';
import { generateDefensiveBackAnalysis } from './football/defensiveBackAnalysis';
import { generateLinebackerAnalysis } from './football/linebackerAnalysis';
import { generateGenericFootballAnalysis } from './football/genericFootballAnalysis';

export const generateFootballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("quarterback") || lowerDrill.includes("passing") || lowerDrill.includes("throwing")) {
    return generateQuarterbackAnalysis(drillName, score);
  } else if (lowerDrill.includes("receiver") || lowerDrill.includes("catching") || lowerDrill.includes("route")) {
    return generateReceiverAnalysis(drillName, score);
  } else if (lowerDrill.includes("running back") || lowerDrill.includes("rushing") || lowerDrill.includes("rb")) {
    return generateRunningBackAnalysis(drillName, score);
  } else if (lowerDrill.includes("lineman") || lowerDrill.includes("blocking") || lowerDrill.includes("o-line") || lowerDrill.includes("d-line")) {
    return generateLinemanAnalysis(drillName, score);
  } else if (lowerDrill.includes("defensive back") || lowerDrill.includes("coverage") || lowerDrill.includes("cornerback") || lowerDrill.includes("safety")) {
    return generateDefensiveBackAnalysis(drillName, score);
  } else if (lowerDrill.includes("linebacker") || lowerDrill.includes("lb")) {
    return generateLinebackerAnalysis(drillName, score);
  } else {
    return generateGenericFootballAnalysis(drillName, score);
  }
};
