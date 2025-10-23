import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TangiblePerformance } from "@/types/highlightReel";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

interface TangiblePerformanceCardProps {
  performance: TangiblePerformance;
}

export const TangiblePerformanceCard = ({ performance }: TangiblePerformanceCardProps) => {
  if (!performance || !performance.overall_summary) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Tangible Performance Analysis</h3>
        <p className="text-muted-foreground">No tangible performance data available</p>
      </Card>
    );
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failure': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'neutral': return <MinusCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Tangible Performance Analysis</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Execution Quality</p>
          <p className="text-2xl font-bold">{((performance.overall_summary.execution_quality ?? 0) * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Decision Accuracy</p>
          <p className="text-2xl font-bold">{((performance.overall_summary.decision_accuracy ?? 0) * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Spacing Index</p>
          <p className="text-2xl font-bold">{((performance.overall_summary.spacing_index ?? 0) * 100).toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Transition Speed</p>
          <p className="text-2xl font-bold">{(performance.overall_summary.transition_speed_sec ?? 0).toFixed(1)}s</p>
        </div>
      </div>

      {performance.actions && performance.actions.length > 0 && (
        <>
          <h4 className="font-semibold mb-3">Key Actions</h4>
          <div className="space-y-2">
            {performance.actions.map((action, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {getResultIcon(action.result)}
                  <div>
                    <Badge variant="outline" className="capitalize">{action.event_type}</Badge>
                    <span className="text-xs text-muted-foreground ml-2">{action.player_role}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{action.timestamp}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
