
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
  drillName: string
): Promise<AnalysisResponse> => {
  // Create form data to send the video file
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("drillName", drillName);

  try {
    // For development/demo purposes, we'll use a timeout to simulate API call
    // In production, this would be replaced with an actual fetch call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock API response for demo purposes
    // In production, uncomment the fetch code below and remove the mock response
    
    /*
    const response = await fetch(AI_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as AnalysisResponse;
    */
    
    // Generate more realistic analysis data based on drill name
    return generateAnalysisData(drillName);
  } catch (error) {
    console.error("Error analyzing video:", error);
    throw error;
  }
};

// This is a more sophisticated version of the mock data generator
// In production, this would be replaced with the actual API response
const generateAnalysisData = (drillName: string): AnalysisResponse => {
  // Generate a deterministic but realistic score
  const baseScore = drillName.length % 20 + 70; // Score between 70-90
  const score = Math.min(100, Math.max(60, baseScore));
  
  // Generate metrics based on the drill name
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
  
  // Generate feedback based on drill name and metrics
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
  
  // Generate coaching tips
  const coachingTips = [
    `Practice ${drillName.toLowerCase()} movements slowly at first to perfect form`,
    `Film yourself from multiple angles to identify form issues`,
    `Focus on controlled movements rather than speed during practice`,
    `Try breaking down the ${drillName.toLowerCase()} into component parts to master each segment`
  ];
  
  // Return the complete analysis data
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
          icon: null  // Will be set in the component
        },
        {
          name: "Position Stability",
          description: `Your starting position for ${drillName.toLowerCase()} shows good stability.`,
          quality: score > 70 ? "good" : "needs-improvement",
          icon: null  // Will be set in the component
        }
      ],
      preRoutine: [
        {
          name: "Mental Preparation",
          description: "Good focus before beginning the movement.",
          quality: "good",
          icon: null  // Will be set in the component
        },
        {
          name: "Position Setup",
          description: `Your setup position for ${drillName.toLowerCase()} could be more consistent.`,
          quality: score > 85 ? "good" : "needs-improvement",
          icon: null  // Will be set in the component
        }
      ],
      habits: [
        {
          name: "Recovery Position",
          description: "You return to proper position between attempts.",
          quality: score > 80 ? "good" : "needs-improvement",
          icon: null  // Will be set in the component
        },
        {
          name: "Body Alignment",
          description: `Maintain better alignment during ${drillName.toLowerCase()}.`,
          quality: score > 75 ? "good" : "needs-improvement",
          icon: null  // Will be set in the component
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
