
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Loader2, Check, User, Medal, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SPORTS } from '@/lib/constants';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  avatar_url: z.string().optional(),
  theme_preference: z.enum(['light', 'dark', 'system']).default('system'),
  email_notifications: z.boolean().default(true),
  bio: z.string().max(250, 'Bio must be less than 250 characters').optional(),
  preferred_sport: z.string().optional(),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'professional']).optional(),
  training_frequency: z.enum(['daily', 'weekly', 'monthly', 'occasionally']).optional(),
  privacy_level: z.enum(['public', 'friends', 'private']).default('public'),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileEditFormProps {
  initialData: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    theme_preference?: 'light' | 'dark' | 'system';
    email_notifications?: boolean;
    bio?: string | null;
    preferred_sport?: string | null;
    skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'professional' | null;
    training_frequency?: 'daily' | 'weekly' | 'monthly' | 'occasionally' | null;
    privacy_level?: 'public' | 'friends' | 'private' | null;
  };
  onProfileUpdate: () => void;
}

const ProfileEditForm = ({ initialData, onProfileUpdate }: ProfileEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: initialData.full_name || '',
      username: initialData.username || '',
      avatar_url: initialData.avatar_url || '',
      theme_preference: initialData.theme_preference || 'system',
      email_notifications: initialData.email_notifications !== undefined ? initialData.email_notifications : true,
      bio: initialData.bio || '',
      preferred_sport: initialData.preferred_sport || '',
      skill_level: initialData.skill_level || undefined,
      training_frequency: initialData.training_frequency || undefined,
      privacy_level: initialData.privacy_level || 'public',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          username: values.username,
          avatar_url: values.avatar_url,
          theme_preference: values.theme_preference,
          email_notifications: values.email_notifications,
          bio: values.bio,
          preferred_sport: values.preferred_sport,
          skill_level: values.skill_level,
          training_frequency: values.training_frequency,
          privacy_level: values.privacy_level,
        })
        .eq('id', initialData.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      onProfileUpdate();
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={form.getValues('avatar_url') || ''} alt="Profile" />
            <AvatarFallback className="text-2xl">
              {form.getValues('full_name')?.charAt(0) || form.getValues('username')?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="w-full max-w-sm">
                <FormLabel>Profile Picture URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about yourself and your athletic journey..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                {250 - (field.value?.length || 0)} characters remaining
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="preferred_sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Sport</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SPORTS.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This will be displayed on your profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skill_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="training_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Frequency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-2"
                >
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="daily" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Daily</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="weekly" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Weekly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="monthly" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Monthly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="occasionally" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Occasionally</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy & Preferences</h3>
          
          <FormField
            control={form.control}
            name="privacy_level"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Profile Privacy</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Control who can see your profile information
                  </div>
                </div>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="theme_preference"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Theme Preference</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </div>
                </div>
                <FormControl>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant={field.value === 'light' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => field.onChange('light')}
                    >
                      Light
                    </Button>
                    <Button 
                      type="button" 
                      variant={field.value === 'dark' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => field.onChange('dark')}
                    >
                      Dark
                    </Button>
                    <Button 
                      type="button" 
                      variant={field.value === 'system' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => field.onChange('system')}
                    >
                      System
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email_notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Receive email updates about your progress
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !form.formState.isDirty}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
