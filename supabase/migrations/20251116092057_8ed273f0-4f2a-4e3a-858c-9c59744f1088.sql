-- Create table for individual intangible ratings per clip
CREATE TABLE public.intangible_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.analysis_history(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL CHECK (metric_name IN ('courage', 'composure', 'initiative', 'leadership', 'effectiveness_under_stress', 'resilience')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for extracted highlights
CREATE TABLE public.extracted_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.analysis_history(id) ON DELETE CASCADE,
  highlight_type TEXT NOT NULL CHECK (highlight_type IN ('scoring', 'defensive', 'hustle', 'playmaking', 'intangible')),
  time_range TEXT,
  description TEXT,
  coaching_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for aggregated player intangible profiles
CREATE TABLE public.player_intangible_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  sport TEXT NOT NULL,
  date_range_start DATE,
  date_range_end DATE,
  courage_avg DECIMAL(3,2) CHECK (courage_avg >= 1 AND courage_avg <= 5),
  composure_avg DECIMAL(3,2) CHECK (composure_avg >= 1 AND composure_avg <= 5),
  initiative_avg DECIMAL(3,2) CHECK (initiative_avg >= 1 AND initiative_avg <= 5),
  leadership_avg DECIMAL(3,2) CHECK (leadership_avg >= 1 AND leadership_avg <= 5),
  stress_effectiveness_avg DECIMAL(3,2) CHECK (stress_effectiveness_avg >= 1 AND stress_effectiveness_avg <= 5),
  resilience_avg DECIMAL(3,2) CHECK (resilience_avg >= 1 AND resilience_avg <= 5),
  primary_focus TEXT,
  secondary_focus TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.intangible_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_intangible_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for intangible_ratings
CREATE POLICY "Users can view own intangible ratings"
  ON public.intangible_ratings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analysis_history
      WHERE analysis_history.id = intangible_ratings.analysis_id
      AND analysis_history.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own intangible ratings"
  ON public.intangible_ratings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analysis_history
      WHERE analysis_history.id = intangible_ratings.analysis_id
      AND analysis_history.user_id = auth.uid()
    )
  );

-- Create RLS policies for extracted_highlights
CREATE POLICY "Users can view own highlights"
  ON public.extracted_highlights
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.analysis_history
      WHERE analysis_history.id = extracted_highlights.analysis_id
      AND analysis_history.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own highlights"
  ON public.extracted_highlights
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analysis_history
      WHERE analysis_history.id = extracted_highlights.analysis_id
      AND analysis_history.user_id = auth.uid()
    )
  );

-- Create RLS policies for player_intangible_profiles
CREATE POLICY "Users can view own player profiles"
  ON public.player_intangible_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.athletes
      WHERE athletes.id = player_intangible_profiles.athlete_id
      AND athletes.guardian_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own player profiles"
  ON public.player_intangible_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.athletes
      WHERE athletes.id = player_intangible_profiles.athlete_id
      AND athletes.guardian_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own player profiles"
  ON public.player_intangible_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.athletes
      WHERE athletes.id = player_intangible_profiles.athlete_id
      AND athletes.guardian_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_intangible_ratings_analysis_id ON public.intangible_ratings(analysis_id);
CREATE INDEX idx_extracted_highlights_analysis_id ON public.extracted_highlights(analysis_id);
CREATE INDEX idx_player_intangible_profiles_athlete_id ON public.player_intangible_profiles(athlete_id);
CREATE INDEX idx_player_intangible_profiles_date_range ON public.player_intangible_profiles(date_range_start, date_range_end);