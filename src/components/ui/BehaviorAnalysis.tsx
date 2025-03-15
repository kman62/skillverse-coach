
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, AlertCircle, Clock, RotateCcw, Lightbulb } from 'lucide-react';

interface BehaviorPattern {
  name: string;
  description: string;
  quality: 'good' | 'needs-improvement';
  icon: React.ReactNode;
}

interface BehaviorAnalysisProps {
  consistency: BehaviorPattern[];
  preRoutine: BehaviorPattern[];
  habits: BehaviorPattern[];
  className?: string;
}

const BehaviorAnalysis = ({ consistency, preRoutine, habits, className }: BehaviorAnalysisProps) => {
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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="consistency">Consistency</TabsTrigger>
            <TabsTrigger value="preRoutine">Pre-Shot Routine</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
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
