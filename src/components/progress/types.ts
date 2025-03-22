export interface ProgressData {
  date: string;
  score: number;
}

export interface MetricData {
  name: string;
  value: number;
  target?: number;
}

// New types for detailed accuracy metrics
export interface AccuracyMetric {
  name: string;
  value: number;
  target?: number;
  description?: string;
}

// Enhanced type for MetricData with more detailed information
export interface DetailedMetricData extends MetricData {
  description?: string;
  icon?: React.ReactNode;
  trend?: 'increasing' | 'decreasing' | 'stable';
  trendValue?: number;
}

// Extend ProgressChartProps with accuracy metrics
export interface ProgressChartProps {
  data: ProgressData[];
  metrics?: MetricData[];
  accuracyMetrics?: AccuracyMetric[];
  className?: string;
}
