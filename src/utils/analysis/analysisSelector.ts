
import { AnalysisResponse } from './analysisTypes';
import { generateGenericAnalysis } from './analysisHelpers';
import { generateBasketballAnalysis } from './basketballAnalysis';
import { generateBaseballAnalysis } from './baseballAnalysis';
import { generateFootballAnalysis } from './footballAnalysis';
import { generateTennisAnalysis } from './tennisAnalysis';
import { generateGolfAnalysis } from './golfAnalysis';
import { generateSoccerAnalysis } from './soccerAnalysis';
import { generateRugbyAnalysis } from './rugbyAnalysis';
import { generateVolleyballAnalysis } from './volleyballAnalysis';

/**
 * Generates sport-specific analysis for a drill based on the sport ID.
 * This function serves as a selector/router to the appropriate sport analysis module.
 * 
 * @param sportId - The identifier for the sport (e.g. "basketball", "football")
 * @param drillName - The name of the drill being analyzed
 * @returns An AnalysisResponse with sport and drill-specific metrics
 */
export const generateSportSpecificAnalysis = (sportId: string, drillName: string): AnalysisResponse => {
  // Generate a deterministic but realistic score
  const baseScore = drillName.length % 20 + 70; // Score between 70-90
  const score = Math.min(100, Math.max(60, baseScore));
  
  console.log(`Generating fallback analysis for ${sportId}/${drillName} with score ${score}`);
  
  // Route to the correct sport-specific analysis generator
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
    case "volleyball":
      return generateVolleyballAnalysis(drillName, score);
    default:
      return generateGenericAnalysis(drillName, score);
  }
};
