import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const athleteSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  position: z.string().trim().max(50, 'Position must be less than 50 characters').optional(),
  jersey_number: z.string().trim().max(10, 'Jersey number must be less than 10 characters').optional(),
  sport: z.string().optional(),
  date_of_birth: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type AthleteFormValues = z.infer<typeof athleteSchema>;

interface AthleteFormProps {
  athlete?: {
    id: string;
    name: string;
    position?: string;
    jersey_number?: string;
    sport?: string;
    date_of_birth?: string;
    notes?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const SPORTS = [
  { value: 'basketball', label: 'Basketball' },
  { value: 'baseball', label: 'Baseball' },
  { value: 'football', label: 'Football' },
  { value: 'soccer', label: 'Soccer' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'golf', label: 'Golf' },
  { value: 'rugby', label: 'Rugby' },
];

export const AthleteForm = ({ athlete, onSuccess, onCancel }: AthleteFormProps) => {
  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: athlete?.name || '',
      position: athlete?.position || '',
      jersey_number: athlete?.jersey_number || '',
      sport: athlete?.sport || '',
      date_of_birth: athlete?.date_of_birth || '',
      notes: athlete?.notes || '',
    },
  });

  const onSubmit = async (values: AthleteFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const athleteData = {
        name: values.name,
        guardian_id: user.id,
        // Convert empty strings to null for optional fields
        position: values.position || null,
        jersey_number: values.jersey_number || null,
        sport: values.sport || null,
        date_of_birth: values.date_of_birth || null,
        notes: values.notes || null,
      };

      if (athlete?.id) {
        // Update existing athlete
        const { error } = await supabase
          .from('athletes')
          .update(athleteData)
          .eq('id', athlete.id);

        if (error) throw error;
        toast.success('Athlete updated successfully');
      } else {
        // Create new athlete
        const { error } = await supabase
          .from('athletes')
          .insert([athleteData]);

        if (error) throw error;
        toast.success('Athlete created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving athlete:', error);
      toast.error('Failed to save athlete');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Athlete Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alex Johnson" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Sport</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORTS.map((sport) => (
                    <SelectItem key={sport.value} value={sport.value}>
                      {sport.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Point Guard" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jersey_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jersey Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Optional - helps track age-appropriate development
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about this athlete..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                e.g., goals, medical considerations, or training focus
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving...'
              : athlete?.id
              ? 'Update Athlete'
              : 'Create Athlete'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
