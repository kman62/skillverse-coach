
import React from 'react';
import { Drill } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, List, CheckCircle, Dumbbell } from 'lucide-react';

interface DrillInfoProps {
  drill: Drill;
}

const DrillInfo = ({ drill }: DrillInfoProps) => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold">{drill.name}</h1>
      <p className="mt-2 text-muted-foreground">{drill.description}</p>
      
      <div className="mt-4 inline-flex items-center px-3 py-1 bg-secondary rounded-full text-xs font-medium">
        Difficulty: {drill.difficulty.charAt(0).toUpperCase() + drill.difficulty.slice(1)}
      </div>
      
      {drill.duration && (
        <div className="mt-2 inline-flex items-center ml-2 px-3 py-1 bg-secondary rounded-full text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          {drill.duration}
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {drill.steps && drill.steps.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <List className="w-5 h-5 mr-2 text-primary" />
                Step-by-Step Instructions
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                {drill.steps.map((step, index) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-6">
          {drill.equipment && drill.equipment.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <Dumbbell className="w-5 h-5 mr-2 text-primary" />
                  Equipment Needed
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {drill.equipment.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {drill.benefits && drill.benefits.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                  Benefits
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {drill.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm">{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrillInfo;
