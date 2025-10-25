import { AnalysisResponse } from './analysisTypes';
import { generateHittingAnalysis } from './volleyball/hittingAnalysis';
import { generateSettingAnalysis } from './volleyball/settingAnalysis';
import { generateServingAnalysis } from './volleyball/servingAnalysis';
import { generateVolleyballPassingAnalysis } from './volleyball/passingAnalysis';
import { generateBlockingAnalysis } from './volleyball/blockingAnalysis';
import { generateDiggingAnalysis } from './volleyball/diggingAnalysis';
import { generateGenericVolleyballAnalysis } from './volleyball/genericVolleyballAnalysis';

export const generateVolleyballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("hit") || lowerDrill.includes("spike") || lowerDrill.includes("attack")) {
    return generateHittingAnalysis(drillName, score);
  } else if (lowerDrill.includes("set") || lowerDrill.includes("setter")) {
    return generateSettingAnalysis(drillName, score);
  } else if (lowerDrill.includes("serv")) {
    return generateServingAnalysis(drillName, score);
  } else if (lowerDrill.includes("pass") || lowerDrill.includes("receive") || lowerDrill.includes("bump")) {
    return generateVolleyballPassingAnalysis(drillName, score);
  } else if (lowerDrill.includes("block")) {
    return generateBlockingAnalysis(drillName, score);
  } else if (lowerDrill.includes("dig") || lowerDrill.includes("defense")) {
    return generateDiggingAnalysis(drillName, score);
  } else {
    return generateGenericVolleyballAnalysis(drillName, score);
  }
};
