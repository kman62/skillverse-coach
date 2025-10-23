import React, { useRef, useEffect, useState } from 'react';
import type { Clip, Feedback } from '@/types/reelTypes';
import ReactMarkdown from 'react-markdown';
import { Clipboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string | null;
  selectedClips: Clip[];
  feedback: Feedback | null;
}

export const ReelPreviewModal: React.FC<ReelPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  videoSrc, 
  selectedClips, 
  feedback 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [copyButtonText, setCopyButtonText] = useState('Copy Timestamps');
  const [selectedClipForInfo, setSelectedClipForInfo] = useState<Clip | null>(null);

  useEffect(() => {
    if (!isOpen) {
      videoRef.current?.pause();
      return;
    }

    setCurrentClipIndex(0);
    
    const video = videoRef.current;
    if (!video || selectedClips.length === 0) return;

    const playNextClip = (index: number) => {
      if (index >= selectedClips.length) {
        video.pause();
        return;
      }
      const clip = selectedClips[index];
      video.currentTime = clip.startTime;
      video.play().catch(e => console.error("Playback failed:", e));
    };

    const handleTimeUpdate = () => {
      if (!video) return;
      const currentClip = selectedClips[currentClipIndex];
      if (currentClip && video.currentTime >= currentClip.endTime) {
        const nextIndex = currentClipIndex + 1;
        setCurrentClipIndex(nextIndex);
        if (nextIndex < selectedClips.length) {
          playNextClip(nextIndex);
        } else {
          video.pause();
        }
      }
    };

    playNextClip(0);

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isOpen, selectedClips, currentClipIndex]);

  const handleCopyTimestamps = () => {
    const textToCopy = selectedClips.map((clip, index) => (
      `Clip ${index + 1} (${clip.startTime.toFixed(1)}s - ${clip.endTime.toFixed(1)}s):\nScore: ${((clip.analysis?.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10).toFixed(1)}/10\nInsight: ${clip.analysis?.integrated_insight?.summary ?? 'N/A'}`
    )).join('\n\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Timestamps'), 2000);
    }).catch(err => {
      console.error('Failed to copy timestamps:', err);
      alert('Failed to copy timestamps.');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Recruiting Reel</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          <div>
            <video 
              ref={videoRef} 
              src={videoSrc || ''} 
              controls 
              className="w-full rounded-lg aspect-video bg-black"
            >
              Your browser does not support the video tag.
            </video>
            
            <div className="mt-4">
              <Button 
                onClick={handleCopyTimestamps} 
                className="w-full gap-2"
                variant="secondary"
              >
                <Clipboard className="h-5 w-5" />
                {copyButtonText}
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Selected Clips</h4>
              {selectedClips.map((clip, index) => (
                <div 
                  key={clip.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentClipIndex === index 
                      ? 'bg-primary/10 border-primary' 
                      : selectedClipForInfo?.id === clip.id
                      ? 'bg-muted border-primary/50'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => setSelectedClipForInfo(clip)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Clip {index + 1}</span>
                    <span className="text-sm text-muted-foreground">
                      {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                    </span>
                  </div>
                  {clip.analysis && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Score: {((clip.analysis.integrated_insight.correlation_metrics.intangibles_overall_score) * 10).toFixed(1)}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {selectedClipForInfo && (
              <div className="mt-4 p-4 bg-card border rounded-lg">
                <h4 className="font-semibold text-sm mb-3 flex items-center justify-between">
                  <span>Clip Details</span>
                  <button 
                    onClick={() => setSelectedClipForInfo(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time:</span>
                    <span className="font-medium">{selectedClipForInfo.startTime.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Time:</span>
                    <span className="font-medium">{selectedClipForInfo.endTime.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{(selectedClipForInfo.endTime - selectedClipForInfo.startTime).toFixed(2)}s</span>
                  </div>
                  {(selectedClipForInfo.analysis as any)?.shotType && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shot Type:</span>
                      <span className="font-medium">{(selectedClipForInfo.analysis as any).shotType}</span>
                    </div>
                  )}
                  {(selectedClipForInfo.analysis as any)?.outcome && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Result:</span>
                      <span className={`font-medium ${(selectedClipForInfo.analysis as any).outcome === 'success' ? 'text-green-500' : 'text-orange-500'}`}>
                        {(selectedClipForInfo.analysis as any).outcome === 'success' ? 'Made' : 'Missed'}
                      </span>
                    </div>
                  )}
                  {selectedClipForInfo.analysis && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall Score:</span>
                      <span className="font-bold text-primary">
                        {((selectedClipForInfo.analysis.integrated_insight.correlation_metrics.intangibles_overall_score) * 10).toFixed(1)}/10
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {feedback ? (
              <>
                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1 w-12 bg-primary rounded-full" />
                    <h4 className="font-bold text-xl text-primary">For the Athlete</h4>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                        li: ({ children }) => <li className="text-base">{children}</li>,
                      }}
                    >
                      {feedback.athlete}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="bg-card rounded-lg border shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1 w-12 bg-blue-500 rounded-full" />
                    <h4 className="font-bold text-xl text-blue-500">For Parents</h4>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-blue-500">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                        li: ({ children }) => <li className="text-base">{children}</li>,
                      }}
                    >
                      {feedback.parents}
                    </ReactMarkdown>
                  </div>
                </div>

                {feedback.coach && (
                  <div className="bg-card rounded-lg border shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-12 bg-green-500 rounded-full" />
                      <h4 className="font-bold text-xl text-green-500">Coach Notes</h4>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-green-500">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                          li: ({ children }) => <li className="text-base">{children}</li>,
                        }}
                      >
                        {feedback.coach}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Feedback is being generated...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
