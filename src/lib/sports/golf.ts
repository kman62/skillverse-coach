
import { Sport } from "../types/sports";

export const GOLF: Sport = {
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
  ],
  teamAnalysis: [
    {
      id: "foursome-strategy",
      name: "Foursome Strategy Analysis",
      description: "Analyze course management, shot selection, and partner dynamics in foursome format",
      coverImage: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1600&auto=format&fit=crop",
      players: 4,
      duration: "3-4 hours"
    },
    {
      id: "best-ball-tactics",
      name: "Best Ball Team Tactics",
      description: "Evaluate risk management, complementary play styles, and strategic decision-making in best ball format",
      coverImage: "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=1600&auto=format&fit=crop",
      players: 4,
      duration: "3-4 hours"
    }
  ]
};
