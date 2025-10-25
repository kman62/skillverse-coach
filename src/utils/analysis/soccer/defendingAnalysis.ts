import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateDefendingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    { name: "Positioning", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Tackling Timing", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Body Position", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Recovery Speed", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Strong defensive positioning", "Good timing on tackles", "Proper body shape forcing attackers wide", "Quick recovery when beaten"],
    improve: ["Stay on your feet longer in 1v1s", "Improve reading of attacker's intentions", "Work on transition from attack to defense", "Develop better communication with teammates"]
  };
  
  const coachingTips = [
    "D1 METRIC: Win 70%+ of defensive duels",
    "Practice 1v1 defending scenarios daily",
    "Work on jockeying technique without diving in",
    "Develop anticipation through film study",
    "Build acceleration for recovery runs",
    "Study top defenders' positioning and angles"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
