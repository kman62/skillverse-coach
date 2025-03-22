
import React from 'react';
import { Medal, Award, Target, TrendingUp, Star, Dumbbell, Flag, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SPORTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

interface SportAchievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: string;
  sport: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress?: number;
}

interface SportAchievementsProps {
  achievements: SportAchievement[];
  activeSport?: string;
}

const levelColors = {
  bronze: "bg-amber-600/10 text-amber-600 border-amber-600/20",
  silver: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  gold: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  platinum: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
};

const SportAchievements = ({ achievements, activeSport }: SportAchievementsProps) => {
  // Filter achievements by active sport if specified
  const filteredAchievements = activeSport 
    ? achievements.filter(a => a.sport === activeSport)
    : achievements;

  // Group achievements by sport
  const achievementsBySport = filteredAchievements.reduce<Record<string, SportAchievement[]>>((acc, achievement) => {
    if (!acc[achievement.sport]) {
      acc[achievement.sport] = [];
    }
    acc[achievement.sport].push(achievement);
    return acc;
  }, {});

  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.name : sportId;
  };

  const getSportIcon = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.icon : '🏅';
  };

  return (
    <div className="space-y-6">
      {Object.entries(achievementsBySport).map(([sportId, sportAchievements]) => (
        <Card key={sportId} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSportIcon(sportId)}</span>
              <CardTitle>{getSportName(sportId)} Achievements</CardTitle>
            </div>
            <CardDescription>
              {sportAchievements.filter(a => a.unlocked).length} of {sportAchievements.length} achievements unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sportAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`relative rounded-lg border p-4 ${achievement.unlocked 
                    ? levelColors[achievement.level] 
                    : 'bg-muted/30 border-muted/50 opacity-50'}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`h-16 w-16 rounded-full ${achievement.unlocked 
                      ? 'bg-primary/10' 
                      : 'bg-muted/20'} flex items-center justify-center mb-3`}
                    >
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <Badge variant="outline" className="mt-2">
                        {achievement.date ? `Unlocked on ${achievement.date}` : 'Unlocked'}
                      </Badge>
                    ) : achievement.progress !== undefined ? (
                      <div className="w-full mt-2">
                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary/40 rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}% complete
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline" className="mt-2 bg-muted/20">
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SportAchievements;
