
import { Sport } from "../types/sports";

export const TENNIS: Sport = {
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
  ],
  teamAnalysis: [
    {
      id: "doubles-positioning",
      name: "Doubles Positioning",
      description: "Analyze court coverage, positioning strategies, and partner communication in doubles play",
      coverImage: "https://images.unsplash.com/photo-1551889885-43a62f30d5f1?q=80&w=1600&auto=format&fit=crop",
      players: 4,
      duration: "30-45 min"
    },
    {
      id: "mixed-doubles-strategy",
      name: "Mixed Doubles Strategy",
      description: "Evaluate serving patterns, return positioning, and net play tactics in mixed doubles",
      coverImage: "https://images.unsplash.com/photo-1622279488168-bacd37e2d47f?q=80&w=1600&auto=format&fit=crop",
      players: 4,
      duration: "25-35 min"
    }
  ]
};
