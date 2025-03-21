
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Video, X, Play, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Max file size: 50MB (Supabase default limit)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  className?: string;
}

const VideoUploader = ({ onVideoSelected, className }: VideoUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        validateAndProcessFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        validateAndProcessFile(file);
      }
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round(file.size / (1024 * 1024));
      setSizeError(`Video size (${sizeMB}MB) exceeds the maximum allowed size of 50MB. Please select a smaller video.`);
      return;
    }
    
    // Clear any previous errors
    setSizeError(null);
    
    // Process the file
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    onVideoSelected(file);
  };

  const clearVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setVideoFile(null);
    setSizeError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className={cn("w-full", className)}>
      {sizeError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{sizeError}</AlertDescription>
        </Alert>
      )}

      {!videoPreview ? (
        <div 
          className={cn(
            "relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-lg transition-all duration-300 bg-card",
            dragActive ? "border-primary/50 bg-primary/5" : "border-border",
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={inputRef}
            type="file" 
            accept="video/*" 
            onChange={handleChange} 
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Video size={24} className="text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Upload your video</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Drag and drop your video here, or click to browse files
            </p>
            <button
              type="button"
              onClick={triggerFileSelect}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center"
            >
              <Upload size={18} className="mr-2" />
              Select Video
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              Maximum file size: 50MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <video 
            src={videoPreview} 
            controls
            className="w-full h-auto rounded-lg"
          />
          
          <button 
            onClick={clearVideo}
            className="absolute top-3 right-3 h-8 w-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            aria-label="Remove video"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {videoFile && (
        <div className="mt-2 text-sm text-muted-foreground">
          Selected: {videoFile.name} ({formatFileSize(videoFile.size)})
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
