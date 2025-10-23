import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AthletesList } from '@/components/athletes/AthletesList';
import { AthleteForm } from '@/components/athletes/AthleteForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Athlete {
  id: string;
  name: string;
  position?: string;
  jersey_number?: string;
  sport?: string;
  date_of_birth?: string;
  notes?: string;
}

const AthletesPage = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | undefined>();

  const fetchAthletes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .order('name');

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      toast.error('Failed to load athletes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  const handleCreateClick = () => {
    setSelectedAthlete(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setDialogOpen(false);
    setSelectedAthlete(undefined);
    fetchAthletes();
  };

  const handleFormCancel = () => {
    setDialogOpen(false);
    setSelectedAthlete(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Athletes</h1>
              <p className="text-muted-foreground mt-2">
                Manage athlete profiles and track their performance
              </p>
            </div>
            <Button onClick={handleCreateClick} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Athlete
            </Button>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Parent & Guardian Account</CardTitle>
              <CardDescription>
                This account allows you to manage multiple athlete profiles. Create profiles for
                the athletes you coach or supervise, and track their performance over time.
              </CardDescription>
            </CardHeader>
          </Card>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <AthletesList
              athletes={athletes}
              onEdit={handleEditClick}
              onRefresh={fetchAthletes}
            />
          )}
        </div>
      </main>

      <Footer />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAthlete ? 'Edit Athlete' : 'Create New Athlete'}
            </DialogTitle>
            <DialogDescription>
              {selectedAthlete
                ? 'Update athlete information and track their development.'
                : 'Add a new athlete profile to start tracking their performance.'}
            </DialogDescription>
          </DialogHeader>
          <AthleteForm
            athlete={selectedAthlete}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AthletesPage;
