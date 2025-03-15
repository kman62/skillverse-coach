
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Sport } from '@/lib/constants';

interface SportsCardProps {
  sport: Sport;
  className?: string;
}

const SportsCard = ({ sport, className }: SportsCardProps) => {
  return (
    <Link 
      to={`/sports/${sport.id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl card-hover",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
      
      <img 
        src={sport.coverImage} 
        alt={sport.name} 
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-4xl mb-2 block">{sport.icon}</span>
            <h3 className="text-xl font-semibold tracking-tight">{sport.name}</h3>
            <p className="text-sm text-white/80 mt-1">{sport.description}</p>
          </div>
          
          <div className="bg-white/20 h-10 w-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={18} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SportsCard;
