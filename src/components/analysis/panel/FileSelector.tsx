
import React from 'react';
import { FileVideo, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileSelectorProps {
  videoFile: File | null;
  onVideoSelected: (file: File) => void;
  disabled?: boolean;
}

const FileSelector = ({ 
  videoFile, 
  onVideoSelected,
  disabled = false
}: FileSelectorProps) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoSelected(file);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {videoFile ? (
        <div className="flex items-center">
          <FileVideo className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm truncate max-w-[200px]">{videoFile.name}</span>
        </div>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2 text-gray-500" />
          <span>Upload a video file</span>
        </>
      )}
      <Input
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      <label
        htmlFor="video-upload"
        className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {videoFile ? 'Change Video' : 'Select Video'}
      </label>
    </div>
  );
};

export default FileSelector;
