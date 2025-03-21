
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse, generateGenericAnalysis } from './analysisHelpers';

export const generateSoccerAnalysis = (drillName: string, score: number): AnalysisResponse => {
  if (drillName.includes("Kick") || drillName.includes("Shot")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Approach",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Plant Foot",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Contact Point",
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
        "Good approach angle to ball",
        "Proper plant foot placement",
        "Clean contact with ball"
      ],
      improve: [
        "Work on consistent approach angle",
        "Focus on locking ankle at contact",
        "Try to follow through more directly toward target"
      ]
    }, [
      "Practice with a stationary ball first",
      "Use targets to improve accuracy",
      "Work on different shot techniques",
      "Practice from various angles and distances"
    ]);
  } else if (drillName.includes("Dribble")) {
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Ball Control",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Touch Weight",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Body Position",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Change of Direction",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ], {
      good: [
        "Good close control of the ball",
        "Proper body positioning to shield ball",
        "Effective use of both feet"
      ],
      improve: [
        "Work on using different surfaces of foot",
        "Focus on keeping head up while dribbling",
        "Try to vary speed more during changes of direction"
      ]
    }, [
      "Practice with cone drills for precision",
      "Use both feet equally during practice",
      "Work on changing pace during dribbling",
      "Incorporate defenders gradually"
    ]);
  } else {
    return generateGenericAnalysis(drillName, score);
  }
};
