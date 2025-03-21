
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse, generateGenericAnalysis } from './analysisHelpers';

export const generateTennisAnalysis = (drillName: string, score: number): AnalysisResponse => {
  if (drillName.includes("Serve")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Ball Toss",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Racket Path",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Body Rotation",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Follow Through",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Consistent ball toss position",
        "Good knee bend for power generation",
        "Proper racket path through contact"
      ],
      improve: [
        "Work on keeping your toss more consistent",
        "Focus on full extension at contact point",
        "Try to engage your core more for added power"
      ]
    }, [
      "Practice toss-only drills for consistency",
      "Use shadow serving for movement patterns",
      "Work on different serve placements daily",
      "Record your serve from different angles"
    ]);
  } else if (drillName.includes("Forehand")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Preparation",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Contact Point",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Weight Transfer",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Follow Through",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Good racket preparation",
        "Proper contact point relative to body",
        "Smooth weight transfer through shot"
      ],
      improve: [
        "Work on earlier preparation",
        "Focus on maintaining proper distance from ball",
        "Try to follow through more completely"
      ]
    }, [
      "Practice shadow swings focusing on technique",
      "Use a ball on a string to work on contact point",
      "Work on taking the racket back earlier",
      "Practice forehand volleys to improve hands"
    ]);
  } else {
    return generateGenericAnalysis(drillName, score);
  }
};
