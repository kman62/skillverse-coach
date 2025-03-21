
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, Legend, ReferenceLine } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface ProgressData {
  date: string;
  score: number;
}

interface MetricData {
  name: string;
  value: number;
  target?: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  className?: string;
  metrics?: MetricData[];
}

const ProgressChart = ({ data, metrics, className }: ProgressChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get average score
  const getAverageScore = () => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / data.length);
  };

  // Get trend (positive, negative, or neutral)
  const getTrend = () => {
    if (!data || data.length < 2) return 'neutral';
    const first = data[0].score;
    const last = data[data.length - 1].score;
    if (last > first) return 'positive';
    if (last < first) return 'negative';
    return 'neutral';
  };

  // Check if we've reached a new high score
  const hasNewHighScore = () => {
    if (!data || data.length < 2) return false;
    const sortedScores = [...data].sort((a, b) => b.score - a.score);
    return sortedScores[0] === data[data.length - 1];
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-primary font-semibold text-lg">{payload[0].value} / 100</p>
        </div>
      );
    }
    return null;
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
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="line" onClick={() => setChartType('line')}>Line</TabsTrigger>
            <TabsTrigger value="bar" onClick={() => setChartType('bar')}>Bar</TabsTrigger>
          </TabsList>
        </div>
      </div>
      
      {data && data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">{getAverageScore()}</p>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">Latest Score</p>
              <p className="text-2xl font-bold">{data[data.length - 1].score}</p>
              
              <div className="mt-1 flex items-center">
                {getTrend() === 'positive' && (
                  <span className="text-xs text-green-500">↑ Improving</span>
                )}
                {getTrend() === 'negative' && (
                  <span className="text-xs text-red-500">↓ Decreasing</span>
                )}
                {getTrend() === 'neutral' && (
                  <span className="text-xs text-yellow-500">→ Maintaining</span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg col-span-2 md:col-span-1">
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{data.length}</p>
              
              {hasNewHighScore() && (
                <span className="mt-1 inline-block text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  New high score!
                </span>
              )}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={getAverageScore()} stroke="rgba(139, 92, 246, 0.3)" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2, fill: "white" }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={getAverageScore()} stroke="rgba(139, 92, 246, 0.3)" strokeDasharray="3 3" />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {metrics && metrics.length > 0 && (
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
          )}
        </>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-2">No progress data available yet</p>
          <p className="text-sm max-w-md">Complete some analysis sessions to track your progress over time</p>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
