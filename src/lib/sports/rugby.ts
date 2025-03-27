
import { Sport } from "../types/sports";

export const RUGBY: Sport = {
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
      coverImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1600&auto=format&fit=crop",
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
      coverImage: "https://images.unsplash.com/photo-1569074187119-c87815b476da?q=80&w=1600&auto=format&fit=crop",
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
      coverImage: "https://images.unsplash.com/photo-1580980407668-7c61bfdf04a0?q=80&w=1600&auto=format&fit=crop",
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
      coverImage: "https://images.unsplash.com/photo-1591491655675-95314c9cb3a6?q=80&w=1600&auto=format&fit=crop",
      players: 16,
      duration: "15-20 min"
    },
    {
      id: "lineout-analysis",
      name: "Lineout Organization",
      description: "Evaluate lineout calls, timing, lifting technique and throw accuracy",
      coverImage: "https://images.unsplash.com/photo-1583506727849-da2964e9d9d8?q=80&w=1600&auto=format&fit=crop",
      players: 8,
      duration: "10-15 min"
    }
  ]
};
