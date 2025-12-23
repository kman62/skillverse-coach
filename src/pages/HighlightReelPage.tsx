import { useState, useRef, useMemo, useEffect } from "react";
import { ReelPreviewModal } from "@/components/highlight-reel/ReelPreviewModal";
import { PlayerDetailsForm } from "@/components/highlight-reel/PlayerDetailsForm";
import { ClipCard } from "@/components/highlight-reel/ClipCard";
import { AnalysisDetailModal } from "@/components/highlight-reel/AnalysisDetailModal";
import { Clip, Feedback, PlayerInfo } from "@/types/reelTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft, Loader2, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeClip, extractFrameFromVideo } from "@/utils/analysis/videoAnalysisService";
import { generateFeedback } from "@/utils/analysis/feedbackService";

type AppState = 'upload' | 'details' | 'processing' | 'results';

const HighlightReelPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [appState, setAppState] = useState<AppState>('upload');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({ 
    name: '', 
    position: '', 
    jerseyNumber: '',
    jerseyColor: '',
    sport: 'basketball',
    analysisMode: 'bulk',
    analysisType: 'individual'
  });
  
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectionThreshold, setSelectionThreshold] = useState<number>(7);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [detailedClip, setDetailedClip] = useState<Clip | null>(null);
  
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  
  // Progress tracking
  const [processingProgress, setProcessingProgress] = useState({ processed: 0, total: 0, failed: 0 });
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [backoffCountdown, setBackoffCountdown] = useState<number | null>(null);
  const [currentBackoffDelay, setCurrentBackoffDelay] = useState(2000); // Start with 2 seconds

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

  const generateFrameFromSrc = (src: string, time: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const videoEl = document.createElement('video');
      const canvas = document.createElement('canvas');
      videoEl.preload = 'auto';
      videoEl.muted = true; // allow programmatic play/seek in some browsers
      videoEl.src = src;

      const cleanup = () => {
        videoEl.removeEventListener('loadedmetadata', onLoaded);
        videoEl.removeEventListener('seeked', onSeeked);
        videoEl.removeEventListener('error', onError);
      };

      const onLoaded = () => {
        const target = Math.min(Math.max(time, 0), videoEl.duration || time);
        videoEl.currentTime = isFinite(target) ? target : 0;
      };

      const onSeeked = () => {
        cleanup();
        canvas.width = videoEl.videoWidth || 1280;
        canvas.height = videoEl.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          reject(new Error('Could not get canvas context.'));
        }
      };

      const onError = () => {
        cleanup();
        reject(new Error('Video seeking failed.'));
      };

      videoEl.addEventListener('loadedmetadata', onLoaded);
      videoEl.addEventListener('seeked', onSeeked);
      videoEl.addEventListener('error', onError);
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
    console.log('🚀 [processVideo] Starting video processing');
    console.log(`🚀 [processVideo] Player: ${pInfo.name} #${pInfo.jerseyNumber} Position: ${pInfo.position}`);
    console.log(`🚀 [processVideo] Video duration: ${video.duration.toFixed(2)} s`);

    const clipDuration = 8;
    const maxClipsPerVideo = 60; // Limit to 60 clips per video per hour
    const numClips = Math.min(Math.ceil(video.duration / clipDuration), maxClipsPerVideo);
    
    if (Math.ceil(video.duration / clipDuration) > maxClipsPerVideo) {
      console.log(`⚠️ [processVideo] Video would generate ${Math.ceil(video.duration / clipDuration)} clips, limiting to ${maxClipsPerVideo}`);
      toast({
        title: "Clip limit applied",
        description: `Video limited to ${maxClipsPerVideo} clips per hour. Only the first ${maxClipsPerVideo} clips will be analyzed.`,
      });
    }
    
    console.log(`🚀 [processVideo] Created ${numClips} clips`);

    const initialClips: Clip[] = Array.from({ length: numClips }, (_, i) => ({
      id: `clip-${i + 1}`,
      startTime: i * clipDuration,
      endTime: Math.min((i + 1) * clipDuration, video.duration),
      thumbnail: '',
      selected: false,
      isAnalyzing: true,
      analysis: null,
    }));

    setClips(initialClips);
    setAppState('processing');
    setProcessingProgress({ processed: 0, total: numClips, failed: 0 });
    setRateLimitHit(false);
    setBackoffCountdown(null);

    let baseDelay = 2000; // Start with 2 seconds between requests
    let backoffMultiplier = 1;
    const startTime = Date.now();
    let processedCount = 0;
    let failedCount = 0;
    let consecutiveRateLimits = 0;

    console.log(`⏱️ [processVideo] Processing sequentially with ${baseDelay}ms base delay between clips`);
    console.log(`⏱️ [processVideo] Estimated time: ${Math.ceil((numClips * baseDelay) / 1000 / 60)} minutes`);

    // Countdown helper function
    const startCountdown = (seconds: number): Promise<void> => {
      return new Promise((resolve) => {
        let remaining = seconds;
        setBackoffCountdown(remaining);
        
        const interval = setInterval(() => {
          remaining--;
          setBackoffCountdown(remaining);
          
          if (remaining <= 0) {
            clearInterval(interval);
            setBackoffCountdown(null);
            resolve();
          }
        }, 1000);
      });
    };

    // Process clips sequentially with backoff
    for (let i = 0; i < initialClips.length; i++) {
      const clip = initialClips[i];
      const clipNumber = i + 1;
      console.log(`\n📊 [Clip ${clipNumber}/${numClips}] Processing ${clip.startTime.toFixed(1)}s - ${clip.endTime.toFixed(1)}s`);

      // Reset backoff on successful requests
      if (consecutiveRateLimits > 0 && i > 0) {
        console.log(`✅ Resetting backoff after successful request`);
        consecutiveRateLimits = 0;
        backoffMultiplier = 1;
        setCurrentBackoffDelay(baseDelay);
      }

      let retryCount = 0;
      let success = false;

      while (!success && retryCount < 5) { // Max 5 retries per clip
        try {
          // Generate thumbnail
          console.log(`📊 [Clip ${clipNumber}] Generating thumbnail...`);
          const midpoint = (clip.startTime + clip.endTime) / 2;
          const thumbnail = await generateFrameFromSrc(videoSrc!, midpoint);

          // Extract frame for AI analysis
          const frameData = await extractFrameFromVideo(uploadedVideo!);
          
          // Call AI analysis
          console.log(`📊 [Clip ${clipNumber}] Calling AI analysis (${pInfo.analysisMode} mode) - attempt ${retryCount + 1}...`);
          const analysis = await analyzeClip(frameData, {
            name: pInfo.name,
            jerseyNumber: pInfo.jerseyNumber,
            position: pInfo.position || 'auto-detect',
            sport: pInfo.sport,
            analysisMode: pInfo.analysisMode
          });

          console.log(`✅ [Clip ${clipNumber}] AI analysis complete`);

          // Auto-detect position from first clip analysis
          if (analysis && 'detectedPosition' in analysis && analysis.detectedPosition && !pInfo.position) {
            console.log(`🎯 [Clip ${clipNumber}] Auto-detected position:`, analysis.detectedPosition);
            setPlayerInfo(prev => ({ ...prev, position: analysis.detectedPosition as string }));
          }

          const score = (analysis.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10;
          console.log(`📊 [Clip ${clipNumber}] Score: ${score.toFixed(1)}`);

          setClips(prev => prev.map(c => c.id === clip.id ? {
            ...c,
            thumbnail,
            analysis,
            isAnalyzing: false,
            selected: ((analysis.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10) >= selectionThreshold,
          } : c));

          processedCount++;
          success = true;

        } catch (error) {
          console.error(`❌ [Clip ${clipNumber}] Attempt ${retryCount + 1} failed:`, error);
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const isRateLimitError = errorMessage.includes('Rate limit exceeded') || errorMessage.includes('429');
          
          if (isRateLimitError) {
            consecutiveRateLimits++;
            backoffMultiplier = Math.min(Math.pow(2, consecutiveRateLimits), 32); // Cap at 64 seconds
            const backoffTime = Math.floor((baseDelay * backoffMultiplier) / 1000);
            
            console.log(`⚠️ [Clip ${clipNumber}] Rate limit hit (${consecutiveRateLimits} consecutive). Backing off for ${backoffTime}s...`);
            setRateLimitHit(true);
            setCurrentBackoffDelay(baseDelay * backoffMultiplier);
            
            if (retryCount < 4) { // Don't show toast on final retry
              toast({
                title: `Rate Limit Hit - Retrying`,
                description: `Backing off for ${backoffTime} seconds before retry ${retryCount + 2}/5`,
                variant: "destructive",
              });
              
              // Wait with countdown
              await startCountdown(backoffTime);
              retryCount++;
            } else {
              // Final failure
              console.log(`❌ [Clip ${clipNumber}] Max retries exceeded, skipping clip`);
              
              const thumbnail = await generateFrameFromSrc(videoSrc!, (clip.startTime + clip.endTime) / 2);
              setClips(prev => prev.map(c => c.id === clip.id ? {
                ...c,
                thumbnail,
                isAnalyzing: false,
                error: 'Rate limit - max retries exceeded',
              } : c));
              
              failedCount++;
              break;
            }
          } else {
            // Non-rate limit error - generate thumbnail and mark as failed
            try {
              const midpoint = (clip.startTime + clip.endTime) / 2;
              const thumbnail = await generateFrameFromSrc(videoSrc!, midpoint);
              
              setClips(prev => prev.map(c => c.id === clip.id ? {
                ...c,
                thumbnail,
                isAnalyzing: false,
                error: 'Analysis failed',
              } : c));
            } catch {
              setClips(prev => prev.map(c => c.id === clip.id ? {
                ...c,
                isAnalyzing: false,
                error: 'Analysis failed',
              } : c));
            }
            
            failedCount++;
            break;
          }
        }
      }

      // Update progress
      const elapsed = Date.now() - startTime;
      const avgTimePerClip = elapsed / (processedCount + failedCount);
      const remaining = numClips - processedCount - failedCount;
      const eta = avgTimePerClip * remaining;
      
      setProcessingProgress({ processed: processedCount, total: numClips, failed: failedCount });
      setEstimatedTimeRemaining(eta);

      console.log(`📊 [Progress] Processed: ${processedCount}/${numClips}, Failed: ${failedCount}, ETA: ${Math.ceil(eta/1000)}s`);

      // Add delay before next request (except for last clip)
      if (i < initialClips.length - 1) {
        const currentDelay = Math.max(baseDelay, currentBackoffDelay);
        console.log(`⏱️ Waiting ${currentDelay}ms before next clip...`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    console.log(`✅ [processVideo] Processing complete. Processed: ${processedCount}, Failed: ${failedCount}`);
    setAppState('results');
    setEstimatedTimeRemaining(null);
    setBackoffCountdown(null);
    setRateLimitHit(false);
    
    if (failedCount > 0) {
      toast({
        title: "Processing Complete with Issues",
        description: `Analyzed ${processedCount} clips successfully. ${failedCount} clips failed after retries.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed all ${processedCount} clips for ${pInfo.name}`,
      });
    }
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
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate feedback",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

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
              onClick={() => navigate(`/sports/${playerInfo.sport || 'basketball'}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {playerInfo.sport ? playerInfo.sport.charAt(0).toUpperCase() + playerInfo.sport.slice(1) : 'Basketball'}
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left side - Video player */}
          <div className="lg:col-span-3 bg-card rounded-xl border shadow-lg p-6 flex flex-col">
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
                  <div className="flex flex-col gap-4 p-6 bg-card/50 rounded-lg border">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <p className="text-lg font-semibold">AI is analyzing your video for {playerInfo.name}...</p>
                    </div>
                    
                    {/* Progress Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{processingProgress.processed}</div>
                        <div className="text-xs text-muted-foreground">Analyzed</div>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-2xl font-bold text-muted-foreground">{processingProgress.total - processingProgress.processed - processingProgress.failed}</div>
                        <div className="text-xs text-muted-foreground">Remaining</div>
                      </div>
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-2xl font-bold text-destructive">{processingProgress.failed}</div>
                        <div className="text-xs text-muted-foreground">Failed</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {Math.round((processingProgress.processed / processingProgress.total) * 100)}% Complete
                        </span>
                        {backoffCountdown ? (
                          <span className="text-destructive font-medium">
                            Resuming in {backoffCountdown}s
                          </span>
                        ) : estimatedTimeRemaining && (
                          <span className="text-muted-foreground">
                            ETA: {Math.ceil(estimatedTimeRemaining / 1000)}s
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${(processingProgress.processed / processingProgress.total) * 100}%` }}
                        />
                      </div>
                      {backoffCountdown && (
                        <div className="text-xs text-muted-foreground">
                          Rate limit hit - using incremental backoff to retry automatically
                        </div>
                      )}
                    </div>
                    
                    {/* Backoff Info */}
                    {rateLimitHit && backoffCountdown && (
                      <div className="bg-warning/10 border border-warning rounded-lg p-4">
                        <h3 className="font-semibold text-warning mb-2">🔄 Auto-Retry in Progress</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Hit rate limit - automatically retrying with incremental backoff. Resuming in {backoffCountdown} seconds.
                        </p>
                      </div>
                    )}
                    
                    {/* Rate Limit Actions */}
                    {rateLimitHit && !backoffCountdown && processingProgress.failed > 0 && (
                      <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                        <h3 className="font-semibold text-destructive mb-2">⚠️ Some Clips Failed</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {processingProgress.failed} clips failed after multiple retry attempts.
                        </p>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Use demo analysis for remaining clips
                              setClips(prev => prev.map(c => {
                                if (c.isAnalyzing || c.error === 'Rate limit') {
                                  return {
                                    ...c,
                                    isAnalyzing: false,
                                    error: undefined,
                                    analysis: {
                                      metadata: {
                                        video_id: '',
                                        team: '',
                                        opponent: '',
                                        game_date: new Date().toISOString(),
                                        clip_start_time: c.startTime.toString(),
                                        clip_end_time: c.endTime.toString(),
                                        analyst: 'Demo Mode',
                                        source_method: ['computer_vision' as const]
                                      },
                                      play_context: {
                                        play_type: 'other' as const,
                                        possession_phase: 'offense' as const,
                                        formation: 'Demo',
                                        situation: 'live_play' as const
                                      },
                                      tangible_performance: {
                                        actions: [],
                                        overall_summary: { 
                                          execution_quality: 0.75,
                                          decision_accuracy: 0.75,
                                          spacing_index: 0.75,
                                          transition_speed_sec: 0
                                        }
                                      },
                                      intangible_performance: {
                                        courage: { 
                                          definition: 'Demo',
                                          observed_instances: 0,
                                          successful_instances: 0,
                                          percentage_correct: 75,
                                          qualitative_example: 'Demo mode' 
                                        },
                                        composure: { 
                                          definition: 'Demo',
                                          observed_instances: 0,
                                          successful_instances: 0,
                                          percentage_correct: 75,
                                          qualitative_example: 'Demo mode' 
                                        },
                                        initiative: { 
                                          definition: 'Demo',
                                          observed_instances: 0,
                                          successful_instances: 0,
                                          percentage_correct: 75,
                                          qualitative_example: 'Demo mode' 
                                        },
                                        leadership: { 
                                          definition: 'Demo',
                                          observed_instances: 0,
                                          successful_instances: 0,
                                          percentage_correct: 75,
                                          qualitative_example: 'Demo mode' 
                                        },
                                        effectiveness_under_stress: { 
                                          definition: 'Demo',
                                          observed_instances: 0,
                                          successful_instances: 0,
                                          percentage_correct: 75,
                                          qualitative_example: 'Demo mode' 
                                        }
                                      },
                                      integrated_insight: {
                                        summary: 'Demo analysis (rate limit fallback)',
                                        correlation_metrics: {
                                          intangible_to_outcome_correlation: 0.75,
                                          intangibles_overall_score: 0.75,
                                          tangible_efficiency_score: 0.75
                                        },
                                        radar_chart_data: {
                                          courage: 0.75,
                                          composure: 0.75,
                                          initiative: 0.75,
                                          leadership: 0.75,
                                          effectiveness_under_stress: 0.75
                                        }
                                      },
                                      coaching_recommendations: {
                                        key_takeaways: ['Demo analysis mode - rate limit reached'],
                                        action_steps: [{ 
                                          focus_area: 'composure' as const, 
                                          training_drill: 'Demo mode',
                                          measurement_goal: 'N/A'
                                        }]
                                      }
                                    }
                                  };
                                }
                                return c;
                              }));
                              setAppState('results');
                              setRateLimitHit(false);
                              toast({
                                title: "Using Demo Analysis",
                                description: `Applied demo analysis to ${processingProgress.total - processingProgress.processed - processingProgress.failed} remaining clips.`
                              });
                            }}
                          >
                            Use Demo Analysis for Remaining Clips
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Wait 1 hour for rate limit reset, or use demo analysis to continue reviewing clips now.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground text-center">
                      Processing sequentially (1 clip every 2 seconds) to respect rate limits. Clips appear as analyzed.
                    </p>
                    
                    {!rateLimitHit && estimatedTimeRemaining && estimatedTimeRemaining > 60000 && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground text-center">
                          💡 Tip: Large videos take time. Consider trimming to key moments or trying a shorter clip first!
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Analysis workbench - EXPANDED */}
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-lg p-6 flex flex-col max-h-[85vh]">
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

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
              {sortedClips.map(clip => (
                <ClipCard
                  key={clip.id}
                  clip={clip}
                  isActive={activeClipId === clip.id}
                  onPlay={() => playClip(clip)}
                  onToggleSelect={() => toggleClipSelection(clip.id)}
                  onShowDetails={() => {
                    console.log('🔍 [HighlightReelPage] Setting detailed clip:', clip.id);
                    console.log('🔍 [HighlightReelPage] Clip data:', clip);
                    setDetailedClip(clip);
                  }}
                />
              ))}
              {clips.length === 0 && appState === 'results' && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>There was an issue processing the video. Please try a different file.</p>
                </div>
              )}
              
              {selectedClips.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold mb-3 text-sm">Selected Clips Timeline</h4>
                  <div className="space-y-2">
                    {selectedClips.map((clip, index) => (
                      <div key={clip.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{index + 1}</span>
                          <span className="font-medium">
                            {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                          </span>
                          {(clip.analysis as any)?.shotType && (
                            <Badge variant="outline" className="text-xs">
                              {(clip.analysis as any).shotType}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {((clip.analysis?.integrated_insight?.correlation_metrics?.intangibles_overall_score ?? 0) * 10).toFixed(1)}/10
                        </span>
                      </div>
                    ))}
                  </div>
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
                  ) : !user ? (
                    <>
                      <Film className="w-5 h-5" />
                      Sign In to Generate Feedback
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
