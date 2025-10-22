import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, Circle, Info, Loader2 } from "lucide-react";
import { Clip } from "@/types/reelTypes";

interface ClipCardProps {
  clip: Clip;
  isActive: boolean;
  onPlay: () => void;
  onToggleSelect: () => void;
  onShowDetails: () => void;
}

export const ClipCard = ({ clip, isActive, onPlay, onToggleSelect, onShowDetails }: ClipCardProps) => {
  const score = clip.analysis 
    ? (clip.analysis.integrated_insight.correlation_metrics.intangibles_overall_score * 10).toFixed(1)
    : null;

  return (
    <Card className={`p-4 transition-all ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex gap-3">
        {clip.thumbnail && (
          <img 
            src={clip.thumbnail} 
            alt={`Clip thumbnail`}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
              </p>
              {clip.isAnalyzing && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing...
                </p>
              )}
              {clip.error && (
                <p className="text-xs text-destructive">{clip.error}</p>
              )}
            </div>
            
            {score && (
              <Badge variant={parseFloat(score) >= 7 ? "default" : "secondary"}>
                {score}/10
              </Badge>
            )}
          </div>

          {clip.analysis && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {clip.analysis.integrated_insight.summary}
            </p>
          )}

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onPlay}
              disabled={clip.isAnalyzing}
            >
              <Play className="w-3 h-3 mr-1" />
              Play
            </Button>
            
            {clip.analysis && (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onToggleSelect}
                >
                  {clip.selected ? (
                    <CheckCircle2 className="w-3 h-3 mr-1 text-primary" />
                  ) : (
                    <Circle className="w-3 h-3 mr-1" />
                  )}
                  {clip.selected ? 'Selected' : 'Select'}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onShowDetails}
                >
                  <Info className="w-3 h-3 mr-1" />
                  Details
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
