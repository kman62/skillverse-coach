
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from 'lucide-react';

interface Metric {
  name: string;
  value: number;
  target?: number;
  unit?: string;
}

interface Feedback {
  good: string[];
  improve: string[];
}

interface AnalysisCardProps {
  title: string;
  description: string;
  score: number;
  metrics: Metric[];
  feedback: Feedback;
  analysisType?: string;
}

const AnalysisCard = ({ 
  title, 
  description, 
  score, 
  metrics, 
  feedback,
  analysisType
}: AnalysisCardProps) => {
  // Log what analysis type we're displaying
  React.useEffect(() => {
    if (analysisType) {
      console.log(`AnalysisCard rendering with analysisType: ${analysisType}`);
      console.log(`Metrics received:`, metrics.map(m => m.name).join(', '));
    }
  }, [analysisType, metrics]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Performance Metrics */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">{metric.name}</span>
                <span className="text-sm font-medium">
                  {metric.value}{metric.unit || '%'}
                </span>
              </div>
              <Progress 
                value={metric.value} 
                max={100}
                className="h-2" 
              />
              {metric.target && (
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    Target: {metric.target}{metric.unit || '%'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Feedback Section */}
        {(feedback.good.length > 0 || feedback.improve.length > 0) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Feedback</h4>
            
            {/* Good Points */}
            {feedback.good.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs font-medium text-green-600 mb-2">What You Did Well</h5>
                <ul className="space-y-1">
                  {feedback.good.map((point, i) => (
                    <li key={`good-${i}`} className="flex text-sm">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Areas to Improve */}
            {feedback.improve.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-amber-600 mb-2">Areas to Improve</h5>
                <ul className="space-y-1">
                  {feedback.improve.map((point, i) => (
                    <li key={`improve-${i}`} className="flex text-sm">
                      <XCircle className="h-4 w-4 mr-2 text-amber-500 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
