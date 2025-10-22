import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
import { HighlightReelMetadata } from "@/types/highlightReel";

interface MetadataCardProps {
  metadata: HighlightReelMetadata;
}

export const MetadataCard = ({ metadata }: MetadataCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Game Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{metadata.team}</span>
          <span className="text-muted-foreground">vs</span>
          <span className="font-medium">{metadata.opponent}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{metadata.game_date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{metadata.clip_start_time} - {metadata.clip_end_time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Analyst:</span>
          <span className="font-medium">{metadata.analyst}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {metadata.source_method.map((method) => (
          <Badge key={method} variant="secondary">
            {method.replace('_', ' ')}
          </Badge>
        ))}
      </div>
    </Card>
  );
};
