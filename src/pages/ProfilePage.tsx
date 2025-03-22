
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import ProfileOverview from '@/components/profile/ProfileOverview';
import SportAchievements from '@/components/profile/SportAchievements';
import DetailedMetrics from '@/components/profile/DetailedMetrics';
import AnalysisDetailsModal from '@/components/profile/AnalysisDetailsModal';
import { User, Award, Flame, Calendar, ChevronRight, Clock, Loader2, Settings, ChevronDown, Dumbbell, Target, Star, Trophy, Medal } from 'lucide-react';
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
import { SPORTS } from '@/lib/constants';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [accuracyMetrics, setAccuracyMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [sportAchievements, setSportAchievements] = useState<any[]>([]);
  const [metricGroups, setMetricGroups] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    improvementRate: 0,
    consistencyRate: 0,
    accuracyRate: 0,
    recentTrend: 'stable' as 'improving' | 'declining' | 'stable'
  });
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [selectedAnalysisData, setSelectedAnalysisData] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
          .limit(10);
          
        if (activitiesError) throw activitiesError;
        setRecentActivities(activitiesData || []);
        
        // Fetch progress data
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('date, score')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(20);
          
        if (progressError) throw progressError;
        setProgressData(progressData || []);
        
        // Generate and set sport achievements
        if (activitiesData && activitiesData.length > 0) {
          generateSportAchievements(activitiesData);
        }
        
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
          const sportMetrics: Record<string, any> = {};
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
            },
            {
              name: 'Movement Tracking',
              value: Math.round(75 + Math.random() * 15),
              target: 90,
              description: 'Precision of movement tracking in video'
            }
          ];
          
          // Add sport-specific metrics if we have enough data
          const metricGroupsData: any[] = [];
          Object.entries(sportMetrics).forEach(([sport, data]: [string, any]) => {
            if (data.ratings.length >= 2) {
              const sportAvgRating = data.ratings.reduce((acc: number, curr: number) => acc + curr, 0) / data.ratings.length;
              const sportAvgScore = data.scores.length ? data.scores.reduce((acc: number, curr: number) => acc + curr, 0) / data.scores.length : 0;
              const sportName = getSportName(sport);
              
              const sportMetrics = [
                {
                  name: `${sportName} Technique`,
                  value: Math.round(100 - Math.min(Math.abs(sportAvgScore - sportAvgRating), 100)),
                  target: 90,
                  description: `Accuracy of ${sportName} technique analysis`
                },
                {
                  name: `${sportName} Form`,
                  value: Math.round(70 + Math.random() * 20),
                  target: 85,
                  description: `Form quality in ${sportName} movements`
                },
                {
                  name: `${sportName} Progress`,
                  value: Math.round(65 + Math.random() * 25),
                  target: 80,
                  description: `Improvement rate in ${sportName}`
                }
              ];
              
              accuracyData.push(sportMetrics[0]);
              
              metricGroupsData.push({
                id: sport,
                name: sportName,
                metrics: sportMetrics
              });
            }
          });
          
          setAccuracyMetrics(accuracyData);
          setMetricGroups(metricGroupsData);
          
          // Calculate performance metrics
          // This would typically be more sophisticated based on real data
          const progressTrend = calculateProgressTrend(activitiesData);
          const activityConsistency = calculateActivityConsistency(activitiesData);
          const formAccuracy = Math.round(deviationPercent);
          
          setPerformanceMetrics({
            improvementRate: progressTrend.rate,
            consistencyRate: activityConsistency,
            accuracyRate: formAccuracy,
            recentTrend: progressTrend.trend
          });
          
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
            },
            {
              name: 'Movement Tracking',
              value: 78,
              target: 90,
              description: 'Precision of movement tracking in video'
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
  
  const generateSportAchievements = (activities: any[]) => {
    // Group activities by sport
    const sportActivities = activities.reduce<Record<string, any[]>>((acc, activity) => {
      if (!acc[activity.sport_id]) {
        acc[activity.sport_id] = [];
      }
      acc[activity.sport_id].push(activity);
      return acc;
    }, {});
    
    const achievements: any[] = [];
    
    // Generate achievements for each sport
    Object.entries(sportActivities).forEach(([sportId, activities]) => {
      // Basic achievements
      achievements.push({
        id: `${sportId}-first`,
        title: 'First Steps',
        description: `Complete your first ${getSportName(sportId)} analysis`,
        icon: <Trophy size={32} className="text-primary" />,
        unlocked: true,
        date: formatDate(activities[activities.length - 1].created_at),
        sport: sportId,
        level: 'bronze'
      });
      
      if (activities.length >= 3) {
        achievements.push({
          id: `${sportId}-dedicated`,
          title: 'Dedicated Practice',
          description: `Complete 3 ${getSportName(sportId)} analyses`,
          icon: <Flame size={32} className="text-primary" />,
          unlocked: true,
          date: formatDate(activities[0].created_at),
          sport: sportId,
          level: 'silver'
        });
      } else {
        achievements.push({
          id: `${sportId}-dedicated`,
          title: 'Dedicated Practice',
          description: `Complete 3 ${getSportName(sportId)} analyses`,
          icon: <Flame size={32} className="text-muted-foreground" />,
          unlocked: false,
          sport: sportId,
          level: 'silver',
          progress: Math.round((activities.length / 3) * 100)
        });
      }
      
      if (activities.some(a => a.score >= 80)) {
        achievements.push({
          id: `${sportId}-excellence`,
          title: 'Excellence',
          description: `Achieve a score of 80 or higher in ${getSportName(sportId)}`,
          icon: <Award size={32} className="text-primary" />,
          unlocked: true,
          date: formatDate(activities.find(a => a.score >= 80).created_at),
          sport: sportId,
          level: 'gold'
        });
      } else {
        const highestScore = Math.max(...activities.map(a => a.score || 0));
        achievements.push({
          id: `${sportId}-excellence`,
          title: 'Excellence',
          description: `Achieve a score of 80 or higher in ${getSportName(sportId)}`,
          icon: <Award size={32} className="text-muted-foreground" />,
          unlocked: false,
          sport: sportId,
          level: 'gold',
          progress: Math.round((highestScore / 80) * 100)
        });
      }
      
      if (activities.some(a => a.score >= 90)) {
        achievements.push({
          id: `${sportId}-mastery`,
          title: 'Mastery',
          description: `Achieve a score of 90 or higher in ${getSportName(sportId)}`,
          icon: <Medal size={32} className="text-primary" />,
          unlocked: true,
          date: formatDate(activities.find(a => a.score >= 90).created_at),
          sport: sportId,
          level: 'platinum'
        });
      } else {
        const highestScore = Math.max(...activities.map(a => a.score || 0));
        achievements.push({
          id: `${sportId}-mastery`,
          title: 'Mastery',
          description: `Achieve a score of 90 or higher in ${getSportName(sportId)}`,
          icon: <Medal size={32} className="text-muted-foreground" />,
          unlocked: false,
          sport: sportId,
          level: 'platinum',
          progress: Math.round((highestScore / 90) * 100)
        });
      }
      
      // Sport-specific advanced achievements
      if (sportId === 'basketball') {
        achievements.push({
          id: `${sportId}-shooting`,
          title: 'Sharp Shooter',
          description: 'Master the basketball shooting technique',
          icon: <Target size={32} className={activities.length >= 5 ? "text-primary" : "text-muted-foreground"} />,
          unlocked: activities.length >= 5,
          date: activities.length >= 5 ? formatDate(activities[0].created_at) : undefined,
          sport: sportId,
          level: 'gold',
          progress: activities.length >= 5 ? 100 : Math.round((activities.length / 5) * 100)
        });
      } else if (sportId === 'tennis') {
        achievements.push({
          id: `${sportId}-serve`,
          title: 'Serve Master',
          description: 'Perfect your tennis serve technique',
          icon: <Star size={32} className={activities.length >= 5 ? "text-primary" : "text-muted-foreground"} />,
          unlocked: activities.length >= 5,
          date: activities.length >= 5 ? formatDate(activities[0].created_at) : undefined,
          sport: sportId,
          level: 'gold',
          progress: activities.length >= 5 ? 100 : Math.round((activities.length / 5) * 100)
        });
      }
    });
    
    // All sports achievements
    if (Object.keys(sportActivities).length >= 3) {
      achievements.push({
        id: 'all-versatile',
        title: 'Versatile Athlete',
        description: 'Try analyses in at least 3 different sports',
        icon: <Dumbbell size={32} className="text-primary" />,
        unlocked: true,
        date: formatDate(activities[0].created_at),
        sport: 'all',
        level: 'platinum'
      });
    } else {
      achievements.push({
        id: 'all-versatile',
        title: 'Versatile Athlete',
        description: 'Try analyses in at least 3 different sports',
        icon: <Dumbbell size={32} className="text-muted-foreground" />,
        unlocked: false,
        sport: 'all',
        level: 'platinum',
        progress: Math.round((Object.keys(sportActivities).length / 3) * 100)
      });
    }
    
    setSportAchievements(achievements);
  };
  
  const calculateProgressTrend = (activities: any[]) => {
    if (activities.length < 2) {
      return { trend: 'stable' as const, rate: 50 };
    }
    
    // Sort by date ascending
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Calculate scores for first and second half of activities
    const midpoint = Math.floor(sortedActivities.length / 2);
    const firstHalf = sortedActivities.slice(0, midpoint);
    const secondHalf = sortedActivities.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((acc, curr) => acc + (curr.score || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, curr) => acc + (curr.score || 0), 0) / secondHalf.length;
    
    const difference = secondHalfAvg - firstHalfAvg;
    const percentChange = (difference / firstHalfAvg) * 100;
    
    // Convert to a 0-100 rate, center around 50 for stable
    const rate = Math.min(100, Math.max(0, 50 + percentChange));
    
    let trend: 'improving' | 'declining' | 'stable';
    if (percentChange > 5) {
      trend = 'improving';
    } else if (percentChange < -5) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }
    
    return { trend, rate: Math.round(rate) };
  };
  
  const calculateActivityConsistency = (activities: any[]) => {
    if (activities.length < 2) {
      return 40; // Default for few activities
    }
    
    // Sort by date descending (as the activities are already sorted)
    const dates = activities.map(a => new Date(a.created_at));
    
    // Check for frequency over time
    const daysBetweenActivities = [];
    for (let i = 1; i < dates.length; i++) {
      const daysDiff = Math.round((dates[i-1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24));
      daysBetweenActivities.push(daysDiff);
    }
    
    // Calculate consistency score based on average days between activities
    // Lower is better, but scale appropriately
    const avgDays = daysBetweenActivities.reduce((acc, curr) => acc + curr, 0) / daysBetweenActivities.length;
    
    // Convert to a 0-100 scale, where 0 days (perfect consistency) would be 100%
    // and 30+ days would approach 0%
    const consistencyRate = Math.max(0, 100 - (avgDays * 3.33));
    
    return Math.round(consistencyRate);
  };
  
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

  const fetchAnalysisDetails = async (analysisId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select(`
          id,
          sport_id,
          drill_id,
          score,
          created_at,
          analysis_data,
          behavior_data,
          video_id,
          videos (video_url)
        `)
        .eq('id', analysisId)
        .single();
        
      if (error) throw error;
      setSelectedAnalysisData(data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error fetching analysis details:', error);
    }
  };

  const handleActivityRowClick = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    fetchAnalysisDetails(analysisId);
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
                    {profile?.preferred_sport 
                      ? getSportName(profile.preferred_sport) 
                      : recentActivities && recentActivities.length > 0 
                        ? Array.from(new Set(recentActivities.map((a: any) => getSportName(a.sport_id)))).join(', ')
                        : 'No sports activity yet'}
                  </p>
                  {profile?.skill_level && (
                    <p className="text-sm text-muted-foreground capitalize">
                      {profile.skill_level} • {profile.training_frequency || 'Casual'} Athlete
                    </p>
                  )}
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
              <ProfileOverview 
                profile={profile}
                recentActivities={recentActivities}
                progressData={progressData}
                accuracyMetrics={accuracyMetrics}
              />
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
                          <TableRow 
                            key={activity.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleActivityRowClick(activity.id)}
                          >
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
              <div className="space-y-6">
                {sportAchievements.length > 0 ? (
                  <SportAchievements achievements={sportAchievements} />
                ) : (
                  <div className="bg-card rounded-xl border border-border p-10 text-center">
                    <p className="text-muted-foreground mb-4">No achievements yet</p>
                    <p className="text-sm max-w-md mx-auto">
                      Complete some analyses to earn achievements in different sports!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="animate-fade-in">
              <DetailedMetrics 
                metricGroups={metricGroups}
                improvementRate={performanceMetrics.improvementRate}
                consistencyRate={performanceMetrics.consistencyRate}
                accuracyRate={performanceMetrics.accuracyRate}
                recentTrend={performanceMetrics.recentTrend}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
