import { Card } from "@/components/ui/card";
import { IntegratedInsight } from "@/types/highlightReel";
import { TrendingUp } from "lucide-react";

interface IntegratedInsightCardProps {
  insight: IntegratedInsight;
}

export const IntegratedInsightCard = ({ insight }: IntegratedInsightCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Integrated Tactical-Behavioral Insights
      </h3>
      
      <p className="mb-6 leading-relaxed">{insight.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Intangible Score</p>
          <p className="text-2xl font-bold">{(insight.correlation_metrics.intangibles_overall_score * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Tangible Efficiency</p>
          <p className="text-2xl font-bold">{(insight.correlation_metrics.tangible_efficiency_score * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Correlation</p>
          <p className="text-2xl font-bold">{(insight.correlation_metrics.intangible_to_outcome_correlation).toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};
