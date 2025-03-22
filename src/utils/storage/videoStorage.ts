
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { MAX_FILE_SIZE } from '../constants/fileConfig';

/**
 * Upload a video file to Supabase storage
 */
export const uploadVideoToStorage = async (
  videoFile: File,
  userId: string
): Promise<{ success: boolean; videoUrl: string; error?: Error }> => {
  try {
    // Check file size before attempting to upload
    if (videoFile.size > MAX_FILE_SIZE) {
      throw new Error(`Video file size (${Math.round(videoFile.size / (1024 * 1024))}MB) exceeds the 50MB limit.`);
    }
    
    console.log("Starting video upload to Supabase storage...");
    
    // Create a properly formatted filename with user ID as the folder
    const cleanFileName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const videoFileName = `${userId}/${uuidv4()}-${cleanFileName}`;
    
    // Log complete storage path for debugging
    console.log(`Uploading to storage path: videos/${videoFileName}`);
    
    // Upload the video file
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error("Error uploading video to Supabase:", uploadError);
      console.error("Upload error details:", {
        message: uploadError.message,
        errorName: uploadError.name,
        error: uploadError
      });
      
      if (uploadError.message.includes('bucket_id_name_pkey')) {
        throw new Error('Storage bucket not found. Please check your Supabase configuration.');
      } else if (uploadError.message.includes('not authenticated')) {
        throw new Error('Authentication error. Please sign in again.');
      } else {
        throw new Error(`Error uploading video: ${uploadError.message}`);
      }
    }
    
    console.log("Video uploaded successfully:", uploadData?.path);
    
    // Get public URL for the uploaded video
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName);
    
    console.log("Video public URL:", publicUrl);
    
    return { success: true, videoUrl: publicUrl };
  } catch (error) {
    console.error('Error in uploadVideoToStorage:', error);
    return {
      success: false,
      videoUrl: '',
      error: error instanceof Error ? error : new Error('Unknown error during upload')
    };
  }
};
