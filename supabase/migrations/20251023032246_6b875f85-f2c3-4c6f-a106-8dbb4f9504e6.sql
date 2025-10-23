-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create analysis history table
CREATE TABLE public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sport_id TEXT NOT NULL,
  drill_name TEXT NOT NULL,
  video_path TEXT,
  score NUMERIC,
  metrics JSONB,
  feedback JSONB,
  coaching_tips JSONB,
  analysis_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analysis_history FOR DELETE
  USING (auth.uid() = user_id);

-- Create rate limiting table
CREATE TABLE public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, endpoint, window_start)
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rate limits"
  ON public.api_rate_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _user_id UUID,
  _endpoint TEXT,
  _max_requests INTEGER,
  _window_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  _window_start TIMESTAMPTZ;
  _request_count INTEGER;
BEGIN
  -- Calculate window start (round down to window boundary)
  _window_start := DATE_TRUNC('minute', NOW()) - 
                   (EXTRACT(MINUTE FROM NOW())::INTEGER % _window_minutes) * INTERVAL '1 minute';
  
  -- Get current request count for this window
  SELECT request_count INTO _request_count
  FROM public.api_rate_limits
  WHERE user_id = _user_id 
    AND endpoint = _endpoint
    AND window_start = _window_start;
  
  -- If no record exists, create one
  IF _request_count IS NULL THEN
    INSERT INTO public.api_rate_limits (user_id, endpoint, window_start, request_count)
    VALUES (_user_id, _endpoint, _window_start, 1);
    RETURN TRUE;
  END IF;
  
  -- Check if under limit
  IF _request_count < _max_requests THEN
    UPDATE public.api_rate_limits
    SET request_count = request_count + 1
    WHERE user_id = _user_id 
      AND endpoint = _endpoint
      AND window_start = _window_start;
    RETURN TRUE;
  END IF;
  
  -- Over limit
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create index for faster rate limit lookups
CREATE INDEX idx_rate_limits_user_endpoint ON public.api_rate_limits(user_id, endpoint, window_start);
CREATE INDEX idx_analysis_history_user ON public.analysis_history(user_id, created_at DESC);