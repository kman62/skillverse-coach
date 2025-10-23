import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clip } from "@/types/reelTypes";
import { IntangiblesRadarChart } from "./IntangiblesRadarChart";

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Clip Analysis: {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
            <Badge variant={parseFloat(score) >= 7 ? "default" : "secondary"}>
              {score}/10
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {clip.thumbnail && (
            <img 
              src={clip.thumbnail} 
              alt="Clip frame"
              className="w-full rounded-lg"
            />
          )}

          <div>
            <h3 className="font-bold text-lg mb-2">Play Context</h3>
            <p className="text-sm text-muted-foreground">
              {analysis.play_context.play_type} - {analysis.play_context.possession_phase}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Tangible Performance</h3>
            <p className="text-sm text-muted-foreground">
              Execution Quality: {(analysis.tangible_performance.overall_summary.execution_quality * 100).toFixed(0)}%
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Intangible Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {Object.entries(analysis.intangible_performance).map(([key, metric]) => (
                  <div key={key} className="border rounded-lg p-3">
                    <h4 className="font-semibold capitalize mb-1">{key.replace(/_/g, ' ')}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{metric.qualitative_example}</p>
                    <Badge variant="outline">
                      Score: {(metric.score * 10).toFixed(1)}/10
                    </Badge>
                  </div>
                ))}
              </div>
              <div>
                <IntangiblesRadarChart data={analysis.integrated_insight.radar_chart_data} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Integrated Insight</h3>
            <p className="text-sm text-muted-foreground">
              {analysis.integrated_insight.summary}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Coaching Recommendations</h3>
            <div className="space-y-2">
              {analysis.coaching_recommendations.key_takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <p className="text-sm text-muted-foreground">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
