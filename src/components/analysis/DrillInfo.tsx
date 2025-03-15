
import React from 'react';
import { Drill } from '@/lib/constants';

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
    </div>
  );
};

export default DrillInfo;
