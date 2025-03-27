
import { Sport } from "../types/sports";

export const FOOTBALL: Sport = {
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
  ],
  teamAnalysis: [
    {
      id: "passing-offense",
      name: "Passing Offense Breakdown",
      description: "Analyze route combinations, quarterback reads, and timing in the passing game",
      coverImage: "https://images.unsplash.com/photo-1596332978753-58916187c0a2?q=80&w=1600&auto=format&fit=crop",
      players: 11,
      duration: "25-35 min"
    },
    {
      id: "defensive-coverage",
      name: "Defensive Coverage Analysis",
      description: "Evaluate coverage assignments, communication, and reaction to offensive formations",
      coverImage: "https://images.unsplash.com/photo-1493171681599-82c9321a0d1b?q=80&w=1600&auto=format&fit=crop",
      players: 11,
      duration: "20-30 min"
    }
  ]
};
