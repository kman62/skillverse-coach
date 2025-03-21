
import { AnalysisResponse } from './analysis/analysisTypes';
import { generateGenericAnalysis } from './analysis/analysisHelpers';
import { generateBasketballAnalysis } from './analysis/basketballAnalysis';
import { generateBaseballAnalysis } from './analysis/baseballAnalysis';
import { generateFootballAnalysis } from './analysis/footballAnalysis';
import { generateTennisAnalysis } from './analysis/tennisAnalysis';
import { generateGolfAnalysis } from './analysis/golfAnalysis';
import { generateSoccerAnalysis } from './analysis/soccerAnalysis';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const AI_API_URL = "https://api.aithlete.ai/analyze"; // Replace with your actual API endpoint
const AI_API_KEY = "YOUR_API_KEY"; // In production, get this from environment variables or Supabase
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export type { AnalysisResult, BehaviorAnalysis, AnalysisResponse } from './analysis/analysisTypes';

export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string
): Promise<AnalysisResponse> => {
  // Check file size before attempting to upload
  if (videoFile.size > MAX_FILE_SIZE) {
    throw new Error(`Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`);
  }
  
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

// Save analysis result to Supabase
export const saveAnalysisResult = async (
  videoFile: File,
  sportId: string,
  drillId: string,
  analysisResult: any,
  behaviorAnalysis: any
) => {
  try {
    // Check file size before attempting to upload
    if (videoFile.size > MAX_FILE_SIZE) {
      throw new Error(`Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`);
    }
    
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
    // 1. Upload video to Supabase Storage
    const videoFileName = `${userId}/${uuidv4()}-${videoFile.name}`;
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoFile);
      
    if (uploadError) {
      if (uploadError.message.includes('exceeded the maximum allowed size')) {
        throw new Error('Video file size exceeds the Supabase storage limit of 50MB.');
      }
      throw new Error(`Error uploading video: ${uploadError.message}`);
    }
    
    // Get public URL for the uploaded video
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName);
    
    // 2. Insert video metadata
    const { error: videoError, data: videoData } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        sport_id: sportId,
        drill_id: drillId,
        title: `${drillId} Analysis`,
        video_url: publicUrl
      })
      .select()
      .single();
      
    if (videoError) {
      throw new Error(`Error saving video metadata: ${videoError.message}`);
    }
    
    // 3. Insert analysis results
    const score = analysisResult?.overallScore || 
                 (analysisResult?.scores?.reduce((acc: number, curr: any) => acc + curr.score, 0) / 
                  (analysisResult?.scores?.length || 1));
                  
    const { error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: userId,
        video_id: videoData.id,
        sport_id: sportId,
        drill_id: drillId,
        analysis_data: analysisResult,
        behavior_data: behaviorAnalysis,
        score: Math.round(score)
      });
      
    if (analysisError) {
      throw new Error(`Error saving analysis results: ${analysisError.message}`);
    }
    
    // 4. Update user progress
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        sport_id: sportId,
        drill_id: drillId,
        date: today,
        score: Math.round(score),
        metrics: {
          technicalScore: analysisResult?.technicalScore || 0,
          consistencyScore: analysisResult?.consistencyScore || 0,
          behaviorScore: behaviorAnalysis?.overallScore || 0
        }
      });
      
    if (progressError) {
      throw new Error(`Error saving user progress: ${progressError.message}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving analysis data:', error);
    throw error;
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
