import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clip } from "@/types/reelTypes";
import { IntangiblesRadarChart } from "./IntangiblesRadarChart";
import { TangiblePerformanceCard } from "./TangiblePerformanceCard";
import { IntangibleMetricsCard } from "./IntangibleMetricsCard";
import { IntegratedInsightCard } from "./IntegratedInsightCard";
import { PlayContextCard } from "./PlayContextCard";
import { CoachingRecommendationsCard } from "./CoachingRecommendationsCard";

interface AnalysisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clip: Clip | null;
}

export const AnalysisDetailModal = ({ isOpen, onClose, clip }: AnalysisDetailModalProps) => {
  console.log('🔍 [AnalysisDetailModal] Render - isOpen:', isOpen, 'clip:', clip?.id, 'hasAnalysis:', !!clip?.analysis);
  
  if (!clip?.analysis) {
    console.log('🔍 [AnalysisDetailModal] Early return - no clip or no analysis');
    return null;
  }

  const { analysis } = clip;
  const score = (analysis.integrated_insight.correlation_metrics.intangibles_overall_score * 10).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-xl">Clip Analysis: {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s</span>
            <Badge 
              variant={parseFloat(score) >= 7 ? "default" : "secondary"}
              className="text-lg px-3 py-1"
            >
              {score}/10
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {clip.thumbnail && (
          <div className="rounded-lg overflow-hidden border shadow-sm">
            <img 
              src={clip.thumbnail} 
              alt="Clip frame"
              className="w-full"
            />
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tangibles">Tangibles</TabsTrigger>
            <TabsTrigger value="intangibles">Intangibles</TabsTrigger>
            <TabsTrigger value="coaching">Coaching</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <PlayContextCard context={analysis.play_context} />
            <IntegratedInsightCard insight={analysis.integrated_insight} />
          </TabsContent>

          <TabsContent value="tangibles" className="space-y-6 mt-6">
            <TangiblePerformanceCard performance={analysis.tangible_performance} />
          </TabsContent>

          <TabsContent value="intangibles" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IntangibleMetricsCard intangibles={analysis.intangible_performance} />
              <IntangiblesRadarChart data={analysis.integrated_insight.radar_chart_data} />
            </div>
          </TabsContent>

          <TabsContent value="coaching" className="space-y-6 mt-6">
            <CoachingRecommendationsCard recommendations={analysis.coaching_recommendations} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
