import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachingRecommendations } from "@/types/highlightReel";
import { Lightbulb, Target } from "lucide-react";

interface CoachingRecommendationsCardProps {
  recommendations: CoachingRecommendations;
}

export const CoachingRecommendationsCard = ({ recommendations }: CoachingRecommendationsCardProps) => {
  if (!recommendations) {
    return null;
  }

  const keyTakeaways = recommendations.key_takeaways || [];
  const actionSteps = recommendations.action_steps || [];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5" />
        Coaching Recommendations
      </h3>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Key Takeaways</h4>
        <ul className="space-y-2">
          {keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Action Steps
        </h4>
        <div className="space-y-4">
          {actionSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {step.focus_area.replace('_', ' ')}
                </Badge>
              </div>
              <p className="font-medium mb-1">{step.training_drill}</p>
              <p className="text-sm text-muted-foreground">
                Goal: {step.measurement_goal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
