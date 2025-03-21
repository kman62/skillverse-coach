
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProgressChart from '@/components/ui/ProgressChart';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { SPORTS } from '@/lib/constants';
import { User, Award, Flame, Calendar, ChevronRight, Clock, Loader2, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button'; // Added missing Button import
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

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
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
          
          {/* Profile Edit Form */}
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
          
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="animate-fade-in">
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
                
                {/* Achievements Summary */}
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
            
            {/* Activity Tab */}
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
            
            {/* Achievements Tab */}
            <TabsContent value="achievements" className="animate-fade-in">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Achievement Badges</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* First Analysis Achievement */}
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
                  
                  {/* Dedicated Athlete Achievement */}
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
                  
                  {/* Excellence Achievement */}
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
                  
                  {/* Consistency Achievement */}
                  <div className="rounded-lg border p-4 bg-muted/30 border-muted/50 opacity-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Calendar size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">Consistency</h3>
                      <p className="text-sm text-muted-foreground">Complete analyses on 5 consecutive days</p>
                    </div>
                  </div>
                  
                  {/* All Sports Achievement */}
                  <div className="rounded-lg border p-4 bg-muted/30 border-muted/50 opacity-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Award size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-1">All-Around Athlete</h3>
                      <p className="text-sm text-muted-foreground">Complete analyses in all available sports</p>
                    </div>
                  </div>
                  
                  {/* Master Achievement */}
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
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
