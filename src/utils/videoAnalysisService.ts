
import { useToast } from "@/components/ui/use-toast";

// Interface for analysis result
export interface AnalysisResult {
  title: string;
  description: string;
  score: number;
  metrics: {
    name: string;
    value: number;
    target: number;
    unit: string;
  }[];
  feedback: {
    good: string[];
    improve: string[];
  };
  coachingTips: string[];
}

// Interface for behavior analysis
export interface BehaviorAnalysis {
  consistency: {
    name: string;
    description: string;
    quality: 'good' | 'needs-improvement';
    icon: React.ReactNode;
  }[];
  preRoutine: {
    name: string;
    description: string;
    quality: 'good' | 'needs-improvement';
    icon: React.ReactNode;
  }[];
  habits: {
    name: string;
    description: string;
    quality: 'good' | 'needs-improvement';
    icon: React.ReactNode;
  }[];
  timing: {
    average: string;
    consistency: number;
    isRushing: boolean;
    attempts: {
      attemptNumber: number;
      duration: string;
    }[];
  };
  fatigue: {
    level: 'low' | 'moderate' | 'high';
    signs: string[];
    recommendations: string[];
  };
}

export interface AnalysisResponse {
  result: AnalysisResult;
  behavior: BehaviorAnalysis;
}

const AI_API_URL = "https://api.aithlete.ai/analyze"; // Replace with your actual API endpoint

export const analyzeVideo = async (
  videoFile: File,
  drillName: string,
  sportId: string
): Promise<AnalysisResponse> => {
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);
  formData.append("sportId", sportId);

  try {
    // For development/demo purposes, we'll use a timeout to simulate API call
    // In production, this would be replaced with an actual fetch call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate more realistic analysis data based on drill name and sport
    return generateSportSpecificAnalysis(sportId, drillName);
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};

// Sport-specific analysis generator
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

// Basketball-specific analysis
const generateBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  // Determine drill-specific metrics and feedback
  let metrics = [];
  let feedback = { good: [], improve: [] };
  let coachingTips = [];
  
  if (drillName.includes("Free Throw")) {
    metrics = [
      {
        name: "Elbow Alignment",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Follow Through",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Knee Bend",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Release Consistency",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good alignment of elbow with basket",
        "Consistent pre-shot routine",
        "Proper balance during the shot"
      ],
      improve: [
        "Focus on keeping your follow-through steady for longer",
        "Try to maintain consistent knee bend across attempts",
        "Keep your shooting hand more relaxed"
      ]
    };
    
    coachingTips = [
      "Practice 'one-hand' shooting drills to improve your release",
      "Use the 'BEEF' method: Balance, Eyes, Elbow, Follow-through",
      "Try to maintain the same routine before each shot for consistency",
      "Focus on your breathing pattern during your routine"
    ];
  } else if (drillName.includes("Jump Shot")) {
    metrics = [
      {
        name: "Vertical Alignment",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Release Timing",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Landing Balance",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Shot Arc",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good lift on your jump",
        "Shot release at peak of jump",
        "Consistent shooting motion"
      ],
      improve: [
        "Work on landing in the same spot you jumped from",
        "Try to achieve a higher arc on your shot",
        "Keep your non-shooting hand more stable"
      ]
    };
    
    coachingTips = [
      "Practice shooting with a chair under the basket to force a higher arc",
      "Use the 'hop' technique for better balance on catch-and-shoot",
      "Film yourself from the side to analyze your shot arc",
      "Practice shooting after fatigue to build consistency"
    ];
  } else if (drillName.includes("Crossover")) {
    metrics = [
      {
        name: "Ball Control",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Change of Speed",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Body Deception",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Footwork",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good ball transfer from hand to hand",
        "Effective use of head and shoulder fakes",
        "Low and controlled dribble"
      ],
      improve: [
        "Focus on more explosive push-off from your plant foot",
        "Keep your dribble lower for better control",
        "Try incorporating change of pace with your crossover"
      ]
    };
    
    coachingTips = [
      "Practice crossovers with a tennis ball to improve hand control",
      "Use cones to simulate defenders and practice change of direction",
      "Film yourself from defender's view to analyze your deception",
      "Incorporate hesitation moves to make crossovers more effective"
    ];
  } else {
    // Generic basketball metrics
    return generateGenericAnalysis(drillName, score);
  }
  
  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};

// Baseball-specific analysis
const generateBaseballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  let metrics = [];
  let feedback = { good: [], improve: [] };
  let coachingTips = [];
  
  if (drillName.includes("Pitching")) {
    metrics = [
      {
        name: "Arm Slot Consistency",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Stride Length",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Hip-Shoulder Separation",
        value: Math.floor(score * 0.95 + Math.random() * 5),
        target: 100,
        unit: "%"
      },
      {
        name: "Balance Point",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good momentum towards home plate",
        "Consistent arm slot through delivery",
        "Strong front side at release"
      ],
      improve: [
        "Work on maintaining better posture through release",
        "Focus on hip-shoulder separation timing",
        "Keep your head still during delivery"
      ]
    };
    
    coachingTips = [
      "Practice with a towel to groove your arm path",
      "Use video analysis from both sides to check alignment",
      "Work on long toss to build arm strength naturally",
      "Practice balance drills on both legs"
    ];
  }
  
  // Add similar detailed analysis for batting and other baseball drills
  // For brevity, we'll return generic analysis for other baseball drills
  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};

// Similar sport-specific analysis generators for football, tennis, golf, and soccer
// For brevity, these use the generic analysis generator
const generateFootballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return generateGenericAnalysis(drillName, score);
};

const generateTennisAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return generateGenericAnalysis(drillName, score);
};

const generateGolfAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return generateGenericAnalysis(drillName, score);
};

const generateSoccerAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return generateGenericAnalysis(drillName, score);
};

// Generic analysis for unsupported sports or drills
const generateGenericAnalysis = (drillName: string, score: number): AnalysisResponse => {
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

// Helper function to build the complete analysis response
const buildAnalysisResponse = (
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
