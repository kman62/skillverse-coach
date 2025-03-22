
import React from 'react';
import { Link } from 'react-router-dom';
import { Sport, Drill } from '@/lib/constants';

interface BreadcrumbNavProps {
  sport: Sport | null;
  drill: Drill | null;
}

const BreadcrumbNav = ({ sport, drill }: BreadcrumbNavProps) => {
  if (!sport || !drill) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary transition-colors">Sports</Link>
        <span className="mx-2">/</span>
        <Link to={`/sports/${sport.id}`} className="hover:text-primary transition-colors">{sport.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{drill.name}</span>
      </div>
    </div>
  );
};

export default BreadcrumbNav;
