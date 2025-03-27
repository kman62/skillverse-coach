export interface Sport {
  id: string;
  name: string;
  icon: string;
  description: string;
  coverImage: string;
  drills: Drill[];
  teamAnalysis?: TeamAnalysis[];
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  coverImage: string;
  videoUrl?: string;
  steps?: string[];
  equipment?: string[];
  duration?: string;
  benefits?: string[];
}

export interface TeamAnalysis {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  players: number;
  duration: string;
}

export const SPORTS: Sport[] = [
  {
    id: "basketball",
    name: "Basketball",
    icon: "🏀",
    description: "Master your shooting, dribbling, and passing skills",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1480&auto=format&fit=crop",
    drills: [
      {
        id: "free-throw-front",
        name: "Free Throw (Front)",
        description: "Perfect your free throw technique with front view analysis",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Set up at the free throw line with feet shoulder-width apart",
          "Position the ball with your shooting hand under the ball, guide hand on the side",
          "Bend your knees slightly for balance",
          "Focus on the front of the rim",
          "Push through your legs and extend your arm upward",
          "Release with a smooth follow-through, wrist snapped downward"
        ],
        equipment: ["Basketball", "Basketball court with free throw line"],
        duration: "15-20 minutes",
        benefits: ["Improved free throw accuracy", "Consistent shooting form", "Better game-time confidence"]
      },
      {
        id: "free-throw-side",
        name: "Free Throw (Side)",
        description: "Analyze your free throw form from the side view",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Position yourself at the free throw line",
          "Align your shooting shoulder, elbow, and knee vertically",
          "Keep your elbow tucked in at a 90-degree angle",
          "Ensure proper ball position with shooting hand under the ball",
          "Maintain a fluid motion from knee bend to release",
          "Follow through with arm fully extended and wrist flexed"
        ],
        equipment: ["Basketball", "Basketball court with free throw line"],
        duration: "15-20 minutes",
        benefits: ["Better shooting alignment", "Improved shooting arc", "Consistent release point"]
      },
      {
        id: "jump-shot",
        name: "Jump Shot",
        description: "Improve your jump shot mechanics and accuracy",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1471&auto=format&fit=crop",
        steps: [
          "Start in triple-threat position with knees bent",
          "Square your shoulders to the basket",
          "Bring the ball up as you begin your upward jump",
          "Release the ball at the peak of your jump",
          "Follow through with your shooting hand toward the basket",
          "Land in the same spot you jumped from"
        ],
        equipment: ["Basketball", "Basketball court or hoop"],
        duration: "25-30 minutes",
        benefits: ["Increased shooting range", "Better shot under defensive pressure", "Improved scoring ability"]
      },
      {
        id: "crossover-dribble",
        name: "Crossover Dribble",
        description: "Master the crossover dribble for better ball handling",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Start in athletic stance with knees bent",
          "Dribble the ball with one hand, keeping it below waist level",
          "Push the ball quickly across your body toward the opposite hand",
          "Keep your center of gravity low during the transition",
          "Protect the ball with your non-dribbling hand",
          "Accelerate in the new direction after completing the crossover"
        ],
        equipment: ["Basketball", "Open space for dribbling"],
        duration: "20-25 minutes",
        benefits: ["Improved ball control", "Better ability to create space from defenders", "Enhanced offensive moves"]
      }
    ],
    teamAnalysis: [
      {
        id: "full-court-gameplay",
        name: "Full Court Game Analysis",
        description: "Analyze team positioning, ball movement, and game strategy with 5v5 full court play",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
        players: 10,
        duration: "40-48 min"
      },
      {
        id: "offensive-sets",
        name: "Team Offensive Sets",
        description: "Evaluate team offensive patterns, spacing, and execution of set plays",
        coverImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1600&auto=format&fit=crop",
        players: 10,
        duration: "15-20 min"
      }
    ]
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: "⚾",
    description: "Improve your pitching, batting, and fielding techniques",
    coverImage: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=1516&auto=format&fit=crop",
    drills: [
      {
        id: "pitching-mechanics",
        name: "Pitching Mechanics",
        description: "Analyze and perfect your pitching form",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1531068537233-9717bcbf14b2?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Start in a balanced stance on the pitching rubber",
          "Initiate with proper leg lift, maintaining balance",
          "Drive toward home plate with your lower body",
          "Rotate your hips and shoulders together",
          "Extend your arm fully during release",
          "Follow through with your body moving toward home plate"
        ],
        equipment: ["Baseball", "Pitching mound", "Glove", "Target or catcher"],
        duration: "30-45 minutes",
        benefits: ["Increased pitching velocity", "Better pitch control", "Reduced risk of arm injuries"]
      },
      {
        id: "batting-stance",
        name: "Batting Stance & Swing",
        description: "Optimize your batting stance and swing mechanics",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Position yourself in the batter's box with feet shoulder-width apart",
          "Hold the bat with a firm but relaxed grip",
          "Distribute weight slightly toward back foot",
          "Keep your head still and eyes focused on the pitcher",
          "Step toward the pitcher as you begin your swing",
          "Rotate your hips and shoulders together for maximum power",
          "Follow through completely after making contact"
        ],
        equipment: ["Baseball bat", "Batting tee (optional)", "Baseballs", "Batting cage or field"],
        duration: "20-30 minutes",
        benefits: ["Improved bat speed", "Better contact rate", "Increased hitting power"]
      }
    ]
  },
  {
    id: "football",
    name: "Football",
    icon: "🏈",
    description: "Develop your throwing, catching, and footwork skills",
    coverImage: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1526&auto=format&fit=crop",
    drills: [
      {
        id: "quarterback-throw",
        name: "Quarterback Throw",
        description: "Perfect your quarterback throwing mechanics",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1580692215225-d8f66b575407?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Start in athletic stance with feet shoulder-width apart",
          "Hold the ball with your fingertips across the laces",
          "Bring your elbow up to shoulder height",
          "Step toward your target with your non-throwing foot",
          "Rotate your hips and shoulders as you throw",
          "Release the ball with a clean follow-through, wrist snapping down"
        ],
        equipment: ["Football", "Throwing targets (optional)", "Field or open space"],
        duration: "30-45 minutes",
        benefits: ["Improved accuracy", "Better spiral on passes", "Increased throwing distance"]
      },
      {
        id: "receiver-catch",
        name: "Receiver Catch",
        description: "Improve your catching technique and hand positioning",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1605098093083-4559a70eab6e?q=80&w=1470&auto=format&fit=crop",
        steps: [
          "Start in ready position with hands up and elbows out",
          "Keep your eyes focused on the ball throughout its flight",
          "Extend your arms toward the ball, forming a diamond with your thumbs and index fingers",
          "Catch with your hands, not your body",
          "Secure the ball immediately after catching it",
          "Tuck the ball away to protect it from defenders"
        ],
        equipment: ["Football", "Quarterback or ball thrower", "Field or open space"],
        duration: "20-30 minutes",
        benefits: ["Fewer dropped passes", "Better hand-eye coordination", "Improved catch radius"]
      },
      {
        id: "kicking-form",
        name: "Kicking Form",
        description: "Analyze and improve your kicking mechanics",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1566577124414-3b9e30e20786?q=80&w=1470&auto=format&fit=crop",
        steps: [
          "Position the ball on a kicking tee or hold for a place kick",
          "Take a measured approach with consistent steps",
          "Plant your non-kicking foot next to the ball, pointed toward your target",
          "Lock your ankle and make contact with the ball using the top of your foot",
          "Follow through with your kicking leg toward the target",
          "Maintain balance throughout the kick"
        ],
        equipment: ["Football", "Kicking tee", "Field with goalposts"],
        duration: "25-35 minutes",
        benefits: ["Increased kicking distance", "Better accuracy", "More consistent kicks"]
      }
    ]
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    description: "Enhance your serve, forehand, backhand, and volleys",
    coverImage: "https://images.unsplash.com/photo-1576610138400-4f8f249a4587?q=80&w=1470&auto=format&fit=crop",
    drills: [
      {
        id: "serve-technique",
        name: "Serve Technique",
        description: "Perfect your serving technique and power",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1554290813-ec6a2a72e5c7?q=80&w=1374&auto=format&fit=crop",
        steps: [
          "Start in ready position behind the baseline",
          "Hold the ball and racket in front of you",
          "Toss the ball straight up above your head",
          "Bring your racket back as the ball rises",
          "Extend upward and make contact with the ball at full stretch",
          "Follow through across your body after contact"
        ],
        equipment: ["Tennis racket", "Tennis balls", "Tennis court"],
        duration: "30-45 minutes",
        benefits: ["Increased serve speed", "Better placement accuracy", "More consistent first serves"]
      },
      {
        id: "forehand-stroke",
        name: "Forehand Stroke",
        description: "Analyze and improve your forehand mechanics",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1558705232-9ddbb73f6ea4?q=80&w=1526&auto=format&fit=crop",
        steps: [
          "Start in ready position with racket in front",
          "Turn your shoulders sideways as you prepare for the shot",
          "Bring the racket back with a circular motion",
          "Step into the shot with your front foot",
          "Swing forward, making contact with the ball in front of your body",
          "Follow through completely, ending with the racket high"
        ],
        equipment: ["Tennis racket", "Tennis balls", "Tennis court or practice wall"],
        duration: "25-35 minutes",
        benefits: ["Improved power and control", "Better consistency", "More spin on the ball"]
      }
    ]
  },
  {
    id: "golf",
    name: "Golf",
    icon: "🏌️",
    description: "Master your swing, putting, and overall technique",
    coverImage: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1470&auto=format&fit=crop",
    drills: [
      {
        id: "driver-swing",
        name: "Driver Swing",
        description: "Analyze and perfect your driver swing mechanics",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1632155443669-4bf384e6614a?q=80&w=1460&auto=format&fit=crop",
        steps: [
          "Address the ball with feet shoulder-width apart",
          "Position the ball forward in your stance, aligned with inside of front foot",
          "Grip the club properly with both hands",
          "Take the club back slowly, keeping your left arm straight (for right-handed golfers)",
          "Rotate your shoulders and hips during the backswing",
          "Transfer weight to your front foot during downswing",
          "Maintain head position and follow through completely"
        ],
        equipment: ["Driver", "Golf balls", "Driving range or golf course"],
        duration: "30-45 minutes",
        benefits: ["Increased driving distance", "Better accuracy off the tee", "More consistent ball flight"]
      },
      {
        id: "putting-technique",
        name: "Putting Technique",
        description: "Perfect your putting stroke and accuracy",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1623071286423-02220fcb7367?q=80&w=1460&auto=format&fit=crop",
        steps: [
          "Address the ball with feet shoulder-width apart",
          "Position your eyes directly over the ball",
          "Grip the putter with light pressure",
          "Keep your wrists firm throughout the stroke",
          "Use a pendulum motion with your shoulders, not your wrists",
          "Maintain a smooth tempo and follow through toward your target"
        ],
        equipment: ["Putter", "Golf balls", "Putting green"],
        duration: "20-30 minutes",
        benefits: ["Improved distance control", "Better accuracy", "Fewer three-putts"]
      }
    ]
  },
  {
    id: "soccer",
    name: "Soccer",
    icon: "⚽",
    description: "Improve your kicking, dribbling, and ball control",
    coverImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1470&auto=format&fit=crop",
    drills: [
      {
        id: "free-kick",
        name: "Free Kick",
        description: "Master your free kick technique and accuracy",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1470&auto=format&fit=crop",
        steps: [
          "Position the ball with valve facing up",
          "Take 3-5 steps back from the ball",
          "Approach the ball at a slight angle",
          "Plant your non-kicking foot beside the ball, pointed toward your target",
          "Strike the ball with the inside or top of your foot, depending on desired curve",
          "Follow through toward your target",
          "Keep your head down during contact"
        ],
        equipment: ["Soccer ball", "Goal", "Practice wall or target"],
        duration: "25-35 minutes",
        benefits: ["Improved accuracy", "Better ball control", "Increased shot power"]
      },
      {
        id: "dribbling-technique",
        name: "Dribbling Technique",
        description: "Improve your ball control and dribbling skills",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1550881111-7a4ac68a7f35?q=80&w=1470&auto=format&fit=crop",
        steps: [
          "Start in athletic stance with knees slightly bent",
          "Keep the ball close to your feet as you move",
          "Use the inside, outside, and top of your foot to control the ball",
          "Keep your head up to see the field while dribbling",
          "Use small, frequent touches to maintain control",
          "Practice changing direction and speed while maintaining control"
        ],
        equipment: ["Soccer ball", "Cones (optional)", "Open space"],
        duration: "20-30 minutes",
        benefits: ["Better ball control", "Improved maneuverability", "Enhanced ability to beat defenders"]
      }
    ]
  },
  {
    id: "rugby",
    name: "Rugby",
    icon: "🏉",
    description: "Master your passing, tackling, and set-piece techniques",
    coverImage: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1600&auto=format&fit=crop",
    drills: [
      {
        id: "passing-technique",
        name: "Passing Technique",
        description: "Perfect your rugby passing form for accurate and quick ball distribution",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=1600&auto=format&fit=crop",
        steps: [
          "Stand with feet shoulder-width apart, knees slightly bent",
          "Hold the ball with both hands, fingers spread across the surface",
          "Turn your body sideways toward your target",
          "Bring the ball back past your hip",
          "Transfer weight to your front foot as you pass",
          "Follow through with hands pointing toward your target",
          "Ensure the ball spins backward as it travels"
        ],
        equipment: ["Rugby ball", "Training pitch or open space", "Training cones (optional)"],
        duration: "20-30 minutes",
        benefits: ["Improved passing accuracy", "Better ball handling skills", "Increased passing distance"]
      },
      {
        id: "tackling-technique",
        name: "Tackling Technique",
        description: "Learn safe and effective tackling form for defensive play",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1600&auto=format&fit=crop",
        steps: [
          "Position yourself in front of the ball carrier with feet shoulder-width apart",
          "Bend your knees and keep your back straight (rugby-ready position)",
          "Keep your head up and eyes on the target's waist/hip area",
          "Drive forward with your legs, aiming for the waist/hip region",
          "Make contact with your shoulder, not your head",
          "Wrap your arms around the ball carrier's legs",
          "Continue driving with your legs until the ball carrier is grounded",
          "Regain your feet quickly to contest for the ball"
        ],
        equipment: ["Rugby ball", "Tackle pads or bags", "Mouthguard", "Training pitch with soft surface"],
        duration: "25-35 minutes",
        benefits: ["Safer tackling technique", "More effective defensive stops", "Reduced risk of injury"]
      },
      {
        id: "ruck-technique",
        name: "Ruck Technique",
        description: "Master proper body position and technique for effective rucking",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=1600&auto=format&fit=crop",
        steps: [
          "Identify when a teammate has been tackled and the ball is on the ground",
          "Approach the ruck area from your side of the ball",
          "Keep your body low with bent knees and straight back",
          "Step over or near your tackled teammate",
          "Bind onto another player if present, or stay unbound",
          "Drive from your legs to secure position over the ball",
          "Keep your head up and maintain strong body position",
          "Use your feet to move the ball backward if necessary"
        ],
        equipment: ["Rugby ball", "Tackle pads", "Training pitch", "Mouthguard"],
        duration: "20-30 minutes",
        benefits: ["Better ball retention after tackles", "Improved breakdown control", "More effective forward momentum"]
      }
    ],
    teamAnalysis: [
      {
        id: "scrum-analysis",
        name: "Scrum Formation Analysis",
        description: "Analyze scrum technique, binding, and power generation with full team participation",
        coverImage: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=1600&auto=format&fit=crop",
        players: 16,
        duration: "15-20 min"
      },
      {
        id: "lineout-analysis",
        name: "Lineout Organization",
        description: "Evaluate lineout calls, timing, lifting technique and throw accuracy",
        coverImage: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=1600&auto=format&fit=crop",
        players: 8,
        duration: "10-15 min"
      }
    ]
  }
];

export const getDrillById = (sportId: string, drillId: string): Drill | undefined => {
  const sport = SPORTS.find(s => s.id === sportId);
  return sport?.drills.find(d => d.id === drillId);
};

export const getSportById = (id: string): Sport | undefined => {
  return SPORTS.find(sport => sport.id === id);
};

export const getTeamAnalysisById = (sportId: string, analysisId: string): TeamAnalysis | undefined => {
  const sport = SPORTS.find(s => s.id === sportId);
  return sport?.teamAnalysis?.find(a => a.id === analysisId);
};
