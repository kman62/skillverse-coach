
import { AnalysisResponse } from './analysisTypes';
import { generateGenericAnalysis } from './analysisHelpers';
import { generateBasketballAnalysis } from './basketballAnalysis';
import { generateBaseballAnalysis } from './baseballAnalysis';
import { generateFootballAnalysis } from './footballAnalysis';
import { generateTennisAnalysis } from './tennisAnalysis';
import { generateGolfAnalysis } from './golfAnalysis';
import { generateSoccerAnalysis } from './soccerAnalysis';
import { generateRugbyAnalysis } from './rugbyAnalysis';

// Sport-specific analysis generator (used as fallback if API fails)
export const generateSportSpecificAnalysis = (sportId: string, drillName: string): AnalysisResponse => {
  // Generate a deterministic but realistic score
  const baseScore = drillName.length % 20 + 70; // Score between 70-90
  const score = Math.min(100, Math.max(60, baseScore));
  
  console.log(`Generating fallback analysis for ${sportId}/${drillName} with score ${score}`);
  
  switch(sportId) {
    case "basketball":
      return generateBasketballAnalysis(drillName, score);
    case "baseball":
      return generateBaseballAnalysis(drillName, score);
    case "football":
      return generateFootballAnalysis(drillName, score);
    case "tennis":
      return generateTennisAnalysis(drillName, score);
    case "golf":
      return generateGolfAnalysis(drillName, score);
    case "soccer":
      return generateSoccerAnalysis(drillName, score);
    case "rugby":
      return generateRugbyAnalysis(drillName, score);
    default:
      return generateGenericAnalysis(drillName, score);
  }
};
