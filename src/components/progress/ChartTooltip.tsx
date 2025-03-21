
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-4 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{formatDate(label || '')}</p>
        <p className="text-primary font-semibold text-lg">{payload[0].value} / 100</p>
      </div>
    );
  }
  return null;
};

export default ChartTooltip;
