import { HighlightReelAnalysis } from './highlightReel';

export interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  analysis?: HighlightReelAnalysis;
  thumbnail?: string;
}

export interface Feedback {
  athlete: string;
  parents: string;
  coach?: string;
}
