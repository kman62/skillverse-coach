
import { AnalysisResponse } from './analysisTypes';

// Helper function to build the complete analysis response
export const buildAnalysisResponse = (
  drillName: string,
  score: number,
  metrics: any[],
  feedback: { good: string[]; improve: string[] },
  coachingTips: string[]
): AnalysisResponse => {
  return {
    result: {
      title: `${drillName} Analysis`,
      description: "AI-powered technique assessment",
      score,
      metrics,
      feedback,
      coachingTips
    },
    behavior: {
      consistency: [
        {
          name: "Movement Pattern",
          description: `Your ${drillName.toLowerCase()} movement pattern is consistent across repetitions.`,
          quality: score > 75 ? "good" : "needs-improvement",
          icon: null
        },
        {
          name: "Position Stability",
          description: `Your starting position for ${drillName.toLowerCase()} shows good stability.`,
          quality: score > 70 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      preRoutine: [
        {
          name: "Mental Preparation",
          description: "Good focus before beginning the movement.",
          quality: "good",
          icon: null
        },
        {
          name: "Position Setup",
          description: `Your setup position for ${drillName.toLowerCase()} could be more consistent.`,
          quality: score > 85 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      habits: [
        {
          name: "Recovery Position",
          description: "You return to proper position between attempts.",
          quality: score > 80 ? "good" : "needs-improvement",
          icon: null
        },
        {
          name: "Body Alignment",
          description: `Maintain better alignment during ${drillName.toLowerCase()}.`,
          quality: score > 75 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      timing: {
        average: `${(1.5 + Math.random() * 0.8).toFixed(1)} seconds`,
        consistency: Math.floor(score * 0.9),
        isRushing: score < 75,
        attempts: Array(5).fill(0).map((_, i) => ({
          attemptNumber: i + 1,
          duration: `${(1.3 + Math.random() * 1).toFixed(1)} seconds`
        }))
      },
      fatigue: {
        level: score > 85 ? "low" : score > 70 ? "moderate" : "high",
        signs: [
          "Slight decrease in form quality in later attempts",
          "Minor variations in technique consistency",
          "Small reduction in power output over time"
        ],
        recommendations: [
          "Focus on maintaining proper technique even when tired",
          "Consider shorter, more frequent practice sessions",
          "Incorporate more specific conditioning for this movement"
        ]
      }
    }
  };
};

// Generic analysis for unsupported sports or drills
export const generateGenericAnalysis = (drillName: string, score: number): AnalysisResponse => {
  const metrics = [
    {
      name: "Form Quality",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Movement Efficiency",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Balance",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Technique Accuracy",
      value: Math.floor(score * 0.8 + Math.random() * 20),
      target: 95,
      unit: "%"
    }
  ];
  
  const feedback = {
    good: [
      `Your ${drillName.toLowerCase()} stance is stable and balanced`,
      `Good follow-through on your ${drillName.toLowerCase()} execution`,
      `Consistent rhythm throughout the movement`
    ],
    improve: [
      `Work on maintaining proper form during the entire ${drillName.toLowerCase()} motion`,
      `Focus on engaging core muscles more during the movement`,
      `Try to maintain a more consistent pace throughout the exercise`
    ]
  };
  
  const coachingTips = [
    `Practice ${drillName.toLowerCase()} movements slowly at first to perfect form`,
    `Film yourself from multiple angles to identify form issues`,
    `Focus on controlled movements rather than speed during practice`,
    `Try breaking down the ${drillName.toLowerCase()} into component parts to master each segment`
  ];
  
  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
