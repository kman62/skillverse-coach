
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Video, X, Play } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelected: (file: File) => void;
  className?: string;
}

const VideoUploader = ({ onVideoSelected, className }: VideoUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
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
        processVideoFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      }
    }
  };

  const processVideoFile = (file: File) => {
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
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("w-full", className)}>
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
          Selected: {videoFile.name}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
