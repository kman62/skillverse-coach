
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressChartProps } from './types';
import MetricsPanel from './MetricsPanel';
import ProgressChartView from './ProgressChartView';
import PerformanceMetrics from './PerformanceMetrics';
import EmptyState from './EmptyState';

const ProgressChart = ({ data, metrics, className }: ProgressChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Get average score
  const getAverageScore = () => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / data.length);
  };

  return (
    <div className={cn("w-full bg-card rounded-xl border border-border p-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Progress Over Time</h3>
          <p className="text-sm text-muted-foreground">Track your improvement across sessions</p>
        </div>
        
        <div className="mt-3 sm:mt-0 flex gap-2 items-center">
          <span className="text-sm text-muted-foreground mr-1">View:</span>
          <Tabs defaultValue="line" value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'bar')}>
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {data && data.length > 0 ? (
        <>
          <MetricsPanel data={data} />
          
          <ProgressChartView 
            data={data} 
            chartType={chartType} 
            getAverageScore={getAverageScore}
          />
          
          {metrics && metrics.length > 0 && (
            <PerformanceMetrics metrics={metrics} />
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ProgressChart;
