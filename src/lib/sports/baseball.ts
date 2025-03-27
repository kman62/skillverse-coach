
import { Sport } from "../types/sports";

export const BASEBALL: Sport = {
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
  ],
  teamAnalysis: [
    {
      id: "batting-practice",
      name: "Team Batting Practice",
      description: "Analyze batting mechanics and hitting approach across the lineup",
      coverImage: "https://images.unsplash.com/photo-1543468707-8ba78357cac7?q=80&w=1600&auto=format&fit=crop",
      players: 9,
      duration: "30-45 min"
    },
    {
      id: "infield-defense",
      name: "Infield Defense Coordination",
      description: "Evaluate double play timing, field coverage, and defensive shifts",
      coverImage: "https://images.unsplash.com/photo-1589956861092-bc5ad1ef06e9?q=80&w=1600&auto=format&fit=crop",
      players: 6,
      duration: "20-30 min"
    }
  ]
};
