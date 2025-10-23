import { useState } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

interface AthletesListProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onRefresh: () => void;
}

export const AthletesList = ({ athletes, onEdit, onRefresh }: AthletesListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<Athlete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (athlete: Athlete) => {
    setAthleteToDelete(athlete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!athleteToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', athleteToDelete.id);

      if (error) throw error;

      toast.success(`${athleteToDelete.name} removed successfully`);
      onRefresh();
    } catch (error) {
      console.error('Error deleting athlete:', error);
      toast.error('Failed to remove athlete');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setAthleteToDelete(null);
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (athletes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Athletes Yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Create athlete profiles to start tracking performance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {athletes.map((athlete) => {
          const age = calculateAge(athlete.date_of_birth);
          
          return (
            <Card key={athlete.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{athlete.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {athlete.sport && <span className="capitalize">{athlete.sport}</span>}
                      {athlete.sport && (athlete.position || athlete.jersey_number) && ' • '}
                      {athlete.position && <span>{athlete.position}</span>}
                      {athlete.position && athlete.jersey_number && ' • '}
                      {athlete.jersey_number && <span>#{athlete.jersey_number}</span>}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {age && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{age} years old</Badge>
                  </div>
                )}
                {athlete.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {athlete.notes}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(athlete)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(athlete)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Athlete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {athleteToDelete?.name}? This will also delete all
              their analysis history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
