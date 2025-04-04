
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AnalysisMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

interface AnalysisCardProps {
  title: string;
  description: string;
  score: number;
  metrics: AnalysisMetric[];
  feedback: { good: string[]; improve: string[] };
  className?: string;
}

const AnalysisCard = ({ 
  title, 
  description, 
  score, 
  metrics, 
  feedback,
  className 
}: AnalysisCardProps) => {
  // Log metrics on render for debugging
  useEffect(() => {
    console.log('AnalysisCard rendering with metrics:', metrics.map(m => m.name).join(', '));
  }, [metrics]);
  
  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Calculate progress percentage for metric
  const calculateProgress = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className={cn(
      "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
      className
    )}>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Score Section */}
          <div className="md:col-span-1 bg-card rounded-lg p-5 border border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Overall Score</h4>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <span className={cn("text-5xl font-bold", getScoreColor(score))}>
                  {score}
                </span>
                <span className="text-xl">/100</span>
              </div>
            </div>
          </div>
          
          {/* Metrics Section */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">Key Metrics</h4>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span>{metric.name}</span>
                    <span className="font-medium">
                      {metric.value}{metric.unit} / {metric.target}{metric.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress(metric.value, metric.target)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="mt-8 space-y-6">
          {/* Strengths */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <CheckCircle size={16} className="text-green-500 mr-2" />
              What You're Doing Well
            </h4>
            <ul className="space-y-2 pl-6">
              {feedback.good.map((item, index) => (
                <li key={index} className="text-sm list-disc text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Areas for Improvement */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <AlertCircle size={16} className="text-yellow-500 mr-2" />
              Areas to Improve
            </h4>
            <ul className="space-y-2 pl-6">
              {feedback.improve.map((item, index) => (
                <li key={index} className="text-sm list-disc text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
