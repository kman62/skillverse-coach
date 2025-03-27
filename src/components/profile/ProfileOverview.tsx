
import React from 'react';
import { User, Award, Flame, Calendar, Info } from 'lucide-react';
import ProgressChart from '@/components/progress/ProgressChart';
import { AccuracyMetric } from '@/components/progress/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { SPORTS } from '@/lib/sports';

interface ProfileOverviewProps {
  profile: any;
  recentActivities: any[];
  progressData: any[];
  accuracyMetrics: AccuracyMetric[];
}

const ProfileOverview = ({ profile, recentActivities, progressData, accuracyMetrics }: ProfileOverviewProps) => {
  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.name : sportId;
  };
  
  const getAverageScore = () => {
    if (!recentActivities || recentActivities.length === 0) return 0;
    const sum = recentActivities.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return (sum / recentActivities.length).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {progressData.length > 0 ? (
          <ProgressChart 
            data={progressData} 
            accuracyMetrics={accuracyMetrics}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border p-10 flex flex-col items-center justify-center h-80">
            <p className="text-lg text-muted-foreground mb-4">No progress data available yet</p>
            <p className="text-sm text-center max-w-md">
              Complete some drill analyses to see your progress over time!
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Summary</h2>
          
          <div className="space-y-4">
            {profile.bio && (
              <div className="text-sm text-muted-foreground italic">
                "{profile.bio}"
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Preferred Sport</p>
                <p className="font-medium">
                  {profile.preferred_sport ? getSportName(profile.preferred_sport) : 'Not set'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Skill Level</p>
                <p className="font-medium capitalize">
                  {profile.skill_level || 'Not set'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Training Frequency</p>
                <p className="font-medium capitalize">
                  {profile.training_frequency || 'Not set'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Your Achievements</h2>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              <>
                <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">First Analysis</p>
                    <p className="text-sm text-muted-foreground">Completed your first video analysis</p>
                  </div>
                </div>
                
                {recentActivities.length >= 3 && (
                  <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Award size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dedicated Athlete</p>
                      <p className="text-sm text-muted-foreground">Completed 3+ video analyses</p>
                    </div>
                  </div>
                )}
                
                {recentActivities.some((a: any) => a.score >= 80) && (
                  <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Award size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Excellence</p>
                      <p className="text-sm text-muted-foreground">Achieved a score of 80 or higher</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Achievements
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Complete your first analysis to earn achievements!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
