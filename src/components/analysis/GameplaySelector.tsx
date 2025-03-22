
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Move3d, Shield } from 'lucide-react';

interface GameplaySelectorProps {
  gameplaySituation?: string;
  playType?: string;
  onGameplaySituationChange?: (situation: string) => void;
  onPlayTypeChange?: (play: string) => void;
  className?: string;
}

const GameplaySelector = ({
  gameplaySituation = 'offense',
  playType,
  onGameplaySituationChange,
  onPlayTypeChange,
  className
}: GameplaySelectorProps) => {
  const handleGameplaySituationChange = (value: string) => {
    if (onGameplaySituationChange) {
      onGameplaySituationChange(value);
    }
  };

  const handlePlayTypeChange = (value: string) => {
    if (onPlayTypeChange) {
      onPlayTypeChange(value);
    }
  };

  const getPlayTypeOptions = (situation: string) => {
    switch (situation) {
      case 'offense':
        return [
          { value: 'crossover', label: 'Crossover Dribble' },
          { value: 'pick-and-roll', label: 'Pick and Roll' },
          { value: 'jumpshot', label: 'Jump Shot' },
          { value: 'layup', label: 'Layup' }
        ];
      case 'defense':
        return [
          { value: 'man-defense', label: 'Man-to-Man Defense' },
          { value: 'zone-defense', label: 'Zone Defense' },
          { value: 'closeout', label: 'Closeout' },
          { value: 'help-defense', label: 'Help Defense' }
        ];
      case 'transition':
        return [
          { value: 'fast-break', label: 'Fast Break' },
          { value: 'transition-offense', label: 'Transition Offense' },
          { value: 'transition-defense', label: 'Transition Defense' }
        ];
      default:
        return [];
    }
  };

  const renderAnalysisFocus = () => {
    if (!playType || !gameplaySituation) return null;

    let focusText = '';
    
    if (gameplaySituation === 'offense') {
      if (playType === 'crossover') {
        focusText = "We'll analyze your crossover technique, ball handling, and ability to create space.";
      } else if (playType === 'pick-and-roll') {
        focusText = "We'll analyze your timing, decision making, and execution in the pick and roll.";
      } else if (playType === 'jumpshot') {
        focusText = "We'll analyze your shooting form, release point, and follow-through.";
      } else if (playType === 'layup') {
        focusText = "We'll analyze your footwork, body control, and finishing technique.";
      }
    } else if (gameplaySituation === 'defense') {
      if (playType === 'man-defense') {
        focusText = "We'll analyze your defensive stance, positioning, and lateral movement.";
      } else if (playType === 'zone-defense') {
        focusText = "We'll analyze your zone positioning, communication, and rotations.";
      } else if (playType === 'closeout') {
        focusText = "We'll analyze your closeout technique, body control, and recovery.";
      } else if (playType === 'help-defense') {
        focusText = "We'll analyze your help positioning, timing, and recovery.";
      }
    } else if (gameplaySituation === 'transition') {
      if (playType === 'fast-break') {
        focusText = "We'll analyze your lane running, spacing, and finishing in transition.";
      } else if (playType === 'transition-offense') {
        focusText = "We'll analyze your decision making, pace, and execution in transition offense.";
      } else if (playType === 'transition-defense') {
        focusText = "We'll analyze your transition defense positioning, communication, and matchup identification.";
      }
    }

    return (
      <div className="bg-primary/5 p-3 rounded-md text-sm text-left mt-4">
        <h5 className="font-medium mb-1">Analysis Focus</h5>
        <p className="text-muted-foreground text-xs">{focusText}</p>
      </div>
    );
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="text-left mb-3">
        <h4 className="font-medium text-sm mb-2">Select Game Situation</h4>
        <RadioGroup 
          value={gameplaySituation} 
          className="flex flex-col space-y-2"
          onValueChange={handleGameplaySituationChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offense" id="offense" />
            <label htmlFor="offense" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Target size={16} className="text-primary" />
              Offensive Play
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="defense" id="defense" />
            <label htmlFor="defense" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Shield size={16} className="text-primary" />
              Defensive Play
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="transition" id="transition" />
            <label htmlFor="transition" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Move3d size={16} className="text-primary" />
              Transition
            </label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="text-left mb-4">
        <h4 className="font-medium text-sm mb-2">Select Specific Play</h4>
        <Select value={playType} onValueChange={handlePlayTypeChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Choose a play type" />
          </SelectTrigger>
          <SelectContent>
            {getPlayTypeOptions(gameplaySituation || 'offense').map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {renderAnalysisFocus()}
    </div>
  );
};

export default GameplaySelector;
