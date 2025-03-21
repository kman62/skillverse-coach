
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, ReferenceLine } from 'recharts';
import { ProgressData } from './types';
import ChartTooltip from './ChartTooltip';

interface ProgressChartViewProps {
  data: ProgressData[];
  chartType: 'line' | 'bar';
  getAverageScore: () => number;
}

const ProgressChartView = ({ data, chartType, getAverageScore }: ProgressChartViewProps) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
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
            <Tooltip content={<ChartTooltip />} />
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
            <Tooltip content={<ChartTooltip />} />
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
  );
};

export default ProgressChartView;
