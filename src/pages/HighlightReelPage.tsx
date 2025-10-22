import { useState, useRef, useMemo, useEffect } from "react";
import { ReelPreviewModal } from "@/components/highlight-reel/ReelPreviewModal";
import { PlayerDetailsForm } from "@/components/highlight-reel/PlayerDetailsForm";
import { ClipCard } from "@/components/highlight-reel/ClipCard";
import { AnalysisDetailModal } from "@/components/highlight-reel/AnalysisDetailModal";
import { Clip, Feedback, PlayerInfo } from "@/types/reelTypes";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft, Loader2, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { analyzeClip, extractFrameFromVideo } from "@/utils/analysis/videoAnalysisService";
import { generateFeedback } from "@/utils/analysis/feedbackService";

type AppState = 'upload' | 'details' | 'processing' | 'results';

const HighlightReelPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [appState, setAppState] = useState<AppState>('upload');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({ 
    name: '', 
    position: '', 
    jerseyNumber: '' 
  });
  
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectionThreshold, setSelectionThreshold] = useState<number>(7);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [detailedClip, setDetailedClip] = useState<Clip | null>(null);
  
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);

  // Auto-select clips based on threshold
  useEffect(() => {
    if (appState === 'results') {
      setClips(prevClips =>
        prevClips.map(c =>
          c.analysis
            ? { ...c, selected: ((c.analysis.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10) >= selectionThreshold }
            : c
        )
      );
    }
  }, [selectionThreshold, appState]);

  const sortedClips = useMemo(() => {
    return clips.slice().sort((a, b) => 
      (b.analysis?.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) - 
      (a.analysis?.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0)
    );
  }, [clips]);

  const selectedClips = useMemo(() => {
    return clips
      .filter(c => c.selected && c.analysis)
      .sort((a, b) => a.startTime - b.startTime);
  }, [clips]);

  const generateFrame = (video: HTMLVideoElement, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      video.currentTime = time;

      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          reject(new Error('Could not get canvas context.'));
        }
      };

      const onError = () => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        reject(new Error('Video seeking failed.'));
      };

      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onError);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedVideo(file);
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
        setClips([]);
        setFeedback(null);
        setActiveClipId(null);
        setAppState('details');
        
        toast({
          title: "Video uploaded",
          description: file.name,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive"
        });
      }
    }
  };

  const processVideo = async (video: HTMLVideoElement, pInfo: PlayerInfo) => {
    setAppState('processing');
    const duration = video.duration;
    const initialClips: Clip[] = [];

    // Create clips (8 seconds each)
    for (let startTime = 0; startTime < duration; startTime += 8) {
      const endTime = Math.min(startTime + 8, duration);
      if (endTime - startTime < 4) continue; // Skip very short clips

      initialClips.push({
        id: `clip-${Date.now()}-${startTime}`,
        startTime,
        endTime,
        thumbnail: '',
        analysis: null,
        isAnalyzing: true,
        selected: false,
        error: null,
      });
    }
    setClips(initialClips);

    // Process all clips in parallel
    const analysisPromises = initialClips.map(async (clip) => {
      try {
        const thumbnail = await generateFrame(video, clip.startTime + 4);
        const analysis = await analyzeClip(thumbnail, pInfo);

        setClips(prev => prev.map(c => c.id === clip.id ? {
          ...c,
          thumbnail,
          analysis,
          isAnalyzing: false,
          selected: analysis ? ((analysis.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10) >= selectionThreshold : false,
        } : c));
      } catch (error) {
        console.error(`Failed to analyze clip ${clip.id}:`, error);
        setClips(prev => prev.map(c => c.id === clip.id ? {
          ...c,
          isAnalyzing: false,
          error: "Analysis failed. Please try again."
        } : c));
      }
    });

    await Promise.all(analysisPromises);
    setAppState('results');
    
    toast({
      title: "Analysis complete",
      description: `Analyzed ${initialClips.length} clips for ${pInfo.name}`,
    });
  };

  const handleStartAnalysis = () => {
    if (videoRef.current && videoRef.current.duration > 0) {
      processVideo(videoRef.current, playerInfo);
    } else if (videoRef.current) {
      // Wait for video metadata to load
      videoRef.current.onloadedmetadata = () => {
        processVideo(videoRef.current!, playerInfo);
      };
    }
  };

  const playClip = (clip: Clip) => {
    if (!videoRef.current) return;
    setActiveClipId(clip.id);
    videoRef.current.currentTime = clip.startTime;
    videoRef.current.play();

    const onTimeUpdate = () => {
      if (videoRef.current && videoRef.current.currentTime >= clip.endTime) {
        videoRef.current.pause();
        videoRef.current.removeEventListener('timeupdate', onTimeUpdate);
        setActiveClipId(null);
      }
    };
    videoRef.current.addEventListener('timeupdate', onTimeUpdate);
  };

  const toggleClipSelection = (clipId: string) => {
    setClips(prev => prev.map(c => 
      c.id === clipId ? { ...c, selected: !c.selected } : c
    ));
  };

  const handleCompileReel = async () => {
    if (selectedClips.length === 0) {
      toast({
        title: "No clips selected",
        description: "Please select at least one clip to compile",
        variant: "destructive"
      });
      return;
    }

    setIsCompiling(true);
    
    try {
      const analyses = selectedClips.map(c => c.analysis!);
      const generatedFeedback = await generateFeedback(analyses, playerInfo);
      
      if (generatedFeedback) {
        setFeedback(generatedFeedback);
        setIsReelModalOpen(true);
      } else {
        toast({
          title: "Feedback generation failed",
          description: "Unable to generate feedback. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error compiling reel:', error);
      toast({
        title: "Error",
        description: "Failed to compile reel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/sports/basketball')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Basketball
          </Button>
          
          {appState !== 'upload' && (
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={appState === 'processing'}
            />
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Recruiting Reel Analyzer</h1>
          <p className="text-muted-foreground">
            Upload game film, generate clips, and get D1-level AI analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Video player */}
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-lg p-6 flex flex-col">
            {appState === 'upload' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Upload Game Film</h2>
                  <p className="text-muted-foreground max-w-md">
                    Upload your game footage to get started. The AI will analyze your performance and create a recruiting reel.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button onClick={handleUploadClick} size="lg" className="gap-2">
                    <Upload className="w-5 h-5" />
                    Choose Video File
                  </Button>
                </div>
              </div>
            )}

            {appState !== 'upload' && videoSrc && (
              <div className="flex-1 flex flex-col space-y-4">
                <video 
                  ref={videoRef} 
                  src={videoSrc} 
                  controls 
                  className="w-full rounded-lg aspect-video bg-black"
                >
                  Your browser does not support the video tag.
                </video>

                {uploadedVideo && (
                  <p className="text-sm text-muted-foreground">
                    {uploadedVideo.name} ({(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}

                {appState === 'details' && (
                  <PlayerDetailsForm
                    playerInfo={playerInfo}
                    onPlayerInfoChange={setPlayerInfo}
                    onStartAnalysis={handleStartAnalysis}
                  />
                )}

                {appState === 'processing' && (
                  <div className="flex flex-col items-center justify-center gap-3 p-6 bg-card/50 rounded-lg border">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-lg font-semibold">AI is analyzing your video for {playerInfo.name}...</p>
                    <p className="text-sm text-muted-foreground">
                      This may take a few moments. Clips will appear as they are processed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Analysis workbench */}
          <div className="bg-card rounded-xl border shadow-lg p-6 flex flex-col max-h-[85vh]">
            <h2 className="text-2xl font-bold border-b pb-3 mb-4">Analysis Workbench</h2>
            
            {playerInfo.name && appState !== 'upload' && (
              <p className="text-sm text-muted-foreground mb-4">
                Scouting Report for: <span className="font-bold text-foreground">{playerInfo.name} (#{playerInfo.jerseyNumber}) - {playerInfo.position}</span>
              </p>
            )}

            {appState === 'results' && (
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <Label className="text-sm font-medium mb-2 block">
                  Auto-select clips with score ≥ <span className="font-bold text-primary">{selectionThreshold}/10</span>
                </Label>
                <Slider
                  value={[selectionThreshold]}
                  onValueChange={(vals) => setSelectionThreshold(vals[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-4">
              {sortedClips.map(clip => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  isActive={activeClipId === clip.id}
                  onPlay={() => playClip(clip)}
                  onToggleSelect={() => toggleClipSelection(clip.id)}
                  onShowDetails={() => setDetailedClip(clip)}
                />
              ))}
              {clips.length === 0 && appState === 'results' && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>There was an issue processing the video. Please try a different file.</p>
                </div>
              )}
            </div>

            {appState === 'results' && (
              <div className="pt-4 border-t">
                <h3 className="text-xl font-bold mb-2">Recruiting Reel</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedClips.length} clip{selectedClips.length !== 1 ? 's' : ''} selected
                </p>
                <Button 
                  onClick={handleCompileReel} 
                  disabled={isCompiling || selectedClips.length === 0}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Compiling...
                    </>
                  ) : (
                    <>
                      <Film className="w-5 h-5" />
                      Compile Reel & Get Feedback
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <AnalysisDetailModal
          isOpen={!!detailedClip}
          onClose={() => setDetailedClip(null)}
          clip={detailedClip}
        />

        <ReelPreviewModal
          isOpen={isReelModalOpen}
          onClose={() => setIsReelModalOpen(false)}
          videoSrc={videoSrc}
          selectedClips={selectedClips}
          feedback={feedback}
        />
      </div>
    </div>
  );
};

export default HighlightReelPage;
