
import { AnalysisResponse } from './analysisTypes';

// Create our own getRandomItems function since it's not exported from analysisHelpers
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const rugbyMetrics = [
  { name: "Technique", value: 0, target: 95, unit: "%" },
  { name: "Body Position", value: 0, target: 90, unit: "%" },
  { name: "Ball Control", value: 0, target: 85, unit: "%" },
  { name: "Power", value: 0, target: 90, unit: "%" },
  { name: "Speed", value: 0, target: 85, unit: "%" },
  { name: "Decision Making", value: 0, target: 80, unit: "%" },
];

const rugbyGoodFeedback = {
  "passing-technique": [
    "Good hand positioning on the ball",
    "Strong follow-through toward target",
    "Proper weight transfer during pass",
    "Consistent spin on the ball",
    "Good communication before passing"
  ],
  "tackling-technique": [
    "Excellent body position before contact",
    "Eyes on target area (waist/hip)",
    "Strong leg drive through tackle",
    "Effective arm wrap technique",
    "Quick recovery to feet post-tackle"
  ],
  "ruck-technique": [
    "Good body angle on entry",
    "Strong leg drive to secure position",
    "Effective binding with teammates",
    "Clear communication at breakdown",
    "Quick reaction time to tackled player"
  ],
  "default": [
    "Good overall technique execution",
    "Consistent form throughout drill",
    "Strong physical commitment to the exercise",
    "Good communication with teammates",
    "Effective body positioning for the drill"
  ]
};

const rugbyImproveFeedback = {
  "passing-technique": [
    "Work on consistent ball spin",
    "Improve follow-through direction",
    "Increase passing distance gradually",
    "Focus on passing under pressure",
    "Practice passing while moving at speed"
  ],
  "tackling-technique": [
    "Ensure head positioning is safer (to the side)",
    "Drive legs more powerfully through tackle",
    "Improve targeting of waist/hip area",
    "Wrap arms more securely",
    "Practice faster recovery to feet"
  ],
  "ruck-technique": [
    "Maintain lower body position",
    "Improve binding technique with teammates",
    "Enter ruck at safer, more effective angle",
    "Be more decisive at breakdown point",
    "Protect the ball more effectively"
  ],
  "default": [
    "Focus on maintaining proper form throughout",
    "Work on consistency in execution",
    "Increase intensity while maintaining technique",
    "Improve reaction time to changing situations",
    "Develop better body positioning"
  ]
};

const rugbyCoachingTips = {
  "passing-technique": [
    "Practice passing both directions equally",
    "Do passing drills while jogging to improve game-like conditions",
    "Focus on the follow through pointing toward your target",
    "Keep fingers spread across the ball for better control",
    "Practice at increasing distances as technique improves"
  ],
  "tackling-technique": [
    "Start with walking speed tackles before increasing intensity",
    "Always emphasize safety first - head to the side, not in front",
    "Use tackle bags before progressing to pad holders and then live situations",
    "Practice the 'chop tackle' (below waist) separately from higher tackles",
    "Work on quickly returning to feet and contesting for the ball"
  ],
  "ruck-technique": [
    "Start with unopposed rucking to perfect technique",
    "Practice proper body height with shield or pad work",
    "Use the 'crocodile roll' drill to improve clearing out techniques",
    "Practice identifying when to commit to a ruck versus when to stay in defensive line",
    "Work on coordinated rucking with teammates"
  ],
  "default": [
    "Record your technique and review it for self-assessment",
    "Focus on one specific improvement area in each training session",
    "Increase intensity gradually while maintaining proper form",
    "Incorporate rugby-specific conditioning to maintain technique when fatigued",
    "Break complex movements into smaller components to master each element"
  ]
};

export const generateRugbyAnalysis = (drillName: string, baseScore: number): AnalysisResponse => {
  const drillKey = drillName.toLowerCase().includes("pass") ? "passing-technique" : 
                  drillName.toLowerCase().includes("tackl") ? "tackling-technique" : 
                  drillName.toLowerCase().includes("ruck") ? "ruck-technique" : "default";
  
  // Adjust metrics with some variability based on the score
  const metrics = rugbyMetrics.map(metric => {
    const randomFactor = Math.floor(Math.random() * 10) - 5;
    return {
      ...metric,
      value: Math.min(100, Math.max(0, baseScore + randomFactor))
    };
  });

  const goodFeedbackPool = rugbyGoodFeedback[drillKey as keyof typeof rugbyGoodFeedback] || rugbyGoodFeedback.default;
  const improveFeedbackPool = rugbyImproveFeedback[drillKey as keyof typeof rugbyImproveFeedback] || rugbyImproveFeedback.default;
  const coachingTipsPool = rugbyCoachingTips[drillKey as keyof typeof rugbyCoachingTips] || rugbyCoachingTips.default;

  return {
    result: {
      title: `${drillName} Analysis`,
      description: `Analysis of your ${drillName.toLowerCase()} technique`,
      score: baseScore,
      metrics: metrics,
      feedback: {
        good: getRandomItems(goodFeedbackPool, 3),
        improve: getRandomItems(improveFeedbackPool, 3)
      },
      coachingTips: getRandomItems(coachingTipsPool, 4)
    },
    behavior: {
      consistency: [
        {
          name: "Movement Pattern",
          description: baseScore > 75 ? "Your movement pattern shows good consistency." : "Work on maintaining consistent movement patterns.",
          quality: baseScore > 75 ? "good" : "needs-improvement",
          icon: null
        },
        {
          name: "Position Stability",
          description: baseScore > 70 ? "Your position stability is solid." : "Focus on maintaining better position stability.",
          quality: baseScore > 70 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      preRoutine: [
        {
          name: "Setup Position",
          description: baseScore > 65 ? "Your initial setup position is good." : "Pay attention to your starting position.",
          quality: baseScore > 65 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      habits: [
        {
          name: "Body Alignment",
          description: baseScore > 72 ? "Your body alignment is well maintained." : "Work on keeping proper body alignment throughout.",
          quality: baseScore > 72 ? "good" : "needs-improvement",
          icon: null
        }
      ],
      timing: {
        average: "1.8s",
        consistency: baseScore - 5,
        isRushing: baseScore < 70,
        attempts: [{ attemptNumber: 1, duration: "1.8s" }]
      },
      fatigue: {
        level: baseScore > 75 ? "low" : baseScore > 65 ? "moderate" : "high",
        signs: baseScore > 75 
          ? ["Maintained energy throughout", "Consistent performance"] 
          : ["Slight decrease in form over time", "Recovery needed between attempts"],
        recommendations: baseScore > 75
          ? ["Continue with current conditioning", "Add slight intensity increases"]
          : ["Focus on rugby-specific endurance", "Practice technique in fatigued state"]
      }
    }
  };
};
