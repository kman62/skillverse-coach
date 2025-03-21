
import React from 'react';

const EmptyState = () => {
  return (
    <div className="h-[300px] flex flex-col items-center justify-center text-center">
      <p className="text-muted-foreground mb-2">No progress data available yet</p>
      <p className="text-sm max-w-md">Complete some analysis sessions to track your progress over time</p>
    </div>
  );
};

export default EmptyState;
