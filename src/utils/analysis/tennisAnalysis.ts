import { AnalysisResponse } from './analysisTypes';
import { generateServeAnalysis } from './tennis/serveAnalysis';
import { generateForehandAnalysis } from './tennis/forehandAnalysis';
import { generateBackhandAnalysis } from './tennis/backhandAnalysis';
import { generateVolleyAnalysis } from './tennis/volleyAnalysis';
import { generateGenericTennisAnalysis } from './tennis/genericTennisAnalysis';

export const generateTennisAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("serve") || lowerDrill.includes("serving")) {
    return generateServeAnalysis(drillName, score);
  } else if (lowerDrill.includes("forehand")) {
    return generateForehandAnalysis(drillName, score);
  } else if (lowerDrill.includes("backhand")) {
    return generateBackhandAnalysis(drillName, score);
  } else if (lowerDrill.includes("volley") || lowerDrill.includes("net play")) {
    return generateVolleyAnalysis(drillName, score);
  } else {
    return generateGenericTennisAnalysis(drillName, score);
  }
};
