
import React, { useState, useEffect } from 'react';
import { BarChart, Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [selectedOption, setSelectedOption] = useState('upload');
  const [selectedGameplay, setSelectedGameplay] = useState(gameplaySituation || 'offense');
  const [selectedPlay, setSelectedPlay] = useState(playType || '');

  // Update parent component when local state changes
  useEffect(() => {
    if (onGameplaySituationChange && selectedGameplay !== gameplaySituation) {
      onGameplaySituationChange(selectedGameplay);
    }
  }, [selectedGameplay, onGameplaySituationChange, gameplaySituation]);

  useEffect(() => {
    if (onPlayTypeChange && selectedPlay !== playType) {
      onPlayTypeChange(selectedPlay);
    }
  }, [selectedPlay, onPlayTypeChange, playType]);

  // Update local state when props change
  useEffect(() => {
    if (gameplaySituation && gameplaySituation !== selectedGameplay) {
      setSelectedGameplay(gameplaySituation);
    }
  }, [gameplaySituation]);

  useEffect(() => {
    if (playType && playType !== selectedPlay) {
      setSelectedPlay(playType);
    }
  }, [playType]);

  const handleGameplaySituationChange = (value: string) => {
    setSelectedGameplay(value);
    setSelectedPlay(''); // Reset play type when situation changes
    if (onGameplaySituationChange) {
      onGameplaySituationChange(value);
    }
  };

  const handlePlayTypeChange = (value: string) => {
    setSelectedPlay(value);
    if (onPlayTypeChange) {
      onPlayTypeChange(value);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border h-auto flex flex-col items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-medium">No Analysis Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Upload a video and click "Analyze Technique" to receive personalized feedback.
        </p>
        
        <div className="mt-6 space-y-5">
          <Tabs defaultValue="gameplay" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gameplay">Game Play</TabsTrigger>
              <TabsTrigger value="drills">Drills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gameplay" className="p-4 border rounded-md mt-4">
              <div className="text-left mb-3">
                <h4 className="font-medium text-sm mb-2">Select Game Situation</h4>
                <RadioGroup 
                  value={selectedGameplay} 
                  className="flex flex-col space-y-2"
                  onValueChange={handleGameplaySituationChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offense" id="offense" />
                    <label htmlFor="offense" className="text-sm cursor-pointer">Offensive Play</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defense" id="defense" />
                    <label htmlFor="defense" className="text-sm cursor-pointer">Defensive Play</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transition" id="transition" />
                    <label htmlFor="transition" className="text-sm cursor-pointer">Transition</label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="text-left mb-4">
                <h4 className="font-medium text-sm mb-2">Select Specific Play</h4>
                <Select value={selectedPlay} onValueChange={handlePlayTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a play type" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedGameplay === 'offense' && (
                      <>
                        <SelectItem value="crossover">Crossover Dribble</SelectItem>
                        <SelectItem value="pick-and-roll">Pick and Roll</SelectItem>
                        <SelectItem value="jumpshot">Jump Shot</SelectItem>
                        <SelectItem value="layup">Layup</SelectItem>
                      </>
                    )}
                    {selectedGameplay === 'defense' && (
                      <>
                        <SelectItem value="man-defense">Man-to-Man Defense</SelectItem>
                        <SelectItem value="zone-defense">Zone Defense</SelectItem>
                        <SelectItem value="closeout">Closeout</SelectItem>
                        <SelectItem value="help-defense">Help Defense</SelectItem>
                      </>
                    )}
                    {selectedGameplay === 'transition' && (
                      <>
                        <SelectItem value="fast-break">Fast Break</SelectItem>
                        <SelectItem value="transition-offense">Transition Offense</SelectItem>
                        <SelectItem value="transition-defense">Transition Defense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPlay && (
                <div className="bg-primary/5 p-3 rounded-md text-sm text-left">
                  <h5 className="font-medium mb-1">Analysis Focus</h5>
                  <p className="text-muted-foreground text-xs mb-2">
                    {selectedGameplay === 'offense' && selectedPlay === 'crossover' && 
                      "We'll analyze your crossover technique, ball handling, and ability to create space."}
                    {selectedGameplay === 'offense' && selectedPlay === 'pick-and-roll' && 
                      "We'll analyze your timing, decision making, and execution in the pick and roll."}
                    {selectedGameplay === 'offense' && selectedPlay === 'jumpshot' && 
                      "We'll analyze your shooting form, release point, and follow-through."}
                    {selectedGameplay === 'offense' && selectedPlay === 'layup' && 
                      "We'll analyze your footwork, body control, and finishing technique."}
                    {selectedGameplay === 'defense' && selectedPlay === 'man-defense' && 
                      "We'll analyze your defensive stance, positioning, and lateral movement."}
                    {selectedGameplay === 'defense' && selectedPlay === 'zone-defense' && 
                      "We'll analyze your zone positioning, communication, and rotations."}
                    {selectedGameplay === 'defense' && selectedPlay === 'closeout' && 
                      "We'll analyze your closeout technique, body control, and recovery."}
                    {selectedGameplay === 'defense' && selectedPlay === 'help-defense' && 
                      "We'll analyze your help positioning, timing, and recovery."}
                    {selectedGameplay === 'transition' && selectedPlay === 'fast-break' && 
                      "We'll analyze your lane running, spacing, and finishing in transition."}
                    {selectedGameplay === 'transition' && selectedPlay === 'transition-offense' && 
                      "We'll analyze your decision making, pace, and execution in transition offense."}
                    {selectedGameplay === 'transition' && selectedPlay === 'transition-defense' && 
                      "We'll analyze your transition defense positioning, communication, and matchup identification."}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="drills" className="p-4 border rounded-md mt-4">
              <div className="flex items-center justify-center space-x-2">
                <Camera size={16} />
                <span className="text-sm text-muted-foreground">Basketball Crossover technique detection ready</span>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                <p className="text-sm text-amber-800">
                  For best results, make sure your full body is visible and play the video before analyzing.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
