
import React from 'react';
import { BarChart, Camera } from 'lucide-react';
import GameplaySelector from '@/components/analysis/GameplaySelector';

interface EmptyStateProps {
  gameplaySituation?: string;
  playType?: string;
  onGameplaySituationChange?: (situation: string) => void;
  onPlayTypeChange?: (play: string) => void;
}

const EmptyState = ({
  gameplaySituation,
  playType,
  onGameplaySituationChange,
  onPlayTypeChange
}: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-xl border border-border h-auto flex flex-col items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium">No Analysis Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto mb-6">
          Upload a video and click "Analyze Technique" to receive personalized feedback.
        </p>

        <div className="mt-4 max-w-md mx-auto text-left">
          <div className="p-4 border rounded-md">
            <h4 className="font-medium text-sm mb-3">Game Analysis Configuration</h4>
            
            <GameplaySelector 
              gameplaySituation={gameplaySituation}
              playType={playType}
              onGameplaySituationChange={onGameplaySituationChange}
              onPlayTypeChange={onPlayTypeChange}
            />
            
            <div className="flex items-center justify-center space-x-2 mt-6 text-sm text-muted-foreground">
              <Camera size={16} />
              <span>Basketball gameplay analysis ready</span>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
              <p className="text-sm text-amber-800">
                For best results, make sure your full body is visible and play the video before analyzing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
