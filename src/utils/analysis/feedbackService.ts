import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/types/reelTypes";
import { HighlightReelAnalysis } from "@/types/highlightReel";

interface PlayerInfo {
  name: string;
  position: string;
  jerseyNumber: string;
}

export const generateFeedback = async (
  analyses: HighlightReelAnalysis[],
  playerInfo: PlayerInfo
): Promise<Feedback | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-feedback', {
      body: { analyses, playerInfo }
    });

    if (error) throw error;
    return data as Feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    return null;
  }
};
