import { AnalysisResponse } from './analysisTypes';
import { generateRugbyPassingAnalysis } from './rugby/passingAnalysis';
import { generateRugbyTacklingAnalysis } from './rugby/tacklingAnalysis';
import { generateRugbyKickingAnalysis } from './rugby/kickingAnalysis';
import { generateScrummingAnalysis } from './rugby/scrummingAnalysis';
import { generateGenericRugbyAnalysis } from './rugby/genericRugbyAnalysis';

export const generateRugbyAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("pass") || lowerDrill.includes("distribution")) {
    return generateRugbyPassingAnalysis(drillName, score);
  } else if (lowerDrill.includes("tackl") || lowerDrill.includes("defense") || lowerDrill.includes("contact")) {
    return generateRugbyTacklingAnalysis(drillName, score);
  } else if (lowerDrill.includes("kick") || lowerDrill.includes("punt") || lowerDrill.includes("drop goal")) {
    return generateRugbyKickingAnalysis(drillName, score);
  } else if (lowerDrill.includes("scrum") || lowerDrill.includes("forward pack")) {
    return generateScrummingAnalysis(drillName, score);
  } else {
    return generateGenericRugbyAnalysis(drillName, score);
  }
};
