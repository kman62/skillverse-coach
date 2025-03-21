
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse, generateGenericAnalysis } from './analysisHelpers';

export const generateGolfAnalysis = (drillName: string, score: number): AnalysisResponse => {
  if (drillName.includes("Swing") || drillName.includes("Drive")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Setup",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Takeaway",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Downswing Path",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Impact Position",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Good posture at address",
        "Proper weight shift in swing",
        "Consistent swing plane"
      ],
      improve: [
        "Work on keeping your head still",
        "Focus on maintaining tempo throughout swing",
        "Try to improve your weight transfer timing"
      ]
    }, [
      "Practice with alignment sticks for swing path",
      "Use slow-motion video to analyze positions",
      "Work on balance drills for stability",
      "Practice swing drills without a ball"
    ]);
  } else if (drillName.includes("Putt")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Setup",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Stroke Path",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Face Angle",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Tempo",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Good alignment at setup",
        "Consistent stroke length",
        "Stable head position throughout stroke"
      ],
      improve: [
        "Work on keeping putter face square",
        "Focus on rhythm and tempo",
        "Try to maintain more consistent acceleration"
      ]
    }, [
      "Practice with a putting mirror",
      "Use gate drills for path training",
      "Work on distance control with varied length putts",
      "Practice one-handed putting for feel"
    ]);
  } else {
    return generateGenericAnalysis(drillName, score);
  }
};
