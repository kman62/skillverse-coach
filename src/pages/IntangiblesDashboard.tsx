import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, Target, Video, Upload, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Athlete {
  id: string;
  name: string;
  sport: string;
}

interface IntangibleProfile {
  id: string;
  athlete_id: string;
  sport: string;
  date_range_start: string;
  date_range_end: string;
  courage_avg: number;
  composure_avg: number;
  initiative_avg: number;
  leadership_avg: number;
  stress_effectiveness_avg: number;
  resilience_avg: number;
  primary_focus: string;
  secondary_focus: string;
  updated_at: string;
}

export default function IntangiblesDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [profile, setProfile] = useState<IntangibleProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to access intangibles dashboard');
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      fetchProfile();
    }
  }, [selectedAthleteId]);

  const fetchAthletes = async () => {
    const { data, error } = await supabase
      .from('athletes')
      .select('id, name, sport')
      .order('name');

    if (error) {
      console.error('Error fetching athletes:', error);
      toast.error('Failed to load athletes');
      return;
    }

    setAthletes(data || []);
    if (data && data.length > 0) {
      setSelectedAthleteId(data[0].id);
    }
  };

  const fetchProfile = async () => {
    if (!selectedAthleteId) return;

    setLoading(true);
    try {
      const athlete = athletes.find(a => a.id === selectedAthleteId);
      if (!athlete) return;

      // Try to get existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('player_intangible_profiles')
        .select('*')
        .eq('athlete_id', selectedAthleteId)
        .eq('sport', athlete.sport)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Generate new profile
        await generateProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load intangible profile');
    } finally {
      setLoading(false);
    }
  };

  const generateProfile = async () => {
    if (!selectedAthleteId || !user) {
      toast.error('Please sign in to generate profile');
      return;
    }

    const athlete = athletes.find(a => a.id === selectedAthleteId);
    if (!athlete) return;

    setLoading(true);
    try {
      // Get fresh session to ensure token is valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please sign in again.');
        navigate('/auth');
        return;
      }

      const response = await supabase.functions.invoke('aggregate-intangibles', {
        body: {
          athlete_id: selectedAthleteId,
          sport: athlete.sport
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      const { data, error } = response;

      // Handle error responses (404 returns error message in data when FunctionsHttpError occurs)
      if (error) {
        // For FunctionsHttpError, the data contains the response body
        if (data?.error) {
          toast.info(data.error);
          setProfile(null);
          return;
        }
        throw error;
      }

      // Check for error message in successful response (shouldn't happen but be safe)
      if (data?.error) {
        toast.info(data.error);
        setProfile(null);
        return;
      }

      if (data?.profile) {
        setProfile(data.profile);
        toast.success('Intangible profile generated successfully');
      } else {
        toast.info('No analysis data available for this athlete. Upload and analyze some clips first.');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error generating profile:', error);
      toast.error('Failed to generate intangible profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = () => {
    if (!profile) return [];

    return [
      { metric: 'Courage', value: profile.courage_avg || 0, fullMark: 5 },
      { metric: 'Composure', value: profile.composure_avg || 0, fullMark: 5 },
      { metric: 'Initiative', value: profile.initiative_avg || 0, fullMark: 5 },
      { metric: 'Leadership', value: profile.leadership_avg || 0, fullMark: 5 },
      { metric: 'Stress Handling', value: profile.stress_effectiveness_avg || 0, fullMark: 5 },
      { metric: 'Resilience', value: profile.resilience_avg || 0, fullMark: 5 },
    ];
  };

  const formatMetricName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/athletes')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Intangibles Dashboard</h1>
          <p className="text-muted-foreground">
            Track psychological metrics and development over time
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Select value={selectedAthleteId} onValueChange={setSelectedAthleteId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select an athlete" />
          </SelectTrigger>
          <SelectContent>
            {athletes.map(athlete => (
              <SelectItem key={athlete.id} value={athlete.id}>
                {athlete.name} - {athlete.sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      )}

      {!loading && profile && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Intangible Metrics Profile</CardTitle>
              <CardDescription>
                Average ratings from {new Date(profile.date_range_start).toLocaleDateString()} to{' '}
                {new Date(profile.date_range_end).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name="Rating"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Strongest Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'courage', value: profile.courage_avg },
                    { name: 'composure', value: profile.composure_avg },
                    { name: 'initiative', value: profile.initiative_avg },
                    { name: 'leadership', value: profile.leadership_avg },
                    { name: 'stress_effectiveness', value: profile.stress_effectiveness_avg },
                    { name: 'resilience', value: profile.resilience_avg },
                  ]
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
                    .slice(0, 3)
                    .map(metric => (
                      <div key={metric.name} className="flex justify-between items-center">
                        <span className="font-medium">{formatMetricName(metric.name)}</span>
                        <span className="text-2xl font-bold text-green-500">
                          {metric.value?.toFixed(1) || '—'}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Development Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Focus</p>
                    <p className="text-lg font-semibold">
                      {profile.primary_focus ? formatMetricName(profile.primary_focus) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Secondary Focus</p>
                    <p className="text-lg font-semibold">
                      {profile.secondary_focus ? formatMetricName(profile.secondary_focus) : 'Not set'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={generateProfile}
              disabled={loading}
              className="w-full"
            >
              Refresh Profile
            </Button>
          </div>
        </div>
      )}

      {!loading && !profile && selectedAthleteId && (
        <Card className="border-dashed border-2">
          <CardContent className="py-16">
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Intangible Data Yet</h3>
                <p className="text-muted-foreground">
                  Intangible metrics like courage, composure, and leadership are generated from video analysis. Upload and analyze clips to start tracking psychological development.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">How to get started:</p>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <p className="text-sm text-muted-foreground">Go to Highlight Reel and upload a video clip</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <p className="text-sm text-muted-foreground">Run AI analysis on the clip with this athlete selected</p>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <p className="text-sm text-muted-foreground">Return here to see aggregated intangible metrics</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/highlight-reel')} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Clips
                </Button>
                <Button variant="outline" onClick={generateProfile} disabled={loading} className="gap-2">
                  <Video className="h-4 w-4" />
                  Check for Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
