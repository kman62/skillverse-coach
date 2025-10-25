import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateBlockingAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // D1 Recruiter Focus: Blocks per set, read blocking, footwork, timing
  const metrics = [
    { name: "Footwork", value: Math.floor(score * 0.9 + Math.random() * 10), target: 95, unit: "%" },
    { name: "Timing", value: Math.floor(score * 0.85 + Math.random() * 15), target: 90, unit: "%" },
    { name: "Hand Position", value: Math.floor(score * 0.95 + Math.random() * 5), target: 100, unit: "%" },
    { name: "Reading Hitter", value: Math.floor(score * 0.88 + Math.random() * 12), target: 95, unit: "%" }
  ];
  
  const feedback = {
    good: ["Quick lateral footwork along net", "Good timing on jump", "Strong hand positioning over net", "Effective reading of hitter approach"],
    improve: ["Work on closing block with partner", "Improve penetration over net", "Develop better transition off block", "Practice reading setter's hands"]
  };
  
  const coachingTips = [
    "D1 METRIC: Average 1+ blocks per set",
    "Practice blocking footwork patterns daily",
    "Work on double block timing with partners",
    "Develop read blocking vs commit blocking",
    "Build vertical jump and core strength",
    "Study opponent hitting tendencies"
  ];

  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
