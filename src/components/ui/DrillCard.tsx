
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Drill } from '@/lib/constants';

interface DrillCardProps {
  sportId: string;
  drill: Drill;
  className?: string;
  style?: React.CSSProperties;
  gameplaySituation?: string;
  playType?: string;
}

const DrillCard = ({ sportId, drill, className, style, gameplaySituation, playType }: DrillCardProps) => {
  // Map difficulty to appropriate color
  const difficultyColor = {
    beginner: "bg-green-500",
    intermediate: "bg-yellow-500",
    advanced: "bg-red-500"
  };
  
  // Construct URL with optional gameplay parameters
  const buildUrl = () => {
    let url = `/sports/${sportId}/drills/${drill.id}`;
    const params = new URLSearchParams();
    
    if (gameplaySituation) {
      params.append('gameplay', gameplaySituation);
    }
    
    if (playType) {
      params.append('play', playType);
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };
  
  return (
    <Link 
      to={buildUrl()}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1",
        className
      )}
      style={style}
    >
      <div className="relative w-full overflow-hidden rounded-t-xl">
        <div className="aspect-video">
          <img 
            src={drill.coverImage} 
            alt={drill.name} 
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{drill.name}</h3>
            <span className={cn(
              "inline-block mt-1 px-2 py-0.5 text-xs font-medium text-white rounded-full",
              difficultyColor[drill.difficulty]
            )}>
              {drill.difficulty.charAt(0).toUpperCase() + drill.difficulty.slice(1)}
            </span>
          </div>
          
          <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={16} className="text-primary" />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{drill.description}</p>
      </div>
    </Link>
  );
};

export default DrillCard;
