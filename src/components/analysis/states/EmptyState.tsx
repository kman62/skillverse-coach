
import React from 'react';
import { BarChart } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium">No Analysis Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Upload a video and click "Analyze Technique" to receive personalized feedback.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
