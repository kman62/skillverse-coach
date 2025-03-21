
import React from 'react';
import { ProgressData } from './types';

interface MetricsPanelProps {
  data: ProgressData[];
}

const MetricsPanel = ({ data }: MetricsPanelProps) => {
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

  return (
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
  );
};

export default MetricsPanel;
