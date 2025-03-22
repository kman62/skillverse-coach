
import React from 'react';
import { BarChart, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = () => {
  return (
    <div className="bg-card rounded-xl border border-border h-[500px] flex flex-col items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium">No Analysis Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Upload a video and click "Analyze Technique" to receive personalized feedback.
        </p>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Camera size={16} />
            <span>Basketball Crossover technique detection ready</span>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 max-w-xs mx-auto">
            <p className="text-sm text-amber-800">
              For best results, make sure your full body is visible and play the video before analyzing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
