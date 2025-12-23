-- Add new intangible metric columns to player_intangible_profiles
ALTER TABLE public.player_intangible_profiles
ADD COLUMN discipline_avg DECIMAL(3,2) CHECK (discipline_avg >= 1 AND discipline_avg <= 5),
ADD COLUMN focus_avg DECIMAL(3,2) CHECK (focus_avg >= 1 AND focus_avg <= 5),
ADD COLUMN consistency_avg DECIMAL(3,2) CHECK (consistency_avg >= 1 AND consistency_avg <= 5),
ADD COLUMN game_iq_avg DECIMAL(3,2) CHECK (game_iq_avg >= 1 AND game_iq_avg <= 5);

-- Drop the old check constraint on intangible_ratings.metric_name
ALTER TABLE public.intangible_ratings DROP CONSTRAINT IF EXISTS intangible_ratings_metric_name_check;

-- Add new check constraint with expanded metric names
ALTER TABLE public.intangible_ratings 
ADD CONSTRAINT intangible_ratings_metric_name_check 
CHECK (metric_name IN ('courage', 'composure', 'initiative', 'leadership', 'effectiveness_under_stress', 'resilience', 'discipline', 'focus', 'consistency', 'game_iq'));