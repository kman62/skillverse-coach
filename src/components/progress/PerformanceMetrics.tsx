
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { MetricData } from './types';

interface PerformanceMetricsProps {
  metrics: MetricData[];
}

const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  if (!metrics || metrics.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h4 className="text-md font-medium mb-4">Performance Metrics</h4>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">{metric.name}</span>
              <span className="text-sm font-medium">{metric.value}%</span>
            </div>
            <Progress 
              value={metric.value} 
              className="h-2" 
            />
            {metric.target && (
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  Target: {metric.target}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
