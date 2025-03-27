
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
