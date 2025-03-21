
import { AnalysisResponse } from './analysis/analysisTypes';
import { generateGenericAnalysis } from './analysis/analysisHelpers';
import { generateBasketballAnalysis } from './analysis/basketballAnalysis';
import { generateBaseballAnalysis } from './analysis/baseballAnalysis';
import { generateFootballAnalysis } from './analysis/footballAnalysis';
import { generateTennisAnalysis } from './analysis/tennisAnalysis';
import { generateGolfAnalysis } from './analysis/golfAnalysis';
import { generateSoccerAnalysis } from './analysis/soccerAnalysis';

const AI_API_URL = "https://api.aithlete.ai/analyze"; // Replace with your actual API endpoint

export type { AnalysisResult, BehaviorAnalysis, AnalysisResponse } from './analysis/analysisTypes';

export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string
): Promise<AnalysisResponse> => {
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);
  formData.append("sportId", sportId);

  try {
    // For development/demo purposes, we'll use a timeout to simulate API call
    // In production, this would be replaced with an actual fetch call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate more realistic analysis data based on drill name and sport
    return generateSportSpecificAnalysis(sportId, drillName);
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};

// Sport-specific analysis generator
const generateSportSpecificAnalysis = (sportId: string, drillName: string): AnalysisResponse => {
  // Generate a deterministic but realistic score
  const baseScore = drillName.length % 20 + 70; // Score between 70-90
  const score = Math.min(100, Math.max(60, baseScore));
  
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
    default:
      return generateGenericAnalysis(drillName, score);
  }
};
