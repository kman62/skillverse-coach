
import React from 'react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  score: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  className?: string;
}

const ProgressChart = ({ data, className }: ProgressChartProps) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      <h3 className="text-lg font-semibold mb-2">Progress Over Time</h3>
      <p className="text-sm text-muted-foreground mb-6">Track your improvement across sessions</p>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
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
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 6, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 8, strokeWidth: 0, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
