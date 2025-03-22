
import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse } from './analysisHelpers';

// Basketball-specific analysis
export const generateBasketballAnalysis = (
  drillName: string, 
  score: number,
  gameplaySituation: string = "regular"
): AnalysisResponse => {
  // First check if we have a gameplay situation
  if (gameplaySituation !== "regular") {
    return generateGameplayAnalysis(drillName, score, gameplaySituation);
  }
  
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

// Function to generate analysis for specific gameplay situations
const generateGameplayAnalysis = (
  drillName: string, 
  score: number,
  gameplaySituation: string
): AnalysisResponse => {
  let metrics = [];
  let feedback = { good: [], improve: [] };
  let coachingTips = [];
  
  // Customize analysis based on gameplay situation
  switch (gameplaySituation) {
    case 'pick-and-roll':
      metrics = [
        {
          name: "Screen Setting",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Ball Handler Timing",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Roll/Pop Decision",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Defensive Read",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good screen angle and contact",
          "Effective timing between screener and ball handler",
          "Proper spacing after the pick"
        ],
        improve: [
          "Hold the screen longer before rolling",
          "Ball handler should wait for the screen to be set",
          "Be more decisive on the roll or pop decision"
        ]
      };
      
      coachingTips = [
        "Practice the timing between screener and ball handler",
        "Work on reading different defensive coverages",
        "Develop chemistry with consistent partners",
        "Vary the pick and roll with pick and pop options"
      ];
      break;
      
    case 'iso':
      metrics = [
        {
          name: "First Step Explosiveness",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Dribble Control",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Shot Creation",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Decision Making",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good use of hesitation moves",
          "Effective change of pace",
          "Strong body control when finishing"
        ],
        improve: [
          "Keep your head up to spot open teammates",
          "Work on counter moves when primary move is stopped",
          "Improve shot selection in iso situations"
        ]
      };
      
      coachingTips = [
        "Practice reading defensive positioning",
        "Develop a go-to move and counter move",
        "Work on finishing with both hands",
        "Study film of elite isolation players"
      ];
      break;
      
    case 'fast-break':
      metrics = [
        {
          name: "Transition Speed",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Lane Filling",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Decision Making",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Ball Movement",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Quick outlet passes to start the break",
          "Good floor spacing in transition",
          "Eyes up looking for teammates"
        ],
        improve: [
          "Run wider lanes to create better spacing",
          "Make simpler passes in transition",
          "Balance aggression with control"
        ]
      };
      
      coachingTips = [
        "Practice 3-on-2 and 2-on-1 fast break drills",
        "Focus on making decisions at game speed",
        "Work on finishing through contact in transition",
        "Develop quick outlet passing after rebounds"
      ];
      break;
      
    case 'post-up':
      metrics = [
        {
          name: "Post Position",
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
          name: "Move Selection",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Counter Moves",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good seal against defender",
          "Strong base and balance",
          "Effective use of pivots"
        ],
        improve: [
          "Hold position longer before making a move",
          "Keep the ball higher to avoid guards digging down",
          "Develop more counter moves"
        ]
      };
      
      coachingTips = [
        "Practice Mikan drills for touch around the rim",
        "Work on drop steps and up-and-under moves",
        "Develop passing skills out of double teams",
        "Use a chair for solo footwork drills"
      ];
      break;
      
    case 'zone-offense':
      metrics = [
        {
          name: "Ball Movement",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Zone Gaps Attack",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Flash to High Post",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Perimeter Spacing",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good ball reversal to shift the zone",
          "Effective high-post entry passes",
          "Patient approach to find zone gaps"
        ],
        improve: [
          "Attack the gaps more aggressively",
          "Improve skip passes to open shooters",
          "Better timing on flash cuts to open areas"
        ]
      };
      
      coachingTips = [
        "Practice zone offense shell drill daily",
        "Focus on quick ball movement without dribbling",
        "Work on high-post entry and decision making",
        "Develop skip passes to opposite corners"
      ];
      break;
      
    case 'man-defense':
      metrics = [
        {
          name: "Defensive Stance",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Lateral Movement",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Ball Pressure",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Close Out Technique",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good defensive stance and position",
          "Active hands in passing lanes",
          "Proper closeout technique"
        ],
        improve: [
          "Stay lower in your stance for longer periods",
          "Improve foot speed on lateral movements",
          "Better communication on switches and screens"
        ]
      };
      
      coachingTips = [
        "Practice defensive slides with resistance bands",
        "Work on closeout drills with different angles",
        "Focus on positioning between man and basket",
        "Develop defensive conditioning for late-game situations"
      ];
      break;
      
    default:
      // Generic basketball gameplay metrics
      return buildAnalysisResponse(`${drillName}: Custom Gameplay`, score, [
        {
          name: "Execution",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Decision Making",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Teamwork",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Basketball IQ",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ], {
        good: [
          "Good overall basketball awareness",
          "Effective decision making",
          "Solid fundamental execution"
        ],
        improve: [
          "Work on reading the defense more quickly",
          "Improve timing on specific actions",
          "Develop better court awareness"
        ]
      }, [
        "Study film of successful execution of this play type",
        "Practice at game speed to improve timing",
        "Focus on reading defensive reactions",
        "Work on communication with teammates"
      ]);
  }
  
  // Format the gameplay situation for title display
  const formattedGameplay = gameplaySituation
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return buildAnalysisResponse(`${drillName}: ${formattedGameplay}`, score, metrics, feedback, coachingTips);
};
