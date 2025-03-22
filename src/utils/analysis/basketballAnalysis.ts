import { AnalysisResponse } from './analysisTypes';
import { buildAnalysisResponse } from './analysisHelpers';

// Basketball-specific analysis
export const generateBasketballAnalysis = (
  drillName: string, 
  score: number, 
  gameplaySituation?: string, 
  playType?: string
): AnalysisResponse => {
  // If gameplay situation and play type are provided, use those for analysis
  if (gameplaySituation && playType) {
    return generateGameplayAnalysis(gameplaySituation, playType, score);
  }
  
  // Otherwise, determine drill-specific metrics and feedback
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

// Function to generate analysis for gameplay situations
function generateGameplayAnalysis(gameplaySituation: string, playType: string, score: number): AnalysisResponse {
  let title = `${gameplaySituation.charAt(0).toUpperCase() + gameplaySituation.slice(1)} Analysis: ${formatPlayType(playType)}`;
  let description = `Analysis of your ${gameplaySituation} execution for ${formatPlayType(playType)}.`;
  let metrics = [];
  let feedback = { good: [], improve: [] };
  let coachingTips = [];
  
  // Offense gameplay
  if (gameplaySituation === 'offense') {
    if (playType === 'crossover') {
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
          name: "Defender Reaction",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Effective use of head and shoulder fakes",
          "Good ball protection during the crossover",
          "Quick acceleration after the move"
        ],
        improve: [
          "Lower your center of gravity more for better balance",
          "Incorporate more change of pace with your crossover",
          "Use your off-hand to create more separation"
        ]
      };
      
      coachingTips = [
        "Practice against live defenders to improve timing",
        "Work on crossovers with both hands equally",
        "Add hesitation elements to make your crossover more unpredictable",
        "Study film of elite ball handlers to learn their techniques"
      ];
    } else if (playType === 'pick-and-roll') {
      metrics = [
        {
          name: "Screen Usage",
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
          name: "Timing",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Pass Accuracy",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good patience waiting for the screen to be set",
          "Effective reading of the defense's coverage",
          "Proper spacing after the screen"
        ],
        improve: [
          "Work on tighter turns around the screener",
          "Develop more options based on defensive reactions",
          "Improve communication with the screener"
        ]
      };
      
      coachingTips = [
        "Practice pick-and-roll against different defensive coverages",
        "Study film of elite guards to see how they use screens",
        "Develop chemistry with your screeners through repetition",
        "Learn to read when to split, reject, or use the screen"
      ];
    } else if (playType === 'jumpshot') {
      metrics = [
        {
          name: "Shot Mechanics",
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
          name: "Shot Release",
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
          "Consistent shot motion from setup to release",
          "Good shot elevation on your jumper",
          "Squared shoulders to the basket"
        ],
        improve: [
          "Work on quicker release without sacrificing form",
          "Maintain better balance on contested shots",
          "Focus on consistent follow-through in game situations"
        ]
      };
      
      coachingTips = [
        "Practice shooting while fatigued to build game-like conditioning",
        "Film your shooting form from multiple angles",
        "Use form shooting drills to reinforce proper mechanics",
        "Practice shooting off different types of movements"
      ];
    } else if (playType === 'layup') {
      metrics = [
        {
          name: "Footwork",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Body Control",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Finishing Technique",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Shot Protection",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good use of the backboard angle",
          "Effective body positioning to protect the ball",
          "Proper footwork on the approach"
        ],
        improve: [
          "Practice finishing with both hands equally",
          "Develop more creative finishes for different situations",
          "Improve body control when taking contact"
        ]
      };
      
      coachingTips = [
        "Practice Mikan drills to improve touch around the rim",
        "Work on finishing through contact with a pad or defender",
        "Develop various layup types (reverse, eurostep, floater)",
        "Focus on maintaining speed while maintaining control"
      ];
    }
  }
  // Defense gameplay
  else if (gameplaySituation === 'defense') {
    if (playType === 'man-defense') {
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
          name: "Hand Activity",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Position Recovery",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good defensive stance with bent knees",
          "Active hands in passing lanes",
          "Proper positioning between ball and basket"
        ],
        improve: [
          "Work on quicker lateral slides without crossing feet",
          "Maintain lower center of gravity throughout possession",
          "Improve anticipation of offensive moves"
        ]
      };
      
      coachingTips = [
        "Practice defensive slides with resistance bands",
        "Work on closeouts followed by defensive containment",
        "Use mirror drills to improve reaction time",
        "Study film of elite defenders to learn positioning"
      ];
    } else if (playType === 'zone-defense') {
      metrics = [
        {
          name: "Zone Positioning",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Communication",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Zone Rotation",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Defensive Awareness",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good positioning in your zone area",
          "Active communication with teammates",
          "Proper shifts based on ball movement"
        ],
        improve: [
          "Increase awareness of weak side threats",
          "Improve rotation speed when the ball moves quickly",
          "Better recognition of zone vulnerabilities"
        ]
      };
      
      coachingTips = [
        "Practice zone shell drills with specific rotations",
        "Drill communication patterns with teammates",
        "Study film of zone defensive breakdowns",
        "Work on recognizing and defending common zone attacks"
      ];
    } else if (playType === 'closeout') {
      metrics = [
        {
          name: "Closeout Speed",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Body Control",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Hand Placement",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Recovery Defense",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good sprint to closeout position",
          "Effective chopping of feet to stop momentum",
          "Active high hand to contest shots"
        ],
        improve: [
          "Work on maintaining balance during closeouts",
          "Improve angles to force baseline or middle as needed",
          "Better recognition of shooter vs. driver tendencies"
        ]
      };
      
      coachingTips = [
        "Practice the 'fly-by' closeout technique for elite shooters",
        "Drill closeout to containment transitions",
        "Work on different closeout techniques based on personnel",
        "Practice closeouts from different starting positions"
      ];
    } else if (playType === 'help-defense') {
      metrics = [
        {
          name: "Help Positioning",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Reaction Time",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Recovery Speed",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Communication",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good positioning in help position",
          "Quick reaction to dribble penetration",
          "Proper communication on rotations"
        ],
        improve: [
          "Work on taking better angles when helping",
          "Improve recovery speed to your man after helping",
          "Better timing on help decisions"
        ]
      };
      
      coachingTips = [
        "Practice shell defense focusing on help rotations",
        "Drill help-and-recover situations with teammates",
        "Work on communication terminology for help defense",
        "Study film of elite team defenses to learn proper timing"
      ];
    }
  }
  // Transition gameplay
  else if (gameplaySituation === 'transition') {
    if (playType === 'fast-break') {
      metrics = [
        {
          name: "Lane Running",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Spacing",
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
          name: "Finishing",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good lane running and floor spacing",
          "Effective decision making with the ball",
          "Proper timing on cuts and fills"
        ],
        improve: [
          "Work on maintaining wider spacing in lanes",
          "Improve recognition of numbers advantage",
          "Better finishing decisions at high speed"
        ]
      };
      
      coachingTips = [
        "Practice 3-on-2, 2-on-1 fast break drills regularly",
        "Work on outlet passes and floor running after rebounds",
        "Develop decision trees for different break situations",
        "Film your fast breaks to analyze spacing patterns"
      ];
    } else if (playType === 'transition-offense') {
      metrics = [
        {
          name: "Early Offense",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Floor Balance",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Pace",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Shot Selection",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good pace pushing the ball up court",
          "Effective early offense actions",
          "Proper floor spacing in transition"
        ],
        improve: [
          "Work on quicker decision making in early offense",
          "Improve shot selection in transition",
          "Better recognition of when to push vs. set up"
        ]
      };
      
      coachingTips = [
        "Practice transition drills that flow into half-court sets",
        "Work on quick outlet passes after defensive rebounds",
        "Develop primary and secondary transition options",
        "Study film of teams with effective transition offense"
      ];
    } else if (playType === 'transition-defense') {
      metrics = [
        {
          name: "Sprint Back",
          value: Math.floor(score * 0.9 + Math.random() * 10),
          target: 95,
          unit: "%"
        },
        {
          name: "Matchup Recognition",
          value: Math.floor(score * 0.85 + Math.random() * 15),
          target: 90,
          unit: "%"
        },
        {
          name: "Communication",
          value: Math.floor(score * 0.95 + Math.random() * 5),
          target: 100,
          unit: "%"
        },
        {
          name: "Paint Protection",
          value: Math.floor(score * 0.8 + Math.random() * 20),
          target: 95,
          unit: "%"
        }
      ];
      
      feedback = {
        good: [
          "Good hustle sprinting back on defense",
          "Effective communication finding matchups",
          "Proper protection of the paint first"
        ],
        improve: [
          "Work on taking better angles when sprinting back",
          "Improve recognition of ball vs. man responsibilities",
          "Better communication in cross-matching situations"
        ]
      };
      
      coachingTips = [
        "Practice defensive transition drills with disadvantages",
        "Work on sprint-back mechanics from different floor positions",
        "Develop verbal and non-verbal transition defense communication",
        "Study film of elite teams' transition defense principles"
      ];
    }
  }
  
  // If no specific metrics were set, use generic ones
  if (metrics.length === 0) {
    metrics = [
      {
        name: "Technique",
        value: Math.floor(score * 0.9 + Math.random() * 10),
        target: 95,
        unit: "%"
      },
      {
        name: "Positioning",
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
        name: "Execution",
        value: Math.floor(score * 0.8 + Math.random() * 20),
        target: 95,
        unit: "%"
      }
    ];
    
    feedback = {
      good: [
        "Good overall execution of basketball fundamentals",
        "Effective basketball IQ in game situations",
        "Proper technique in movement patterns"
      ],
      improve: [
        "Focus on more consistent technique under pressure",
        "Work on quicker decision making in game situations",
        "Improve positioning awareness in relation to teammates"
      ]
    };
    
    coachingTips = [
      "Practice in game-like conditions to improve performance",
      "Film your gameplay to identify patterns and tendencies",
      "Work on specific situations that challenge your decision making",
      "Develop a pre-game routine that prepares you mentally"
    ];
  }
  
  return {
    title,
    description,
    score,
    metrics,
    feedback,
    coachingTips
  };
}

// Helper function to format play type for display
function formatPlayType(playType: string): string {
  // Convert from kebab-case to Title Case with spaces
  return playType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
