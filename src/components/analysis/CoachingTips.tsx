
import React from 'react';

interface CoachingTipsProps {
  tips: string[];
}

const CoachingTips = ({ tips }: CoachingTipsProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold mb-3">Coaching Tips</h3>
      <div className="space-y-3">
        {tips.map((tip: string, index: number) => (
          <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="mt-1 bg-primary/20 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-sm">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachingTips;
