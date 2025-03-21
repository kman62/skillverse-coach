
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProgressChart from '@/components/ui/ProgressChart';
import { SPORTS } from '@/lib/constants';
import { User, Award, Flame, Calendar, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Format time string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get icon for sport
  const getSportIcon = (sportName: string) => {
    const sport = SPORTS.find(s => s.id === sportName);
    return sport ? sport.icon : '🏅';
  };
  
  // Get sport name from ID
  const getSportName = (sportId: string) => {
    const sport = SPORTS.find(s => s.id === sportId);
    return sport ? sport.name : sportId;
  };
  
  // Calculate average score
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
          {/* Profile Header */}
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
              </div>
            </div>
          </section>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Chart */}
            <div className="lg:col-span-2">
              {progressData.length > 0 ? (
                <ProgressChart data={progressData} />
              ) : (
                <div className="bg-card rounded-xl border border-border p-10 flex flex-col items-center justify-center h-80">
                  <p className="text-lg text-muted-foreground mb-4">No progress data available yet</p>
                  <p className="text-sm text-center max-w-md">
                    Complete some drill analyses to see your progress over time!
                  </p>
                </div>
              )}
            </div>
            
            {/* Achievements */}
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
          
          {/* Recent Activity */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            
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
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
