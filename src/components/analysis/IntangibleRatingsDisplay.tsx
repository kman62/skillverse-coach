import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IntangibleRating {
  metric_name: string;
  rating: number;
  evidence: string;
  created_at: string;
}

interface IntangibleRatingsDisplayProps {
  ratings: IntangibleRating[];
}

const formatMetricName = (name: string) => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'text-green-600';
  if (rating >= 3) return 'text-yellow-600';
  return 'text-orange-600';
};

const getRatingBadge = (rating: number) => {
  if (rating >= 4) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (rating >= 3) return <Minus className="h-4 w-4 text-yellow-600" />;
  return <TrendingDown className="h-4 w-4 text-orange-600" />;
};

export default function IntangibleRatingsDisplay({ ratings }: IntangibleRatingsDisplayProps) {
  if (!ratings || ratings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intangible Metrics</CardTitle>
        <CardDescription>
          Psychological and behavioral performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getRatingBadge(rating.rating)}
                  <h4 className="font-semibold">{formatMetricName(rating.metric_name)}</h4>
                </div>
                <Badge variant="outline" className={getRatingColor(rating.rating)}>
                  {rating.rating}/5
                </Badge>
              </div>
              {rating.evidence && (
                <p className="text-sm text-muted-foreground">{rating.evidence}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
