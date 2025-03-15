
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, AlertCircle, Clock, RotateCcw, Lightbulb, Clock3, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BehaviorPattern {
  name: string;
  description: string;
  quality: 'good' | 'needs-improvement';
  icon: React.ReactNode;
}

interface TimingData {
  average: string;
  consistency: number;
  isRushing: boolean;
  attempts: {
    attemptNumber: number;
    duration: string;
  }[];
}

interface FatigueIndicator {
  level: 'low' | 'moderate' | 'high';
  signs: string[];
  recommendations: string[];
}

interface BehaviorAnalysisProps {
  consistency: BehaviorPattern[];
  preRoutine: BehaviorPattern[];
  habits: BehaviorPattern[];
  timing?: TimingData;
  fatigue?: FatigueIndicator;
  className?: string;
}

const BehaviorAnalysis = ({ consistency, preRoutine, habits, timing, fatigue, className }: BehaviorAnalysisProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Lightbulb size={18} className="mr-2 text-primary" />
          Behavior Analysis
        </CardTitle>
        <CardDescription>
          Identifying patterns in your technique and routine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="consistency" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
            <TabsTrigger value="preRoutine">Pre-Shot Routine</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="fatigue">Fatigue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="consistency" className="space-y-4">
            {consistency.map((pattern, index) => (
              <PatternItem key={index} pattern={pattern} />
            ))}
          </TabsContent>
          
          <TabsContent value="preRoutine" className="space-y-4">
            {preRoutine.map((pattern, index) => (
              <PatternItem key={index} pattern={pattern} />
            ))}
          </TabsContent>
          
          <TabsContent value="habits" className="space-y-4">
            {habits.map((pattern, index) => (
              <PatternItem key={index} pattern={pattern} />
            ))}
          </TabsContent>
          
          <TabsContent value="timing" className="space-y-4">
            {timing ? (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Average Shot Time</h4>
                    <span className="text-lg font-bold">{timing.average}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Consistency</span>
                      <span>{timing.consistency}%</span>
                    </div>
                    <Progress value={timing.consistency} className="h-2" />
                  </div>
                  
                  {timing.isRushing && (
                    <div className="mt-3 text-amber-500 bg-amber-50 p-2 rounded-md text-sm flex items-start">
                      <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>You appear to be rushing your shots in later attempts. Try to maintain a consistent pace.</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Shot Time by Attempt</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {timing.attempts.map((attempt) => (
                      <div key={attempt.attemptNumber} className="border border-border rounded-md p-3 text-center">
                        <div className="text-xs text-muted-foreground">Attempt {attempt.attemptNumber}</div>
                        <div className="font-medium">{attempt.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Clock3 size={32} className="mx-auto mb-3 opacity-50" />
                <p>No timing data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="fatigue" className="space-y-4">
            {fatigue ? (
              <div className="space-y-5">
                <div className={`p-4 rounded-lg ${
                  fatigue.level === 'low' 
                    ? 'bg-green-50 border-green-100' 
                    : fatigue.level === 'moderate'
                      ? 'bg-amber-50 border-amber-100'
                      : 'bg-red-50 border-red-100'
                  } border`}>
                  <div className="flex items-center">
                    <h4 className="font-medium">Fatigue Level</h4>
                    <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                      fatigue.level === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : fatigue.level === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {fatigue.level.charAt(0).toUpperCase() + fatigue.level.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Signs of Fatigue</h4>
                  <ul className="space-y-1">
                    {fatigue.signs.map((sign, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <TrendingDown size={16} className="mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {fatigue.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <Check size={16} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <TrendingDown size={32} className="mx-auto mb-3 opacity-50" />
                <p>No fatigue indicators available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const PatternItem = ({ pattern }: { pattern: BehaviorPattern }) => {
  return (
    <div className={`p-4 rounded-lg border ${pattern.quality === 'good' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} flex items-start`}>
      <div className={`rounded-full p-2 mr-3 ${pattern.quality === 'good' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
        {pattern.icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-medium ${pattern.quality === 'good' ? 'text-green-700' : 'text-amber-700'}`}>
          {pattern.name}
        </h4>
        <p className={`text-sm mt-1 ${pattern.quality === 'good' ? 'text-green-600' : 'text-amber-600'}`}>
          {pattern.description}
        </p>
      </div>
    </div>
  );
};

export default BehaviorAnalysis;
