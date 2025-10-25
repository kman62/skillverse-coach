import { AnalysisResponse } from './analysisTypes';
import { generateDriverAnalysis } from './golf/driverAnalysis';
import { generateIronAnalysis } from './golf/ironAnalysis';
import { generateShortGameAnalysis } from './golf/shortGameAnalysis';
import { generatePuttingAnalysis } from './golf/puttingAnalysis';
import { generateGenericGolfAnalysis } from './golf/genericGolfAnalysis';

export const generateGolfAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("driver") || lowerDrill.includes("driving") || lowerDrill.includes("tee shot")) {
    return generateDriverAnalysis(drillName, score);
  } else if (lowerDrill.includes("iron") || lowerDrill.includes("approach")) {
    return generateIronAnalysis(drillName, score);
  } else if (lowerDrill.includes("chip") || lowerDrill.includes("pitch") || lowerDrill.includes("wedge") || lowerDrill.includes("bunker") || lowerDrill.includes("short game")) {
    return generateShortGameAnalysis(drillName, score);
  } else if (lowerDrill.includes("putt") || lowerDrill.includes("putting")) {
    return generatePuttingAnalysis(drillName, score);
  } else {
    return generateGenericGolfAnalysis(drillName, score);
  }
};
