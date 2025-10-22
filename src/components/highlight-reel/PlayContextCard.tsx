import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayContext } from "@/types/highlightReel";

interface PlayContextCardProps {
  context: PlayContext;
}

export const PlayContextCard = ({ context }: PlayContextCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Play Context</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Possession Phase</p>
          <Badge variant="outline" className="capitalize">{context.possession_phase}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Play Type</p>
          <Badge variant="outline" className="capitalize">{context.play_type.replace('_', ' ')}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Formation</p>
          <Badge variant="outline">{context.formation}</Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Situation</p>
          <Badge variant="outline" className="capitalize">{context.situation.replace('_', ' ')}</Badge>
        </div>
      </div>
    </Card>
  );
};
