
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse } from './analysisHelpers';

// Basketball-specific analysis
export const generateBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
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
    // Generic basketball metrics if drill doesn't match specific patterns
    return buildAnalysisResponse(drillName, score, [
      {
        name: "Shot Form",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Balance",
        value: Math.floor(score * 0.85 + Math.random() * 15),
        target: 90,
        unit: "%"
      },
      {
        name: "Follow Through",
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
    ], {
      good: [
        "Good general basketball mechanics",
        "Proper athletic stance",
        "Consistent rhythm in movement"
      ],
      improve: [
        "Focus on smoother transitions between movements",
        "Try to keep your eyes up while performing the drill",
        "Work on maintaining proper technique even when fatigued"
      ]
    }, [
      "Work on fundamentals daily",
      "Record your practice sessions to identify patterns",
      "Focus on quality of repetitions over quantity",
      "Practice at game speed"
    ]);
  }
  
  return buildAnalysisResponse(drillName, score, metrics, feedback, coachingTips);
};
