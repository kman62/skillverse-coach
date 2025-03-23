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
        coverImage: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=1374&auto=format&fit=crop"
      },
      {
        id: "free-throw-side",
        name: "Free Throw (Side)",
        description: "Analyze your free throw form from the side view",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1374&auto=format&fit=crop"
      },
      {
        id: "jump-shot",
        name: "Jump Shot",
        description: "Improve your jump shot mechanics and accuracy",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1471&auto=format&fit=crop"
      },
      {
        id: "crossover-dribble",
        name: "Crossover Dribble",
        description: "Master the crossover dribble for better ball handling",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?q=80&w=1374&auto=format&fit=crop"
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
        coverImage: "https://images.unsplash.com/photo-1531068537233-9717bcbf14b2?q=80&w=1374&auto=format&fit=crop"
      },
      {
        id: "batting-stance",
        name: "Batting Stance & Swing",
        description: "Optimize your batting stance and swing mechanics",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=1374&auto=format&fit=crop"
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
        coverImage: "https://images.unsplash.com/photo-1580692215225-d8f66b575407?q=80&w=1374&auto=format&fit=crop"
      },
      {
        id: "receiver-catch",
        name: "Receiver Catch",
        description: "Improve your catching technique and hand positioning",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1605098093083-4559a70eab6e?q=80&w=1470&auto=format&fit=crop"
      },
      {
        id: "kicking-form",
        name: "Kicking Form",
        description: "Analyze and improve your kicking mechanics",
        difficulty: "intermediate",
        coverImage: "https://images.unsplash.com/photo-1566577124414-3b9e30e20786?q=80&w=1470&auto=format&fit=crop"
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
        coverImage: "https://images.unsplash.com/photo-1554290813-ec6a2a72e5c7?q=80&w=1374&auto=format&fit=crop"
      },
      {
        id: "forehand-stroke",
        name: "Forehand Stroke",
        description: "Analyze and improve your forehand mechanics",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1558705232-9ddbb73f6ea4?q=80&w=1526&auto=format&fit=crop"
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
        coverImage: "https://images.unsplash.com/photo-1632155443669-4bf384e6614a?q=80&w=1460&auto=format&fit=crop"
      },
      {
        id: "putting-technique",
        name: "Putting Technique",
        description: "Perfect your putting stroke and accuracy",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1623071286423-02220fcb7367?q=80&w=1460&auto=format&fit=crop"
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
        coverImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1470&auto=format&fit=crop"
      },
      {
        id: "dribbling-technique",
        name: "Dribbling Technique",
        description: "Improve your ball control and dribbling skills",
        difficulty: "beginner",
        coverImage: "https://images.unsplash.com/photo-1550881111-7a4ac68a7f35?q=80&w=1470&auto=format&fit=crop"
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
