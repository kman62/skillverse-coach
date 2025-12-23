import { useEffect, useState } from 'react';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronDown, GraduationCap, Ruler, Shirt, School } from 'lucide-react';

// Extended schema with all 26 fields
const athleteSchema = z.object({
  // Basic fields
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  position: z.string().trim().max(50).optional(),
  jersey_number: z.string().trim().max(10).optional(),
  sport: z.string().optional(),
  date_of_birth: z.string().optional(),
  notes: z.string().max(500).optional(),
  
  // Competition Level & School Info
  competition_level: z.string().optional(),
  graduation_year: z.coerce.number().int().min(2000).max(2040).optional().nullable(),
  school_name: z.string().max(100).optional(),
  team_name: z.string().max(100).optional(),
  
  // Physical Measurables (Common)
  height_inches: z.coerce.number().positive().max(96).optional().nullable(),
  weight_lbs: z.coerce.number().positive().max(500).optional().nullable(),
  wingspan_inches: z.coerce.number().positive().max(120).optional().nullable(),
  vertical_jump_inches: z.coerce.number().positive().max(60).optional().nullable(),
  
  // Sport-Specific Measurables
  forty_yard_dash: z.coerce.number().positive().max(10).optional().nullable(),
  sixty_yard_dash: z.coerce.number().positive().max(12).optional().nullable(),
  shuttle_time: z.coerce.number().positive().max(20).optional().nullable(),
  exit_velocity_mph: z.coerce.number().positive().max(120).optional().nullable(),
  pitch_velocity_mph: z.coerce.number().positive().max(110).optional().nullable(),
  serve_speed_mph: z.coerce.number().positive().max(160).optional().nullable(),
  utr_rating: z.coerce.number().positive().max(16.5).optional().nullable(),
  handicap: z.coerce.number().min(-10).max(54).optional().nullable(),
  
  // Academic Info
  gpa: z.coerce.number().min(0).max(5).optional().nullable(),
  sat_score: z.coerce.number().int().min(400).max(1600).optional().nullable(),
  act_score: z.coerce.number().int().min(1).max(36).optional().nullable(),
  
  // Video Identification
  jersey_color: z.string().max(30).optional(),
});

type AthleteFormValues = z.infer<typeof athleteSchema>;

export interface AthleteData {
  id: string;
  name: string;
  position?: string | null;
  jersey_number?: string | null;
  sport?: string | null;
  date_of_birth?: string | null;
  notes?: string | null;
  competition_level?: string | null;
  graduation_year?: number | null;
  school_name?: string | null;
  team_name?: string | null;
  height_inches?: number | null;
  weight_lbs?: number | null;
  wingspan_inches?: number | null;
  vertical_jump_inches?: number | null;
  forty_yard_dash?: number | null;
  sixty_yard_dash?: number | null;
  shuttle_time?: number | null;
  exit_velocity_mph?: number | null;
  pitch_velocity_mph?: number | null;
  serve_speed_mph?: number | null;
  utr_rating?: number | null;
  handicap?: number | null;
  gpa?: number | null;
  sat_score?: number | null;
  act_score?: number | null;
  jersey_color?: string | null;
}

interface AthleteFormProps {
  athlete?: AthleteData;
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
  { value: 'volleyball', label: 'Volleyball' },
];

const COMPETITION_LEVELS = [
  { value: 'youth', label: 'Youth (U10-U14)', group: 'Youth' },
  { value: 'middle_school', label: 'Middle School', group: 'Youth' },
  { value: 'high_school', label: 'High School', group: 'High School' },
  { value: 'juco', label: 'Junior College (JUCO)', group: 'College' },
  { value: 'd3', label: 'NCAA Division III', group: 'College' },
  { value: 'd2', label: 'NCAA Division II', group: 'College' },
  { value: 'd1', label: 'NCAA Division I', group: 'College' },
  { value: 'professional', label: 'Professional', group: 'Professional' },
];

