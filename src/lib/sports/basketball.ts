
import { Sport } from "../types/sports";

export const BASKETBALL: Sport = {
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
};
