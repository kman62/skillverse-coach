import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProgressChart from '@/components/progress/ProgressChart';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { SPORTS } from '@/lib/constants';
import { User, Award, Flame, Calendar, ChevronRight, Clock, Loader2, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AccuracyMetrics from '@/components/progress/AccuracyMetrics';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [accuracyMetrics, setAccuracyMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch recent activities (analysis results)
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('analysis_results')
          .select(`
            id,
            score,
            created_at,
            sport_id,
            drill_id,
            videos (id, title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (activitiesError) throw activitiesError;
        setRecentActivities(activitiesData || []);
        
        // Fetch progress data
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('date, score')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(10);
          
        if (progressError) throw progressError;
        setProgressData(progressData || []);
        
        // Fetch feedback data to calculate accuracy metrics
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('analysis_feedback')
          .select('sport_id, drill_id, rating, original_score')
          .eq('user_id', user.id);
          
        if (feedbackError) throw feedbackError;
        
        // Calculate accuracy metrics from feedback
        if (feedbackData && feedbackData.length > 0) {
          // Calculate form accuracy (user rating vs. AI score)
          const avgAIScore = feedbackData.reduce((acc, curr) => acc + (curr.original_score || 0), 0) / feedbackData.length;
          const avgUserRating = feedbackData.reduce((acc, curr) => acc + (curr.rating * 20), 0) / feedbackData.length; // Convert 1-5 scale to percentage
          
          // Calculate accuracy by sport
          const sportMetrics = {};
          feedbackData.forEach(item => {
            if (!sportMetrics[item.sport_id]) {
              sportMetrics[item.sport_id] = { ratings: [], scores: [] };
            }
            sportMetrics[item.sport_id].ratings.push(item.rating * 20); // Convert to percentage
            if (item.original_score) sportMetrics[item.sport_id].scores.push(item.original_score);
          });
          
          // Calculate deviation percent (how much AI scores deviate from user ratings)
          const deviations = feedbackData.map(item => {
            const aiScore = item.original_score || 0;
            const userScore = item.rating * 20; // Convert to same scale
            return Math.abs(aiScore - userScore);
          });
          const avgDeviation = deviations.reduce((acc, curr) => acc + curr, 0) / deviations.length;
          const deviationPercent = 100 - Math.min(100, avgDeviation);
          
          // Set accuracy metrics
          const accuracyData = [
            {
              name: 'Technique Analysis',
              value: Math.round(100 - Math.min(Math.abs(avgAIScore - avgUserRating), 100)),
              target: 90,
              description: 'How closely AI analysis matches user feedback'
            },
            {
              name: 'Form Recognition',
              value: Math.round(deviationPercent),
              target: 85,
              description: 'Accuracy of movement pattern recognition'
            }
          ];
          
          // Add sport-specific metrics if we have enough data
          Object.entries(sportMetrics).forEach(([sport, data]: [string, any]) => {
            if (data.ratings.length >= 2) {
              const sportAvgRating = data.ratings.reduce((acc, curr) => acc + curr, 0) / data.ratings.length;
              const sportAvgScore = data.scores.length ? data.scores.reduce((acc, curr) => acc + curr, 0) / data.scores.length : 0;
              
              accuracyData.push({
                name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Accuracy`,
                value: Math.round(100 - Math.min(Math.abs(sportAvgScore - sportAvgRating), 100)),
                target: 90,
                description: `Accuracy of ${sport} technique analysis`
              });
            }
          });
          
          setAccuracyMetrics(accuracyData);
        } else {
          // Default metrics if no feedback data available
          setAccuracyMetrics([
            {
              name: 'Technique Analysis',
              value: 85,
              target: 90,
              description: 'Based on system baseline performance'
            },
            {
              name: 'Form Recognition',
              value: 80,
              target: 85,
              description: 'Based on system baseline performance'
            }
          ]);
        }
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleProfileUpdate = async () => {
    // Refresh profile data after update
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      setProfile(data);
      setIsEditFormOpen(false);
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const getSportIcon = (sportName: string) => {
    const sport = SPORTS.find(s => s.id === sportName);
    return sport ? sport.icon : '🏅';
  };
  
  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.name : sportId;
  };
  
  const getAverageScore = () => {
    if (!recentActivities || recentActivities.length === 0) return 0;
    const sum = recentActivities.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return (sum / recentActivities.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-full flex items-center justify-center mr-5">
                  <User size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{profile?.full_name || profile?.username || user?.email}</h1>
                  <p className="text-muted-foreground">
                    {recentActivities && recentActivities.length > 0 
                      ? Array.from(new Set(recentActivities.map((a: any) => getSportName(a.sport_id)))).join(', ')
                      : 'No sports activity yet'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap md:flex-nowrap gap-4">
                <div className="bg-card border border-border rounded-lg px-4 py-3 w-full sm:w-auto">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Award size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-xl font-semibold">{getAverageScore()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg px-4 py-3 w-full sm:w-auto">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Flame size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Practice Count</p>
                      <p className="text-xl font-semibold">{recentActivities?.length || 0}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="ml-auto"
                  onClick={() => setIsEditFormOpen(!isEditFormOpen)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {isEditFormOpen ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </section>
          
          <Collapsible
            open={isEditFormOpen}
            onOpenChange={setIsEditFormOpen}
            className="mb-10"
          >
            <CollapsibleContent className="bg-card rounded-xl border border-border p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
              {profile && (
                <ProfileEditForm 
                  initialData={profile} 
                  onProfileUpdate={handleProfileUpdate} 
                />
              )}
            </CollapsibleContent>
          </Collapsible>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
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
                      </>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Complete your first analysis to earn achievements!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="animate-fade-in">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {recentActivities.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sport</TableHead>
                          <TableHead>Drill</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="mr-2 text-xl">{getSportIcon(activity.sport_id)}</span>
                                <span>{getSportName(activity.sport_id)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{activity.drill_id}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-2 text-muted-foreground" />
                                <span>{formatDate(activity.created_at)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-2 text-muted-foreground" />
                                <span>{formatTime(activity.created_at)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`font-medium ${
                                  activity.score >= 80 ? 'text-green-500' : 
                                  activity.score >= 70 ? 'text-yellow-500' : 
                                  'text-red-500'
                                }`}>
                                  {activity.score}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-muted-foreground mb-4">No activity recorded yet</p>
                    <p className="text-sm max-w-md mx-auto">
                      Start analyzing your technique in different sports to see your activity history here!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="animate-fade-in">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Achievement Badges</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`rounded-lg border p-4 ${recentActivities.length > 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-muted/50 opacity-50'}`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Award size={32} className={`${recentActivities.length > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold mb-1">First Analysis</h3>
                      <p className="text-sm text-muted-foreground">Complete your first video analysis</p>
                      {recentActivities.length > 0 && (
                        <div className="mt-3 text-xs bg-primary/10 px-2 py-1 rounded-full text-primary">
                          Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`rounded-lg border p-4 ${recentActivities.length >= 3 ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-muted/50 opacity-50'}`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Flame size={32} className={`${recentActivities.length >= 3 ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold mb-1">Dedicated Athlete</h3>
                      <p className="text-sm text-muted-foreground">Complete at least 3 video analyses</p>
                      {recentActivities.length >= 3 && (
                        <div className="mt-3 text-xs bg-primary/10 px-2 py-1 rounded-full text-primary">
                          Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`rounded-lg border p-4 ${recentActivities.some((a: any) => a.score >= 80) ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-muted/50 opacity-50'}`}>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Award size={32} className={`${recentActivities.some((a: any) => a.score >= 80) ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <h3 className="font-semibold mb-1">Excellence</h3>
                      <p className="text-sm text-muted-foreground">Achieve a score of 80 or higher</p>
                      {recentActivities.some((a: any) => a.score >= 80) && (
                        <div className="mt-3 text-xs bg-primary/10 px-2 py-1 rounded-full text-primary">
                          Unlocked
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/30 border-muted/50 opacity-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Calendar size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">Consistency</h3>
                      <p className="text-sm text-muted-foreground">Complete analyses on 5 consecutive days</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/30 border-muted/50 opacity-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Award size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">All-Around Athlete</h3>
                      <p className="text-sm text-muted-foreground">Complete analyses in all available sports</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/30 border-muted/50 opacity-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Award size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">Master</h3>
                      <p className="text-sm text-muted-foreground">Achieve a score of 90 or higher</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border overflow-hidden p-6">
                  <h2 className="text-xl font-semibold mb-6">Analysis Accuracy</h2>
                  
                  {accuracyMetrics.length > 0 ? (
                    <AccuracyMetrics metrics={accuracyMetrics} />
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-muted-foreground mb-4">No accuracy data available yet</p>
                      <p className="text-sm max-w-md mx-auto">
                        Rate some of your analysis results to see accuracy metrics here!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-card rounded-xl border border-border overflow-hidden p-6">
                  <h2 className="text-xl font-semibold mb-6">Improvement by Sport</h2>
                  
                  {recentActivities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.from(new Set(recentActivities.map((a: any) => a.sport_id))).map((sportId) => {
                        const sportActivities = recentActivities.filter((a: any) => a.sport_id === sportId);
                        const sportName = getSportName(sportId as string);
                        
                        return (
                          <div key={sportId as string} className="bg-muted/30 rounded-lg p-4">
                            <div className="flex items-center mb-4">
                              <span className="text-2xl mr-2">{getSportIcon(sportId as string)}</span>
                              <h3 className="text-lg font-medium">{sportName}</h3>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Latest Score</span>
                                <span className="font-medium">{sportActivities[0]?.score || 'N/A'}</span>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span>Activities</span>
                                <span className="font-medium">{sportActivities.length}</span>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span>Average Score</span>
                                <span className="font-medium">
                                  {sportActivities.length > 0 
                                    ? Math.round(sportActivities.reduce((acc, curr) => acc + (curr.score || 0), 0) / sportActivities.length) 
                                    : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-muted-foreground mb-4">No sport data available yet</p>
                      <p className="text-sm max-w-md mx-auto">
                        Complete some analyses to see your progress by sport!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
