import { useState, useRef } from "react";
import { MetadataCard } from "@/components/highlight-reel/MetadataCard";
import { PlayContextCard } from "@/components/highlight-reel/PlayContextCard";
import { TangiblePerformanceCard } from "@/components/highlight-reel/TangiblePerformanceCard";
import { IntangibleMetricsCard } from "@/components/highlight-reel/IntangibleMetricsCard";
import { IntangiblesRadarChart } from "@/components/highlight-reel/IntangiblesRadarChart";
import { IntegratedInsightCard } from "@/components/highlight-reel/IntegratedInsightCard";
import { CoachingRecommendationsCard } from "@/components/highlight-reel/CoachingRecommendationsCard";
import { ReelPreviewModal } from "@/components/highlight-reel/ReelPreviewModal";
import { HighlightReelAnalysis } from "@/types/highlightReel";
import { Clip, Feedback } from "@/types/reelTypes";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockAnalysis: HighlightReelAnalysis = {
  metadata: {
    video_id: "game_2025_001",
    team: "Warriors",
    opponent: "Lakers",
    game_date: "2025-01-15",
    clip_start_time: "10:23:45",
    clip_end_time: "10:24:15",
    analyst: "Coach Anderson",
    source_method: ["computer_vision", "manual_review"]
  },
  play_context: {
    possession_phase: "offense",
    play_type: "pick_and_roll",
    formation: "4-out-1-in",
    situation: "live_play"
  },
  tangible_performance: {
    actions: [
      {
        event_type: "screen",
        timestamp: "10:23:47",
        player_role: "C",
        result: "success",
        metrics: {
          spacing_efficiency_score: 0.85,
          defender_proximity_m: 1.2
        }
      },
      {
        event_type: "drive",
        timestamp: "10:23:50",
        player_role: "PG",
        result: "success",
        metrics: {
          reaction_time_sec: 0.4,
          distance_m: 4.5
        }
      },
      {
        event_type: "pass",
        timestamp: "10:23:53",
        player_role: "PG",
        result: "success",
        metrics: {
          angle_deg: 45,
          defender_proximity_m: 2.1
        }
      }
    ],
    overall_summary: {
      execution_quality: 0.88,
      decision_accuracy: 0.92,
      spacing_index: 0.85,
      transition_speed_sec: 3.2
    }
  },
  intangible_performance: {
    courage: {
      definition: "Approaches/attacks stressor situations within 2s",
      observed_instances: 5,
      successful_instances: 4,
      percentage_correct: 80,
      qualitative_example: "Immediate attack post-turnover with confident drive to basket"
    },
    composure: {
      definition: "Returns to athletic stance within 2s of play stoppage",
      observed_instances: 8,
      successful_instances: 7,
      percentage_correct: 87.5,
      qualitative_example: "Quick stance reset after whistle, maintaining defensive readiness"
    },
    initiative: {
      definition: "Enters correct spacing/formation within 3s",
      observed_instances: 6,
      successful_instances: 5,
      percentage_correct: 83.3,
      qualitative_example: "Timely off-ball fill to right corner creating optimal spacing"
    },
    leadership: {
      definition: "Constructive communication within 3s of whistle",
      observed_instances: 4,
      successful_instances: 3,
      percentage_correct: 75,
      qualitative_example: "Clear verbal callout directing teammate rotation"
    },
    effectiveness_under_stress: {
      definition: "Executes functional action within 10s of play start",
      observed_instances: 7,
      successful_instances: 6,
      percentage_correct: 85.7,
      qualitative_example: "Successfully executed corner three under defensive pressure"
    }
  },
  integrated_insight: {
    summary: "High composure and initiative enabled smooth secondary action, compensating for modest leadership communication. The player's quick recovery and positioning directly contributed to optimal spacing that created the open shot opportunity.",
    correlation_metrics: {
      intangible_to_outcome_correlation: 0.78,
      intangibles_overall_score: 0.82,
      tangible_efficiency_score: 0.88
    },
    radar_chart_data: {
      courage: 0.80,
      composure: 0.875,
      initiative: 0.833,
      leadership: 0.75,
      effectiveness_under_stress: 0.857
    }
  },
  coaching_recommendations: {
    key_takeaways: [
      "Strong composure recovery allowed early defensive rotation preventing open corner three",
      "Initiative in spacing created optimal offensive positioning throughout possession",
      "Leadership communication needs consistency to align defensive recovery with offensive spacing"
    ],
    action_steps: [
      {
        focus_area: "leadership",
        training_drill: "Communication drill with scripted callouts during transition scenarios",
        measurement_goal: "Achieve 85% communication rate in next scrimmage"
      },
      {
        focus_area: "courage",
        training_drill: "2-second response drill after simulated turnovers",
        measurement_goal: "Maintain 90% immediate attack response in pressure situations"
      }
    ]
  }
};

const HighlightReelPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysis] = useState<HighlightReelAnalysis>(mockAnalysis);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedClips, setSelectedClips] = useState<Clip[]>([]);
  const [feedback] = useState<Feedback>({
    athlete: "**Great performance!** Your composure under pressure was excellent, maintaining 87.5% consistency throughout the game. Your initiative in spacing created multiple scoring opportunities.",
    parents: "Your athlete showed tremendous growth in leadership and decision-making. The ability to maintain high performance under stress is a key indicator of future success at higher levels of competition.",
    coach: "Focus areas for next practice: Continue working on communication consistency (currently at 75%) and maintaining aggressive play after turnovers."
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setUploadedVideo(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        
        // Generate sample clips based on the analysis data
        const clips: Clip[] = [
          { id: '1', startTime: 5.0, endTime: 15.0, analysis: mockAnalysis },
          { id: '2', startTime: 23.0, endTime: 35.0, analysis: mockAnalysis },
          { id: '3', startTime: 47.0, endTime: 58.0, analysis: mockAnalysis }
        ];
        setSelectedClips(clips);
        
        toast({
          title: "Video uploaded successfully",
          description: `${file.name} is now ready for analysis`,
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

  const handlePreviewReel = () => {
    if (!videoUrl || selectedClips.length === 0) {
      toast({
        title: "No clips selected",
        description: "Please upload a video first",
        variant: "destructive"
      });
      return;
    }
    setIsPreviewOpen(true);
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
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={handleUploadClick} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Video
            </Button>
            {videoUrl && selectedClips.length > 0 && (
              <Button onClick={handlePreviewReel} className="gap-2" variant="secondary">
                <Play className="w-4 h-4" />
                Preview Reel
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Highlight Reel Analysis</h1>
          <p className="text-muted-foreground">
            Complete Performance Intangible Framework Assessment
          </p>
        </div>

        <div className="space-y-6">
          {videoUrl && (
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-bold mb-4">Uploaded Video</h3>
              <video 
                src={videoUrl} 
                controls 
                className="w-full rounded-lg max-h-[500px]"
              >
                Your browser does not support the video tag.
              </video>
              {uploadedVideo && (
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadedVideo.name} ({(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetadataCard metadata={analysis.metadata} />
            <PlayContextCard context={analysis.play_context} />
          </div>

          <TangiblePerformanceCard performance={analysis.tangible_performance} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntangibleMetricsCard intangibles={analysis.intangible_performance} />
            <IntangiblesRadarChart data={analysis.integrated_insight.radar_chart_data} />
          </div>

          <IntegratedInsightCard insight={analysis.integrated_insight} />

          <CoachingRecommendationsCard recommendations={analysis.coaching_recommendations} />
        </div>

        <ReelPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          videoSrc={videoUrl}
          selectedClips={selectedClips}
          feedback={feedback}
        />
      </div>
    </div>
  );
};

export default HighlightReelPage;
