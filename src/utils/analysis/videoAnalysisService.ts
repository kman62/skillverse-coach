import { supabase } from '@/integrations/supabase/client';

export interface PlayerInfo {
  name: string;
  jerseyNumber: string;
  position: string;
}

export const analyzeClip = async (frameData: string, playerInfo: PlayerInfo) => {
  console.log('🎬 [analyzeClip] Starting analysis for:', playerInfo.name, '#' + playerInfo.jerseyNumber);
  console.log('🎬 [analyzeClip] Frame data size:', (frameData.length / 1024).toFixed(2), 'KB');
  
  try {
    const startTime = Date.now();
    console.log('🎬 [analyzeClip] Invoking edge function...');
    
    const { data, error } = await supabase.functions.invoke('analyze-clip', {
      body: { frameData, playerInfo }
    });

    const duration = Date.now() - startTime;
    console.log(`🎬 [analyzeClip] Edge function returned in ${duration}ms`);

    if (error) {
      console.error('❌ [analyzeClip] Edge function error:', error);
      console.error('❌ [analyzeClip] Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    if (!data || !data.analysis) {
      console.error('❌ [analyzeClip] No analysis data returned');
      throw new Error('No analysis data received');
    }

    console.log('✅ [analyzeClip] Analysis successful');
    console.log('✅ [analyzeClip] Detected position:', data.analysis.detectedPosition);
    console.log('✅ [analyzeClip] Play type:', data.analysis.play_context?.play_type);
    
    return data.analysis;
  } catch (error) {
    console.error('❌ [analyzeClip] Fatal error:', error);
    console.error('❌ [analyzeClip] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const extractFrameFromVideo = async (videoFile: File): Promise<string> => {
  console.log('🎥 [extractFrame] Extracting frame from video:', videoFile.name);
  console.log('🎥 [extractFrame] Video size:', (videoFile.size / 1024 / 1024).toFixed(2), 'MB');
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      console.log('🎥 [extractFrame] Video metadata loaded');
      console.log('🎥 [extractFrame] Dimensions:', video.videoWidth, 'x', video.videoHeight);
      console.log('🎥 [extractFrame] Duration:', video.duration.toFixed(2), 's');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to middle of video
      const seekTime = video.duration / 2;
      console.log('🎥 [extractFrame] Seeking to:', seekTime.toFixed(2), 's');
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      console.log('🎥 [extractFrame] Video seeked successfully');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL('image/jpeg', 0.8);
        console.log('✅ [extractFrame] Frame extracted, size:', (frameData.length / 1024).toFixed(2), 'KB');
        resolve(frameData);
      } else {
        console.error('❌ [extractFrame] Could not get canvas context');
        reject(new Error('Could not get canvas context'));
      }
    };

    video.onerror = (e) => {
      console.error('❌ [extractFrame] Video error:', e);
      reject(new Error('Error loading video'));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};
