
import { Sport } from "../types/sports";

export const SOCCER: Sport = {
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
  ],
  teamAnalysis: [
    {
      id: "attacking-patterns",
      name: "Team Attacking Patterns",
      description: "Analyze build-up play, attacking movements, and final third decision-making",
      coverImage: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1600&auto=format&fit=crop",
      players: 11,
      duration: "25-35 min"
    },
    {
      id: "defensive-organization",
      name: "Defensive Organization",
      description: "Evaluate defensive shape, pressing triggers, and recovery runs when out of possession",
      coverImage: "https://images.unsplash.com/photo-1560159010-8baaa2d73fd2?q=80&w=1600&auto=format&fit=crop",
      players: 11,
      duration: "20-30 min"
    }
  ]
};
