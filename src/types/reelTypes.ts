import { HighlightReelAnalysis } from './highlightReel';

export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  analysis: HighlightReelAnalysis | null;
  thumbnail?: string;
  isAnalyzing?: boolean;
  selected?: boolean;
  error?: string | null;
}

export interface PlayerInfo {
  name: string;
  position: string;
  jerseyNumber: string;
  sport: 'basketball' | 'baseball' | 'football' | 'soccer' | 'volleyball' | 'tennis' | 'golf' | 'rugby';
}

export interface Feedback {
  athlete: string;
  parents: string;
  coach?: string;
}
