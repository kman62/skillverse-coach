
import React from 'react';
import { BarChart, Target, Play } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmptyStateProps {
  onGameplayChange?: (gameplay: string) => void;
}

const EmptyState = ({ onGameplayChange }: EmptyStateProps) => {
  const gameplayOptions = [
    { value: 'regular', label: 'Regular Technique' },
    { value: 'pick-and-roll', label: 'Pick and Roll' },
    { value: 'iso', label: 'Isolation Play' },
    { value: 'fast-break', label: 'Fast Break' },
    { value: 'post-up', label: 'Post-Up Play' },
    { value: 'zone-offense', label: 'Zone Offense' },
    { value: 'man-defense', label: 'Man-to-Man Defense' },
  ];

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
        
        <div className="mt-6 max-w-xs mx-auto">
          <label className="text-sm font-medium text-left block mb-2">
            Select Gameplay Situation
          </label>
          <Select onValueChange={onGameplayChange} defaultValue="regular">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gameplay type" />
            </SelectTrigger>
            <SelectContent>
              {gameplayOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-4 flex items-center gap-2 text-sm bg-primary/5 p-3 rounded-lg text-left">
            <Target size={18} className="text-primary flex-shrink-0" />
            <p>Selecting a specific gameplay situation will help tailor the analysis to your needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
