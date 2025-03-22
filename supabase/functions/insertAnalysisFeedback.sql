
-- Function to safely insert feedback
CREATE OR REPLACE FUNCTION public.insert_analysis_feedback(
  p_user_id UUID,
  p_analysis_id UUID,
  p_sport_id TEXT,
  p_drill_id TEXT,
  p_rating INTEGER,
  p_comments TEXT,
  p_original_score INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.analysis_feedback (
    user_id,
    analysis_id,
    sport_id,
    drill_id,
    rating,
    comments,
    original_score
  ) VALUES (
    p_user_id,
    p_analysis_id,
    p_sport_id,
    p_drill_id,
    p_rating,
    p_comments,
    p_original_score
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_analysis_feedback TO authenticated;
