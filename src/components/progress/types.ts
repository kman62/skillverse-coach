
export interface ProgressData {
  date: string;
  score: number;
}

export interface MetricData {
  name: string;
  value: number;
  target?: number;
}

export interface ProgressChartProps {
  data: ProgressData[];
  className?: string;
  metrics?: MetricData[];
}
