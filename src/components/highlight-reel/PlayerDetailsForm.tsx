import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerInfo } from "@/types/reelTypes";

interface PlayerDetailsFormProps {
  playerInfo: PlayerInfo;
  onPlayerInfoChange: (info: PlayerInfo) => void;
  onStartAnalysis: () => void;
}

export const PlayerDetailsForm = ({ playerInfo, onPlayerInfoChange, onStartAnalysis }: PlayerDetailsFormProps) => {
  const handleChange = (field: keyof PlayerInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onPlayerInfoChange({ ...playerInfo, [field]: e.target.value });
  };

  const handleSportChange = (sport: PlayerInfo['sport']) => {
    onPlayerInfoChange({ ...playerInfo, sport });
  };

  const isValid = playerInfo.name && playerInfo.jerseyNumber && playerInfo.sport;

  const sportOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'football', label: 'Football' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'rugby', label: 'Rugby' },
  ];

  return (
    <div className="bg-card/50 rounded-lg border p-6 space-y-4">
      <h3 className="text-xl font-bold">Player Information</h3>
      <p className="text-sm text-muted-foreground">Enter player details before starting analysis</p>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="sport">Sport</Label>
          <Select value={playerInfo.sport} onValueChange={handleSportChange}>
            <SelectTrigger id="sport">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              {sportOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="player-name">Player Name</Label>
          <Input 
            id="player-name"
            placeholder="e.g., John Smith" 
            value={playerInfo.name}
            onChange={handleChange('name')}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="position">
              Position {!playerInfo.position && <span className="text-xs text-muted-foreground">(auto-detects during analysis)</span>}
            </Label>
            <Input 
              id="position"
              placeholder="e.g., PG, SG, SF" 
              value={playerInfo.position}
              onChange={handleChange('position')}
            />
          </div>
          <div>
            <Label htmlFor="jersey">Jersey #</Label>
            <Input 
              id="jersey"
              placeholder="e.g., 23" 
              value={playerInfo.jerseyNumber}
              onChange={handleChange('jerseyNumber')}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={onStartAnalysis}
        disabled={!isValid}
        className="w-full"
        size="lg"
      >
        Start AI Analysis
      </Button>
    </div>
  );
};
