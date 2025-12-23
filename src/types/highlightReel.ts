export interface HighlightReelMetadata {
  video_id: string;
  team: string;
  opponent: string;
  game_date: string;
  clip_start_time: string;
  clip_end_time: string;
  analyst: string;
  source_method: Array<'computer_vision' | 'manual_review'>;
}

export interface PlayContext {
  possession_phase: 'offense' | 'defense' | 'transition' | 'inbound';
  play_type: 'pick_and_roll' | 'isolation' | 'horns' | 'zone_press' | 'motion' | 'fast_break' | 'other';
  formation: string;
  situation: 'live_play' | 'stoppage' | 'turnover' | 'inbound' | 'end_game';
}

export interface ActionMetrics {
  reaction_time_sec?: number;
  distance_m?: number;
  angle_deg?: number;
  defender_proximity_m?: number;
  spacing_efficiency_score?: number;
}

export interface TangibleAction {
  event_type: 'pass' | 'drive' | 'shot' | 'screen' | 'rebound' | 'rotation' | 'turnover';
  timestamp: string;
  player_role: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  result: 'success' | 'failure' | 'neutral';
  metrics: ActionMetrics;
}

export interface TangiblePerformance {
  actions: TangibleAction[];
  overall_summary: {
    execution_quality: number;
    decision_accuracy: number;
    spacing_index: number;
    transition_speed_sec: number;
  };
}

export interface IntangibleMetric {
  definition: string;
  observed_instances: number;
  successful_instances: number;
  percentage_correct: number;
  qualitative_example: string;
}

export interface IntangiblePerformance {
  courage: IntangibleMetric;
  composure: IntangibleMetric;
  initiative: IntangibleMetric;
  leadership: IntangibleMetric;
  effectiveness_under_stress: IntangibleMetric;
  discipline?: IntangibleMetric;
  focus?: IntangibleMetric;
  consistency?: IntangibleMetric;
  game_iq?: IntangibleMetric;
}

export interface IntegratedInsight {
  summary: string;
  correlation_metrics: {
    intangible_to_outcome_correlation: number;
    intangibles_overall_score: number;
    tangible_efficiency_score: number;
  };
  radar_chart_data: {
    courage: number;
    composure: number;
    initiative: number;
    leadership: number;
    effectiveness_under_stress: number;
    discipline?: number;
    focus?: number;
    consistency?: number;
    game_iq?: number;
  };
}

export interface ActionStep {
  focus_area: 'courage' | 'composure' | 'initiative' | 'leadership' | 'effectiveness' | 'discipline' | 'focus' | 'consistency' | 'game_iq';
  training_drill: string;
  measurement_goal: string;
}

export interface CoachingRecommendations {
  key_takeaways: string[];
  action_steps: ActionStep[];
}

export interface HighlightReelAnalysis {
  metadata: HighlightReelMetadata;
  play_context: PlayContext;
  tangible_performance: TangiblePerformance;
  intangible_performance: IntangiblePerformance;
  integrated_insight: IntegratedInsight;
  coaching_recommendations: CoachingRecommendations;
}
