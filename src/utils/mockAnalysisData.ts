
import { Check, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import React from 'react';

// Define types for our data structure
interface AnalysisMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface AnalysisResult {
  title: string;
  description: string;
  score: number;
  metrics: AnalysisMetric[];
  feedback: {
    good: string[];
    improve: string[];
  };
}

interface BehaviorPattern {
  name: string;
  description: string;
  quality: 'good' | 'needs-improvement';
  icon: React.ReactNode;
}

interface BehaviorAnalysis {
  consistency: BehaviorPattern[];
  preRoutine: BehaviorPattern[];
  habits: BehaviorPattern[];
}

interface MockAnalysisData {
  result: AnalysisResult;
  behavior: BehaviorAnalysis;
}

export const generateMockAnalysisData = (drillName: string): MockAnalysisData => {
  // Mock analysis result data
  const result: AnalysisResult = {
    title: `${drillName} Analysis`,
    description: "AI-powered feedback on your technique",
    score: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
    metrics: [
      {
        name: "Arm Angle",
        value: Math.floor(Math.random() * 20) + 70,
        target: 85,
        unit: "°"
      },
      {
        name: "Joint Alignment",
        value: Math.floor(Math.random() * 25) + 70,
        target: 90,
        unit: "%"
      },
      {
        name: "Motion Smoothness",
        value: Math.floor(Math.random() * 30) + 65,
        target: 95,
        unit: "%"
      },
      {
        name: "Balance",
        value: Math.floor(Math.random() * 20) + 75,
        target: 90,
        unit: "%"
      }
    ],
    feedback: {
      good: [
        "Good initial stance and body positioning",
        "Consistent follow-through motion after completion",
        "Proper weight distribution throughout the movement"
      ],
      improve: [
        "Try to maintain a more consistent arm angle during execution",
        "Focus on keeping your joints aligned throughout the motion",
        "Work on smoother transitions between movement phases"
      ]
    }
  };
  
  // Mock behavior analysis data
  const behavior: BehaviorAnalysis = {
    consistency: [
      {
        name: "Timing Consistency",
        description: "Your shot timing varies by less than 0.2 seconds between attempts, showing excellent consistency.",
        quality: "good",
        icon: React.createElement(Check, { size: 16 })
      },
      {
        name: "Position Variance",
        description: "Your starting position shifts slightly between attempts, which may affect overall consistency.",
        quality: "needs-improvement",
        icon: React.createElement(AlertCircle, { size: 16 })
      }
    ],
    preRoutine: [
      {
        name: "Preparation Time",
        description: "You take 3-4 seconds to prepare before each shot, which is optimal for focus without overthinking.",
        quality: "good",
        icon: React.createElement(Clock, { size: 16 })
      },
      {
        name: "Deep Breath",
        description: "You consistently take a deep breath before shooting, which helps with focus and stability.",
        quality: "good",
        icon: React.createElement(Check, { size: 16 })
      }
    ],
    habits: [
      {
        name: "Follow Through",
        description: "Your follow-through is consistent and well-extended, improving accuracy and shot control.",
        quality: "good",
        icon: React.createElement(Check, { size: 16 })
      },
      {
        name: "Reset Between Shots",
        description: "You don't fully reset your position between attempts, which may introduce inconsistencies.",
        quality: "needs-improvement",
        icon: React.createElement(RotateCcw, { size: 16 })
      }
    ]
  };

  return { result, behavior };
};
