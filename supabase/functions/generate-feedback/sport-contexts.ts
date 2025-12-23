// Level-aware sport feedback contexts

interface LevelFeedbackContext {
  focus: string;
  tone: string;
  metrics: string;
}

const levelContexts: Record<string, LevelFeedbackContext> = {
  youth: {
    focus: 'development, enjoyment, and fundamentals',
    tone: 'encouraging and supportive, celebrating effort and improvement',
    metrics: 'basic skill acquisition, effort level, coachability, and attitude'
  },
  middle_school: {
    focus: 'skill development, athletic coordination, and team concepts',
    tone: 'constructive and developmental, balancing encouragement with specific guidance',
    metrics: 'fundamental technique, physical development, and competitive mindset formation'
  },
  high_school: {
    focus: 'D1 recruiting readiness, skill refinement, and competitive performance',
    tone: 'recruiting-focused, highlighting strengths while identifying development areas',
    metrics: 'recruiting-relevant metrics, athletic testing, game statistics, and intangibles'
  },
  juco: {
    focus: 'transfer readiness and immediate impact potential',
    tone: 'direct and practical, focused on bridging to 4-year programs',
    metrics: 'competitive statistics, physical maturity, and program fit'
  },
  d3: {
    focus: 'student-athlete balance and team contribution',
    tone: 'holistic, emphasizing both athletic and personal development',
    metrics: 'game IQ, effort, leadership, and consistent contribution'
  },
  d2: {
    focus: 'competitive performance and continued development',
    tone: 'balanced between development and competitive expectations',
    metrics: 'athletic ability, skill refinement, and competitive drive'
  },
  d1: {
    focus: 'elite performance, professional preparation, and marginal gains',
    tone: 'rigorous and specific, demanding excellence in all areas',
    metrics: 'advanced analytics, elite execution standards, and professional readiness'
  },
  professional: {
    focus: 'peak performance optimization and competitive advantage',
    tone: 'elite-level analysis, focused on marginal improvements',
    metrics: 'advanced metrics, situational excellence, and championship-level execution'
  }
};

const sportMetrics: Record<string, Record<string, string>> = {
  basketball: {
    youth: 'dribbling control, basic shooting form, passing accuracy, defensive stance',
    middle_school: 'shooting consistency, ball handling, understanding positions, team play',
    high_school: 'shooting efficiency, assist-to-turnover ratio, defensive versatility, basketball IQ, leadership',
    juco: 'impact stats, refined skills, competitive experience, physical tools',
    d3: 'IQ, consistency, team contribution, leadership',
    d2: 'athletic metrics, skill development, competitive performance',
    d1: 'points per game, shooting percentage, athletic testing (vertical jump, shuttle times)',
    professional: 'PER, true shooting %, defensive rating, clutch performance'
  },
  baseball: {
    youth: 'throwing mechanics, batting stance, fielding fundamentals',
    middle_school: 'arm consistency, bat path, position skills',
    high_school: 'exit velocity (90+ mph), pitch velocity (85+ mph), 60-yard dash (<7.0s), fielding percentage',
    juco: 'refined mechanics, competitive stats, defensive reliability',
    d3: 'at-bat quality, defensive consistency, baseball IQ',
    d2: 'power potential, arm strength, speed',
    d1: 'exit velocity, pitch velocity, pop time, defensive range',
    professional: 'launch angle, spin rate, bat speed, WAR'
  },
  football: {
    youth: 'fundamental technique, effort, basic understanding',
    middle_school: 'position basics, physical development, effort',
    high_school: '40-yard dash times, vertical jump, strength metrics, football IQ, competitive film',
    juco: 'physical development, scheme versatility, impact potential',
    d3: 'technique, effort, leadership',
    d2: 'size-speed, position skills, experience',
    d1: 'combine metrics, position testing, film quality, character',
    professional: 'athletic testing, scheme fit, durability'
  },
  soccer: {
    youth: 'ball control, basic passing, court awareness',
    middle_school: 'both-foot development, tactical basics, fitness',
    high_school: 'technical ability, tactical awareness, fitness, 1v1 ability, tournament exposure',
    juco: 'immediate impact, tactical maturity, experience',
    d3: 'technical skill, game intelligence, fitness',
    d2: 'athleticism, technical quality, drive',
    d1: 'elite technique, tactical sophistication, fitness metrics',
    professional: 'passing accuracy, pressing intensity, xG contribution'
  },
  volleyball: {
    youth: 'passing platform, serving basics, movement',
    middle_school: 'swing development, positioning, setting basics',
    high_school: 'vertical jump (25"+ F, 30"+ M), hitting efficiency, serve accuracy, court awareness',
    juco: 'refined skills, competitive experience, impact',
    d3: 'consistency, court awareness, leadership',
    d2: 'athletic tools, skill development, experience',
    d1: 'vertical, arm swing, block timing, serve receive',
    professional: 'kill efficiency, block rate, serve velocity'
  },
  tennis: {
    youth: 'grip fundamentals, footwork, rally consistency',
    middle_school: 'stroke development, court coverage, point basics',
    high_school: 'UTR rating (10+), serve speed (100+ mph), mental toughness, tournament results',
    juco: 'competitive record, refined strokes, match mentality',
    d3: 'consistency, competitive spirit, improvement',
    d2: 'stroke quality, athleticism, record',
    d1: 'UTR, serve stats, tournament performance, mental game',
    professional: 'first serve %, break conversion, movement efficiency'
  },
  golf: {
    youth: 'grip and setup, swing fundamentals, etiquette',
    middle_school: 'full swing, short game basics, course management',
    high_school: 'handicap (scratch or better), scoring average, driving distance (270+ yds), tournament results',
    juco: 'competitive scoring, course management, composure',
    d3: 'consistent scoring, improvement trajectory',
    d2: 'scoring average, experience, work ethic',
    d1: 'handicap, tournament scoring, short game',
    professional: 'strokes gained, GIR, scrambling, putting'
  },
  rugby: {
    youth: 'safe tackling, passing basics, effort',
    middle_school: 'position skills, physical development, game awareness',
    high_school: 'physicality, tackle effectiveness, running lines, game intelligence, work rate',
    juco: 'physical maturity, refined skills, experience',
    d3: 'work rate, contribution, coachability',
    d2: 'size-speed, position skills, experience',
    d1: 'physical metrics, skill execution, game IQ',
    professional: 'tackle success, carries, meters gained'
  }
};

export function getSportFeedbackContext(sport: string, level?: string | null): string {
  const effectiveLevel = level || 'high_school';
  const levelCtx = levelContexts[effectiveLevel] || levelContexts.high_school;
  const metrics = sportMetrics[sport]?.[effectiveLevel] || sportMetrics.basketball.high_school;
  
  const levelLabel = effectiveLevel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `${levelLabel} ${sport.charAt(0).toUpperCase() + sport.slice(1)} Context:
Focus: ${levelCtx.focus}
Tone: ${levelCtx.tone}
Key Metrics: ${metrics}

Calibrate all feedback and recommendations for a ${levelLabel} athlete. ${levelCtx.tone.charAt(0).toUpperCase() + levelCtx.tone.slice(1)}.`;
}

// Legacy function for backward compatibility
export function getLevelLabel(level: string | undefined | null): string {
  const labels: Record<string, string> = {
    youth: 'Youth (U10-U14)',
    middle_school: 'Middle School',
    high_school: 'High School',
    juco: 'Junior College',
    d3: 'NCAA Division III',
    d2: 'NCAA Division II',
    d1: 'NCAA Division I',
    professional: 'Professional'
  };
  return labels[level || 'high_school'] || 'High School';
}
