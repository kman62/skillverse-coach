import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import ProfileOverview from '@/components/profile/ProfileOverview';
import SportAchievements from '@/components/profile/SportAchievements';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAnalysisHistory();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      return;
    }

    if (!data) {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.email?.split('@')[0] || 'User'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        toast.error('Failed to create profile');
        return;
      }

      setProfile(newProfile);
      setEditedName(newProfile.name || '');
    } else {
      setProfile(data);
      setEditedName(data.name || '');
    }
  };

  const fetchAnalysisHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis history:', error);
      return;
    }

    setRecentActivities(data || []);
    
    // Transform data for progress chart
    const chartData = (data || []).map(item => ({
      date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: item.score || 0
    }));
    
    setProgressData(chartData);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name: editedName })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } else {
      setProfile({ ...profile, name: editedName });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }
    setIsSaving(false);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const achievements = recentActivities.length > 0 ? [
    {
      id: '1',
      title: 'First Analysis',
      description: 'Completed your first video analysis',
      icon: '🎯',
      unlocked: true,
      date: new Date(recentActivities[0].created_at).toISOString(),
      sport: 'all',
      level: 'bronze' as const,
      progress: 100
    },
    ...(recentActivities.length >= 3 ? [{
      id: '2',
      title: 'Dedicated Athlete',
      description: 'Completed 3+ video analyses',
      icon: '🔥',
      unlocked: true,
      date: new Date(recentActivities[2].created_at).toISOString(),
      sport: 'all',
      level: 'silver' as const,
      progress: 100
    }] : []),
    ...(recentActivities.some((a: any) => a.score >= 80) ? [{
      id: '3',
      title: 'Excellence',
      description: 'Achieved a score of 80 or higher',
      icon: '⭐',
      unlocked: true,
      date: new Date(recentActivities.find((a: any) => a.score >= 80)?.created_at).toISOString(),
      sport: 'all',
      level: 'gold' as const,
      progress: 100
    }] : [])
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-64"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">{profile.name || 'User'}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <p>{profile.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(profile.name || '');
                      }}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p>
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <ProfileOverview
                profile={profile}
                recentActivities={recentActivities}
                progressData={progressData}
                accuracyMetrics={[]}
              />
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <SportAchievements achievements={achievements} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
