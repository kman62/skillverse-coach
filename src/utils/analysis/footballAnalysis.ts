
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse, generateGenericAnalysis } from './analysisHelpers';

export const generateFootballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  if (drillName.includes("Passing")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Throwing Mechanics",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Footwork",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Release Point",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Accuracy",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Good throwing motion and follow-through",
        "Proper weight transfer during throw",
        "Consistent release point"
      ],
      improve: [
        "Work on keeping your elbow at proper height",
        "Focus on stepping toward your target",
        "Try to get more rotation in your hips"
      ]
    }, [
      "Practice with different sized targets",
      "Work on throwing on the run",
      "Focus on consistent mechanics under pressure",
      "Use resistance bands to strengthen your throwing motion"
    ]);
  } else {
    return generateGenericAnalysis(drillName, score);
  }
};