const JERSEY_COLORS = [
  'White', 'Black', 'Red', 'Blue', 'Navy', 'Green',
  'Yellow', 'Orange', 'Purple', 'Gray', 'Gold', 'Maroon',
];

const generateGraduationYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i <= currentYear + 8; i++) {
    years.push(i);
  }
  return years;
};

export const AthleteForm = ({ athlete, onSuccess, onCancel }: AthleteFormProps) => {
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(0);
  
  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      name: athlete?.name || '',
      position: athlete?.position || '',
      jersey_number: athlete?.jersey_number || '',
      sport: athlete?.sport || '',
      date_of_birth: athlete?.date_of_birth || '',
      notes: athlete?.notes || '',
      competition_level: athlete?.competition_level || '',
      graduation_year: athlete?.graduation_year || undefined,
      school_name: athlete?.school_name || '',
      team_name: athlete?.team_name || '',
      height_inches: athlete?.height_inches || undefined,
      weight_lbs: athlete?.weight_lbs || undefined,
      wingspan_inches: athlete?.wingspan_inches || undefined,
      vertical_jump_inches: athlete?.vertical_jump_inches || undefined,
      forty_yard_dash: athlete?.forty_yard_dash || undefined,
      sixty_yard_dash: athlete?.sixty_yard_dash || undefined,
      shuttle_time: athlete?.shuttle_time || undefined,
      exit_velocity_mph: athlete?.exit_velocity_mph || undefined,
      pitch_velocity_mph: athlete?.pitch_velocity_mph || undefined,
      serve_speed_mph: athlete?.serve_speed_mph || undefined,
      utr_rating: athlete?.utr_rating || undefined,
      handicap: athlete?.handicap || undefined,
      gpa: athlete?.gpa || undefined,
      sat_score: athlete?.sat_score || undefined,
      act_score: athlete?.act_score || undefined,
      jersey_color: athlete?.jersey_color || '',
    },
  });

  const selectedSport = form.watch('sport');
  const selectedLevel = form.watch('competition_level');

  // Initialize height from athlete data
  useEffect(() => {
    if (athlete?.height_inches) {
      setHeightFeet(Math.floor(athlete.height_inches / 12));
      setHeightInches(athlete.height_inches % 12);
    }
  }, [athlete?.height_inches]);

  // Update height_inches when feet/inches change
  useEffect(() => {
    const totalInches = (heightFeet * 12) + heightInches;
    if (totalInches > 0) {
      form.setValue('height_inches', totalInches);
    }
  }, [heightFeet, heightInches, form]);

  // Conditional display logic
  const showAcademicFields = ['high_school', 'juco', 'd3', 'd2', 'd1'].includes(selectedLevel || '');
  const showSchoolFields = selectedLevel && selectedLevel !== 'professional';
  const showFootballFields = selectedSport === 'football';
  const showBaseballFields = selectedSport === 'baseball';
  const showTennisFields = selectedSport === 'tennis';
  const showGolfFields = selectedSport === 'golf';
  const showBasketballFootballFields = selectedSport === 'basketball' || selectedSport === 'football';

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
        position: values.position || null,
        jersey_number: values.jersey_number || null,
        sport: values.sport || null,
        date_of_birth: values.date_of_birth || null,
        notes: values.notes || null,
        competition_level: values.competition_level || null,
        graduation_year: values.graduation_year || null,
        school_name: values.school_name || null,
        team_name: values.team_name || null,
        height_inches: values.height_inches || null,
        weight_lbs: values.weight_lbs || null,
        wingspan_inches: values.wingspan_inches || null,
        vertical_jump_inches: values.vertical_jump_inches || null,
        forty_yard_dash: values.forty_yard_dash || null,
        sixty_yard_dash: values.sixty_yard_dash || null,
        shuttle_time: values.shuttle_time || null,
        exit_velocity_mph: values.exit_velocity_mph || null,
        pitch_velocity_mph: values.pitch_velocity_mph || null,
        serve_speed_mph: values.serve_speed_mph || null,
        utr_rating: values.utr_rating || null,
        handicap: values.handicap || null,
        gpa: values.gpa || null,
        sat_score: values.sat_score || null,
        act_score: values.act_score || null,
        jersey_color: values.jersey_color || null,
      };

      if (athlete?.id) {
        const { error } = await supabase
          .from('athletes')
          .update(athleteData)
          .eq('id', athlete.id);

        if (error) throw error;
        toast.success('Athlete updated successfully');
      } else {
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

  const groupedLevels = COMPETITION_LEVELS.reduce((acc, level) => {
    if (!acc[level.group]) {
      acc[level.group] = [];
    }
    acc[level.group].push(level);
    return acc;
  }, {} as Record<string, typeof COMPETITION_LEVELS>);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information - Always Visible */}
        <div className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="competition_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competition Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(groupedLevels).map(([group, levels]) => (
                        <SelectGroup key={group}>
                          <SelectLabel>{group}</SelectLabel>
                          {levels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                  <FormLabel>Jersey #</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 23" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jersey_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jersey Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JERSEY_COLORS.map((color) => (
                        <SelectItem key={color} value={color.toLowerCase()}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full border border-border" 
                              style={{ backgroundColor: color.toLowerCase() }}
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="w-full" defaultValue={['school']}>
          {/* School & Team Information */}
          <AccordionItem value="school">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4" />
                School & Team Information
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="school_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lincoln High School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="team_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {showSchoolFields && (
                  <FormField
                    control={form.control}
                    name="graduation_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(parseInt(val))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generateGraduationYears().map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Physical Measurables */}
          <AccordionItem value="physical">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Physical Measurables
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {/* Height with Feet/Inches */}
              <div className="grid grid-cols-3 gap-4">
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      value={heightFeet.toString()} 
                      onValueChange={(val) => setHeightFeet(parseInt(val))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6, 7].map((ft) => (
                          <SelectItem key={ft} value={ft.toString()}>{ft} ft</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={heightInches.toString()} 
                      onValueChange={(val) => setHeightInches(parseInt(val))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                          <SelectItem key={inch} value={inch.toString()}>{inch} in</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="weight_lbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 185" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wingspan_inches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wingspan (in)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 76" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Common Athletic Measurables */}
              {showBasketballFootballFields && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vertical_jump_inches"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vertical Jump (in)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 32" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showFootballFields && (
                    <FormField
                      control={form.control}
                      name="forty_yard_dash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>40-Yard Dash (sec)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="e.g., 4.5" 
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {showFootballFields && (
                <FormField
                  control={form.control}
                  name="shuttle_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shuttle Time (sec)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="e.g., 4.2" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Baseball-Specific */}
              {showBaseballFields && (
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="sixty_yard_dash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>60-Yard Dash (sec)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="e.g., 6.8" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="exit_velocity_mph"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exit Velocity (mph)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 95" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pitch_velocity_mph"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pitch Velocity (mph)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 88" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Tennis-Specific */}
              {showTennisFields && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serve_speed_mph"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serve Speed (mph)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 115" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="utr_rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UTR Rating</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="e.g., 12.5" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>Universal Tennis Rating (1-16.5)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Golf-Specific */}
              {showGolfFields && (
                <FormField
                  control={form.control}
                  name="handicap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Golf Handicap</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="e.g., 5.2" 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>Range: -10 to 54</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Academic Information - Only for HS/College */}
          {showAcademicFields && (
            <AccordionItem value="academic">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Academic Information
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="e.g., 3.5" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>0.0 - 5.0 scale</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sat_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SAT Score</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 1280" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>400 - 1600</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="act_score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ACT Score</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 28" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>1 - 36</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Notes */}
          <AccordionItem value="notes">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Additional Notes
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Goals, medical considerations, training focus, recruiting interests..."
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional information about this athlete (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
