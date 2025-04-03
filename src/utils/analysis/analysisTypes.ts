
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
  analysisType?: string; // Added this optional property
}
