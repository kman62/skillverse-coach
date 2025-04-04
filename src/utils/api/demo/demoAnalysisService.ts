
import { generateSportSpecificAnalysis } from '../../analysis/analysisSelector';
import { dispatchAnalysisEvent } from '../logging/analysisLogger';
import { AnalysisResponse } from '../../analysis/analysisTypes';

/**
 * Generates demo analysis data when API is unavailable or demo mode is explicitly requested
 */
export const generateDemoAnalysis = async (
  sportId: string, 
  drillName: string
): Promise<AnalysisResponse> => {
  dispatchAnalysisEvent('using-demo-data');
  
  // Set global flag for demo mode
  window.usedFallbackData = true;
  
  // Simulate a brief delay to make the demo feel more realistic
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`Generating demo analysis data for ${sportId}/${drillName}`);
  const mockData = generateSportSpecificAnalysis(sportId, drillName);
  dispatchAnalysisEvent('demo-data-generated');
  
  return mockData;
};
