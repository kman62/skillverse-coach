
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AccuracyMetric } from './types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface AccuracyMetricsProps {
  metrics: AccuracyMetric[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'];

const AccuracyMetrics = ({ metrics }: AccuracyMetricsProps) => {
  // Prepare data for pie chart
  const pieData = metrics.map((metric) => ({
    name: metric.name,
    value: metric.value,
    target: metric.target,
    description: metric.description
  }));

  // Calculate average accuracy
  const avgAccuracy = metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2">Accuracy Distribution</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                  labelFormatter={(name) => `${name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Overall Stats */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium mb-4">Overall Accuracy</h4>
          <div className="flex justify-center items-center h-[250px]">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-primary/10">
                <span className="text-4xl font-bold text-primary">{Math.round(avgAccuracy)}%</span>
              </div>
              <p className="text-muted-foreground text-sm">Average across all metrics</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium mb-4">Detailed Accuracy Metrics</h4>
        <div className="space-y-5">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{metric.name}</span>
                  {metric.description && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button className="ml-1 inline-flex">
                          <Info size={14} className="text-muted-foreground" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">{metric.description}</p>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
                <span className="text-sm font-medium">{metric.value}%</span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-2" 
                indicatorClassName={
                  metric.value >= 80 ? "bg-green-500" : 
                  metric.value >= 60 ? "bg-yellow-500" : 
                  "bg-red-500"
                }
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
    </div>
  );
};

export default AccuracyMetrics;
