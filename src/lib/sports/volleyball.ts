import { Sport } from "../types/sports";

export const VOLLEYBALL: Sport = {
  id: "volleyball",
  name: "Volleyball",
  icon: "🏐",
  description: "Master hitting, setting, serving, and defensive skills",
  coverImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1507&auto=format&fit=crop",
  drills: [
    {
      id: "hitting-approach",
      name: "Hitting & Approach",
      description: "Perfect your attacking approach and swing mechanics",
      difficulty: "intermediate",
      coverImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1507&auto=format&fit=crop",
      steps: [
        "Start in ready position behind the 10-foot line",
        "Execute proper 4-step or 3-step approach",
        "Time your jump to meet the ball at its highest point",
        "Snap your wrist at contact for topspin",
        "Follow through across your body",
        "Land balanced on both feet"
      ],
      equipment: ["Volleyball", "Net", "Setter or toss machine"],
      duration: "30-40 minutes",
      benefits: ["Increased kill percentage", "Better timing and approach", "Improved arm swing speed"]
    },
    {
      id: "setting-technique",
      name: "Setting Technique",
      description: "Develop precise setting hands and decision-making",
      difficulty: "intermediate",
      coverImage: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1470&auto=format&fit=crop",
      steps: [
        "Get square to target with proper footwork",
        "Form a triangle with your hands above forehead",
        "Contact ball with fingertips, not palms",
        "Extend arms and legs simultaneously",
        "Follow through toward target",
        "Practice various set types (high, quick, back)"
      ],
      equipment: ["Volleyball", "Net", "Target markers"],
      duration: "25-35 minutes",
      benefits: ["Improved set accuracy", "Better decision-making", "Consistent hand contact"]
    },
    {
      id: "serving-power",
      name: "Serving Power & Accuracy",
      description: "Build serving consistency, power, and placement",
      difficulty: "beginner",
      coverImage: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1470&auto=format&fit=crop",
      steps: [
        "Start in consistent serving position",
        "Toss ball to proper height and location",
        "Transfer weight forward during serve",
        "Contact ball with firm hand at full extension",
        "Follow through in direction of target",
        "Practice different serve types (float, topspin, jump)"
      ],
      equipment: ["Volleyball", "Net", "Target zones marked on court"],
      duration: "20-30 minutes",
      benefits: ["Higher serve velocity", "Better accuracy and placement", "More aces"]
    },
    {
      id: "passing-receiving",
      name: "Passing & Serve Receive",
      description: "Master platform passing and serve receive skills",
      difficulty: "beginner",
      coverImage: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1470&auto=format&fit=crop",
      steps: [
        "Start in athletic ready position",
        "Move feet to get body behind the ball",
        "Form solid platform with arms",
        "Angle platform toward target",
        "Absorb ball with minimal arm swing",
        "Follow through slightly toward setter"
      ],
      equipment: ["Volleyball", "Net", "Server or ball machine"],
      duration: "25-35 minutes",
      benefits: ["Better passing rating", "Improved court coverage", "Consistent platform"]
    },
    {
      id: "blocking-fundamentals",
      name: "Blocking Fundamentals",
      description: "Develop blocking footwork, timing, and hand positioning",
      difficulty: "intermediate",
      coverImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1507&auto=format&fit=crop",
      steps: [
        "Start in ready position at net",
        "Use proper footwork (slide or crossover)",
        "Time your jump with the hitter",
        "Extend arms over net at full reach",
        "Angle hands to direct ball down",
        "Seal the block with teammate"
      ],
      equipment: ["Volleyball", "Net", "Hitter or coach"],
      duration: "25-35 minutes",
      benefits: ["More blocks per set", "Better timing and positioning", "Improved hand technique"]
    },
    {
      id: "defensive-digging",
      name: "Defensive Digging",
      description: "Enhance defensive skills, reaction time, and ball control",
      difficulty: "intermediate",
      coverImage: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1470&auto=format&fit=crop",
      steps: [
        "Read the hitter's approach and shoulder",
        "Position yourself in defensive zone",
        "Stay low in athletic stance",
        "React quickly to ball direction",
        "Control platform angle for dig",
        "Pursue every ball with maximum effort"
      ],
      equipment: ["Volleyball", "Net", "Hitters for attack simulation"],
      duration: "30-40 minutes",
      benefits: ["Higher dig percentage", "Better court coverage", "Improved reaction time"]
    }
  ]
};
