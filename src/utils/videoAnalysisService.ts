
import { AnalysisResponse } from './analysis/analysisTypes';
import { generateGenericAnalysis } from './analysis/analysisHelpers';
import { generateBasketballAnalysis } from './analysis/basketballAnalysis';
import { generateBaseballAnalysis } from './analysis/baseballAnalysis';
import { generateFootballAnalysis } from './analysis/footballAnalysis';
import { generateTennisAnalysis } from './analysis/tennisAnalysis';
import { generateGolfAnalysis } from './analysis/golfAnalysis';
import { generateSoccerAnalysis } from './analysis/soccerAnalysis';
import { useToast } from '@/components/ui/use-toast';

const AI_API_URL = "https://api.aithlete.ai/analyze"; // Replace with your actual API endpoint
const AI_API_KEY = "YOUR_API_KEY"; // In production, get this from environment variables or Supabase

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
    // First try to call the real AI API
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        // Don't include Content-Type here, it will be set automatically for FormData
      },
      body: formData,
      // Add a reasonable timeout
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as AnalysisResponse;
  } catch (error) {
    console.warn("AI API connection failed, falling back to mock data:", error);
    
    // For development/demo purposes, fallback to mock data if API call fails
    // In production, you might want to show a meaningful error message instead
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call time
    
    // Generate fallback analysis data based on drill name and sport
    return generateSportSpecificAnalysis(sportId, drillName);
  }
};

// Sport-specific analysis generator (used as fallback if API fails)
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
