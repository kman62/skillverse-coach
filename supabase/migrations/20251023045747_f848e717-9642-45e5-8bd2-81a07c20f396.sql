-- Create athletes table for parent/guardian managed profiles
CREATE TABLE public.athletes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guardian_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT,
  jersey_number TEXT,
  sport TEXT,
  date_of_birth DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on athletes table
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Guardians can view their own athletes
CREATE POLICY "Guardians can view own athletes"
  ON public.athletes FOR SELECT
  USING (auth.uid() = guardian_id);

-- Guardians can insert their own athletes
CREATE POLICY "Guardians can insert own athletes"
  ON public.athletes FOR INSERT
  WITH CHECK (auth.uid() = guardian_id);

-- Guardians can update their own athletes
CREATE POLICY "Guardians can update own athletes"
  ON public.athletes FOR UPDATE
  USING (auth.uid() = guardian_id)
  WITH CHECK (auth.uid() = guardian_id);

-- Guardians can delete their own athletes
CREATE POLICY "Guardians can delete own athletes"
  ON public.athletes FOR DELETE
  USING (auth.uid() = guardian_id);

-- Add athlete_id column to analysis_history to link analyses to specific athletes
ALTER TABLE public.analysis_history 
ADD COLUMN athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE;

-- Create index for faster athlete lookups
CREATE INDEX idx_athletes_guardian_id ON public.athletes(guardian_id);
CREATE INDEX idx_analysis_history_athlete_id ON public.analysis_history(athlete_id);

-- Create trigger for automatic timestamp updates on athletes
CREATE TRIGGER update_athletes_updated_at
  BEFORE UPDATE ON public.athletes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table comment to clarify it's for guardians/coaches
COMMENT ON TABLE public.profiles IS 'Parent, guardian, and coach profiles who manage athlete accounts';