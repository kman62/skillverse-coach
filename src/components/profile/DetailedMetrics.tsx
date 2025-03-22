
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, TrendingDown, Target, ChartBar } from 'lucide-react';
import { AccuracyMetric } from '@/components/progress/types';
import AccuracyMetrics from '@/components/progress/AccuracyMetrics';

interface MetricGroup {
  id: string;
  name: string;
  metrics: AccuracyMetric[];
}

interface DetailedMetricsProps {
  metricGroups: MetricGroup[];
  improvementRate?: number;
  consistencyRate?: number;
  accuracyRate?: number;
  recentTrend?: 'improving' | 'declining' | 'stable';
}

const DetailedMetrics = ({ 
  metricGroups, 
  improvementRate = 0, 
  consistencyRate = 0, 
  accuracyRate = 0,
  recentTrend = 'stable'
}: DetailedMetricsProps) => {
  const getTrendIcon = () => {
    switch(recentTrend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'stable':
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBar className="h-5 w-5" />
            Performance Summary
          </CardTitle>
          <CardDescription>
            Overview of your performance metrics across all sports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Improvement Rate</h4>
                <span className="text-sm font-medium">{improvementRate}%</span>
              </div>
              <Progress value={improvementRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {improvementRate < 20 && 'Consider increasing your training frequency'}
                {improvementRate >= 20 && improvementRate < 50 && 'Steady improvement, keep it up!'}
                {improvementRate >= 50 && 'Excellent progress rate!'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Consistency</h4>
                <span className="text-sm font-medium">{consistencyRate}%</span>
              </div>
              <Progress value={consistencyRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {consistencyRate < 30 && 'Try to maintain a regular training schedule'}
                {consistencyRate >= 30 && consistencyRate < 60 && 'Good consistency, aim for more regular sessions'}
                {consistencyRate >= 60 && 'Excellent training consistency!'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Form Accuracy</h4>
                <span className="text-sm font-medium">{accuracyRate}%</span>
              </div>
              <Progress value={accuracyRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {accuracyRate < 40 && 'Focus on technique refinement'}
                {accuracyRate >= 40 && accuracyRate < 70 && 'Solid technique, continue refining'}
                {accuracyRate >= 70 && 'Excellent form accuracy!'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-primary/5 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center mr-3">
              {getTrendIcon()}
            </div>
            <div>
              <p className="font-medium">Recent Trend</p>
              <p className="text-sm text-muted-foreground">
                {recentTrend === 'improving' && 'Your performance is improving consistently'}
                {recentTrend === 'declining' && 'Your performance has been declining slightly'}
                {recentTrend === 'stable' && 'Your performance has been stable recently'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>
            Sport-specific performance metrics and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={metricGroups[0]?.id || "overall"}>
            <TabsList className="mb-4">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              {metricGroups.map(group => (
                <TabsTrigger key={group.id} value={group.id}>
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="overall">
              <AccuracyMetrics metrics={metricGroups.flatMap(group => group.metrics)} />
            </TabsContent>
            
            {metricGroups.map(group => (
              <TabsContent key={group.id} value={group.id}>
                <AccuracyMetrics metrics={group.metrics} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedMetrics;
