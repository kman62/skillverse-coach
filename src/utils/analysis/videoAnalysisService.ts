import { supabase } from '@/integrations/supabase/client';

export interface PlayerInfo {
  name: string;
  jerseyNumber: string;
  position: string;
}

export const analyzeClip = async (frameData: string, playerInfo: PlayerInfo) => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-clip', {
      body: { frameData, playerInfo }
    });

    if (error) {
      console.error('Error calling analyze-clip function:', error);
      throw error;
    }

    return data.analysis;
  } catch (error) {
    console.error('Error analyzing clip:', error);
    throw error;
  }
};

export const extractFrameFromVideo = async (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to middle of video
      video.currentTime = video.duration / 2;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.8);
        resolve(frameData);
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };

    video.onerror = () => {
      reject(new Error('Error loading video'));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};
