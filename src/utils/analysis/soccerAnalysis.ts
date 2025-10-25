import { AnalysisResponse } from './analysisTypes';
import { generateShootingAnalysis } from './soccer/shootingAnalysis';
import { generatePassingAnalysis } from './soccer/passingAnalysis';
import { generateDribblingAnalysis } from './soccer/dribblingAnalysis';
import { generateDefendingAnalysis } from './soccer/defendingAnalysis';
import { generateGoalkeeperAnalysis } from './soccer/goalkeeperAnalysis';
import { generateGenericSoccerAnalysis } from './soccer/genericSoccerAnalysis';

export const generateSoccerAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const lowerDrill = drillName.toLowerCase();
  
  if (lowerDrill.includes("shoot") || lowerDrill.includes("finishing") || lowerDrill.includes("striking")) {
    return generateShootingAnalysis(drillName, score);
  } else if (lowerDrill.includes("pass") || lowerDrill.includes("distribution")) {
    return generatePassingAnalysis(drillName, score);
  } else if (lowerDrill.includes("dribbl") || lowerDrill.includes("ball control") || lowerDrill.includes("1v1")) {
    return generateDribblingAnalysis(drillName, score);
  } else if (lowerDrill.includes("defend") || lowerDrill.includes("tackling") || lowerDrill.includes("marking")) {
    return generateDefendingAnalysis(drillName, score);
  } else if (lowerDrill.includes("goalkeeper") || lowerDrill.includes("goalie") || lowerDrill.includes("keeper") || lowerDrill.includes("gk")) {
    return generateGoalkeeperAnalysis(drillName, score);
  } else {
    return generateGenericSoccerAnalysis(drillName, score);
  }
};
