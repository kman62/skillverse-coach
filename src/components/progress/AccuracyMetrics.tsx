
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AccuracyMetric } from './types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { format, subDays } from 'date-fns';

interface AccuracyMetricsProps {
  metrics: AccuracyMetric[];
}

const AccuracyMetrics = ({ metrics }: AccuracyMetricsProps) => {
  // Generate sample data for the Standard Celeration Chart
  // In a real application, this would come from your backend
  const generateCelerationData = () => {
    const today = new Date();
    const data = [];
    
    // Generate 14 days of sample data
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      
      // Random score that generally improves over time (with some variation)
      const baseScore = 50 + (13 - i) * 3;
      const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const score = Math.max(1, Math.min(100, baseScore + randomVariation));
      
      data.push({
        date: format(date, 'MMM dd'),
        score: score,
        // Semi-logarithmic scale value (for celeration chart)
        logScore: Math.log10(score)
      });
    }
    
    return data;
  };

  const celerationData = generateCelerationData();
  
  // Calculate slope for trend line
  const calculateTrendline = () => {
    const xValues = celerationData.map((_, i) => i);
    const yValues = celerationData.map(d => d.logScore);
    
    // Simple linear regression
    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  };
  
  const { slope, intercept } = calculateTrendline();
  
  // Calculate trend line data points
  const trendData = celerationData.map((point, i) => ({
    date: point.date,
    trend: Math.pow(10, intercept + slope * i)
  }));

  // Calculate average accuracy
  const avgAccuracy = metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard Celeration Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium mb-2">Standard Celeration Chart</h4>
          <p className="text-xs text-muted-foreground mb-2">Performance trends over time (logarithmic scale)</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={celerationData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end" 
                  height={50}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  scale="log" 
                  domain={[1, 100]}
                  ticks={[1, 2, 5, 10, 20, 50, 100]} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Score']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trend" 
                  data={trendData}
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
                <ReferenceLine 
                  y={70} 
                  stroke="#f59e0b" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: "Target", 
                    position: "insideBottomRight",
                    fill: "#f59e0b",
                    fontSize: 12
                  }} 
                />
              </LineChart>
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
                className={`h-2 ${
                  metric.value >= 80 ? "bg-green-500" : 
                  metric.value >= 60 ? "bg-yellow-500" : 
                  "bg-red-500"
                }`}
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
