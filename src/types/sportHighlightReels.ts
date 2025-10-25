// Sport-specific highlight reel analysis types

// ========== BASEBALL ==========
export interface BaseballPlayContext {
  possession_phase: 'batting' | 'pitching' | 'fielding' | 'baserunning';
  play_type: 'hit' | 'pitch' | 'catch' | 'throw' | 'stolen_base' | 'other';
  situation: string;
  count?: string;
  outs?: number;
}

export interface BaseballTangiblePerformance {
  actions: Array<{
    event_type: 'swing' | 'pitch' | 'catch' | 'throw' | 'run';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      bat_speed_mph?: number;
      pitch_velocity_mph?: number;
      exit_velocity_mph?: number;
      launch_angle_deg?: number;
      reaction_time_sec?: number;
      accuracy_score?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    mechanics_rating: number;
    power_index: number;
    consistency_score: number;
  };
}

export interface BaseballIntangiblePerformance {
  mental_toughness: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  game_awareness: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  competitive_fire: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  leadership: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  clutch_performance: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== FOOTBALL ==========
export interface FootballPlayContext {
  possession_phase: 'offense' | 'defense' | 'special_teams';
  play_type: 'pass' | 'run' | 'tackle' | 'block' | 'coverage' | 'return' | 'other';
  formation: string;
  situation: string;
  down_distance?: string;
}

export interface FootballTangiblePerformance {
  actions: Array<{
    event_type: 'throw' | 'catch' | 'run' | 'tackle' | 'block' | 'coverage';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      speed_mph?: number;
      distance_yards?: number;
      reaction_time_sec?: number;
      separation_yards?: number;
      force_impact?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    technique_rating: number;
    athleticism_index: number;
    consistency_score: number;
  };
}

export interface FootballIntangiblePerformance {
  toughness: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  football_iq: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  competitiveness: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  leadership: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  instincts: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== SOCCER ==========
export interface SoccerPlayContext {
  possession_phase: 'attack' | 'defense' | 'transition' | 'set_piece';
  play_type: 'pass' | 'dribble' | 'shot' | 'tackle' | 'header' | 'save' | 'other';
  formation: string;
  situation: string;
}

export interface SoccerTangiblePerformance {
  actions: Array<{
    event_type: 'pass' | 'shot' | 'dribble' | 'tackle' | 'interception' | 'save';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      speed_kmh?: number;
      accuracy_pct?: number;
      distance_m?: number;
      touch_quality?: number;
      pressure_rating?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    technical_ability: number;
    tactical_awareness: number;
    work_rate_index: number;
  };
}

export interface SoccerIntangiblePerformance {
  vision: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  composure: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  work_ethic: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  leadership: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  decision_making: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== VOLLEYBALL ==========
export interface VolleyballPlayContext {
  possession_phase: 'serving' | 'receiving' | 'attacking' | 'defending';
  play_type: 'serve' | 'pass' | 'set' | 'hit' | 'block' | 'dig' | 'other';
  rotation: string;
  situation: string;
}

export interface VolleyballTangiblePerformance {
  actions: Array<{
    event_type: 'serve' | 'pass' | 'set' | 'hit' | 'block' | 'dig';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      speed_mph?: number;
      accuracy_rating?: number;
      vertical_jump_in?: number;
      reaction_time_sec?: number;
      placement_score?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    technique_rating: number;
    power_index: number;
    consistency_score: number;
  };
}

export interface VolleyballIntangiblePerformance {
  court_awareness: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  confidence: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  communication: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  leadership: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  resilience: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== TENNIS ==========
export interface TennisPlayContext {
  possession_phase: 'serving' | 'returning' | 'baseline_rally' | 'net_play';
  play_type: 'serve' | 'forehand' | 'backhand' | 'volley' | 'overhead' | 'other';
  court_position: string;
  situation: string;
}

export interface TennisTangiblePerformance {
  actions: Array<{
    event_type: 'serve' | 'groundstroke' | 'volley' | 'overhead' | 'movement';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      ball_speed_mph?: number;
      spin_rpm?: number;
      placement_accuracy?: number;
      court_coverage_m?: number;
      reaction_time_sec?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    stroke_mechanics: number;
    court_movement: number;
    consistency_rating: number;
  };
}

export interface TennisIntangiblePerformance {
  mental_fortitude: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  strategic_thinking: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  competitive_spirit: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  focus: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  adaptability: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== GOLF ==========
export interface GolfPlayContext {
  possession_phase: 'tee_shot' | 'approach' | 'short_game' | 'putting';
  play_type: 'driver' | 'iron' | 'wedge' | 'putt' | 'chip' | 'other';
  hole_info: string;
  situation: string;
}

export interface GolfTangiblePerformance {
  actions: Array<{
    event_type: 'full_swing' | 'short_game' | 'putt';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      club_speed_mph?: number;
      ball_speed_mph?: number;
      distance_yards?: number;
      accuracy_feet?: number;
      spin_rpm?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    swing_mechanics: number;
    distance_control: number;
    consistency_rating: number;
  };
}

export interface GolfIntangiblePerformance {
  course_management: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  mental_composure: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  focus_discipline: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  confidence: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  pressure_performance: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// ========== RUGBY ==========
export interface RugbyPlayContext {
  possession_phase: 'attack' | 'defense' | 'set_piece' | 'breakdown';
  play_type: 'pass' | 'run' | 'tackle' | 'kick' | 'ruck' | 'scrum' | 'other';
  formation: string;
  situation: string;
}

export interface RugbyTangiblePerformance {
  actions: Array<{
    event_type: 'carry' | 'pass' | 'tackle' | 'kick' | 'ruck' | 'scrum';
    result: 'success' | 'failure' | 'neutral';
    metrics: {
      speed_kmh?: number;
      power_rating?: number;
      distance_m?: number;
      tackle_effectiveness?: number;
      accuracy_pct?: number;
    };
  }>;
  overall_summary: {
    execution_quality: number;
    physical_dominance: number;
    skill_level: number;
    work_rate_index: number;
  };
}

export interface RugbyIntangiblePerformance {
  physicality: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  game_intelligence: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  teamwork: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  leadership: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
  courage: { definition: string; observed_instances: number; successful_instances: number; percentage_correct: number; qualitative_example: string };
}

// Generic structure for all sports
export interface SportHighlightReelAnalysis {
  sport: 'basketball' | 'baseball' | 'football' | 'soccer' | 'volleyball' | 'tennis' | 'golf' | 'rugby';
  metadata: {
    video_id: string;
    team?: string;
    opponent?: string;
    game_date: string;
    clip_start_time: string;
    clip_end_time: string;
    analyst: string;
    source_method: Array<'computer_vision' | 'manual_review'>;
  };
  play_context: any; // Sport-specific play context
  tangible_performance: any; // Sport-specific tangible performance
  intangible_performance: any; // Sport-specific intangible performance
  integrated_insight: {
    summary: string;
    correlation_metrics: {
      intangible_to_outcome_correlation: number;
      intangibles_overall_score: number;
      tangible_efficiency_score: number;
    };
    radar_chart_data: Record<string, number>;
  };
  coaching_recommendations: {
    key_takeaways: string[];
    action_steps: Array<{
      focus_area: string;
      training_drill: string;
      measurement_goal: string;
    }>;
  };
}
