import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IntangiblePerformance } from "@/types/highlightReel";
import { Target, Heart, Zap, Users, Award, Shield, Eye, BarChart3, Brain } from "lucide-react";

interface IntangibleMetricsCardProps {
  intangibles: IntangiblePerformance;
}

const getIcon = (key: string) => {
  switch (key) {
    case 'courage': return <Heart className="w-5 h-5 text-red-500" />;
    case 'composure': return <Target className="w-5 h-5 text-blue-500" />;
    case 'initiative': return <Zap className="w-5 h-5 text-yellow-500" />;
    case 'leadership': return <Users className="w-5 h-5 text-green-500" />;
    case 'effectiveness_under_stress': return <Award className="w-5 h-5 text-purple-500" />;
    case 'discipline': return <Shield className="w-5 h-5 text-orange-500" />;
    case 'focus': return <Eye className="w-5 h-5 text-cyan-500" />;
    case 'consistency': return <BarChart3 className="w-5 h-5 text-indigo-500" />;
    case 'game_iq': return <Brain className="w-5 h-5 text-pink-500" />;
    default: return null;
  }
};

const formatKey = (key: string) => {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const IntangibleMetricsCard = ({ intangibles }: IntangibleMetricsCardProps) => {
  if (!intangibles) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Intangible Performance Metrics</h3>
        <p className="text-muted-foreground">No intangible performance data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Intangible Performance Metrics</h3>
      <div className="space-y-6">
        {Object.entries(intangibles).map(([key, metric]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(key)}
                <span className="font-semibold">{formatKey(key)}</span>
              </div>
              <span className="text-sm font-bold">{(metric.percentage_correct ?? 0).toFixed(0)}%</span>
            </div>
            <Progress value={metric.percentage_correct ?? 0} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {metric.successful_instances ?? 0} / {metric.observed_instances ?? 0} instances
            </div>
            <p className="text-sm italic text-muted-foreground">{metric.qualitative_example ?? 'No example available'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
