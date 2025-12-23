// Level-specific contexts for AI analysis prompts
// Adjusts expectations based on athlete's competition level

export interface LevelContext {
  label: string;
  evaluationFocus: string;
  intangibleGuidance: string;
  ratingCalibration: string;
}

const levelContexts: Record<string, LevelContext> = {
  youth: {
    label: 'Youth (U10-U14)',
    evaluationFocus: `Youth Development Focus: Prioritize fundamental skill acquisition, enjoyment of the game, and athletic movement patterns. Look for coachability, effort, and willingness to learn. Technical perfection is NOT expected - evaluate progress and potential rather than current execution quality.`,
    intangibleGuidance: `Rate intangibles with developmental lens: A "5" means exceptional for age group, showing natural instincts. A "3" is age-appropriate behavior. Focus on effort, attitude, and teachability rather than advanced game sense.`,
    ratingCalibration: `Calibrate ratings for youth: Technical scores should emphasize fundamentals (stance, basic footwork) over advanced mechanics. Intangible ratings should reward effort, listening to coaches, and positive attitude. Be encouraging while noting specific areas for development.`
  },
  
  middle_school: {
    label: 'Middle School',
    evaluationFocus: `Middle School Development Focus: Evaluate foundational skill development, athletic coordination, and early tactical awareness. Focus on proper technique formation, physical literacy, and mental approach to competition. Look for athletes who demonstrate coachability and growth mindset.`,
    intangibleGuidance: `Rate intangibles for developing athletes: A "5" shows advanced maturity and game understanding for age. A "3" is normal middle school behavior. Reward effort, teamwork, and positive responses to coaching.`,
    ratingCalibration: `Calibrate ratings for middle school: Expect inconsistent technique execution - this is normal. Technical scores should focus on whether fundamentals are being learned correctly. Intangibles should emphasize effort, coachability, and competitive spirit.`
  },
  
  high_school: {
    label: 'High School',
    evaluationFocus: `High School Recruiting Context: Evaluate through a D1 recruiting lens. Coaches seek athletes with strong fundamentals, athletic upside, coachability, and competitive drive. Key factors: technical skill progression, athletic measurables, game IQ development, and leadership potential. Focus on DEVELOPMENT TRAJECTORY and POTENTIAL.`,
    intangibleGuidance: `Rate intangibles for HS athletes: A "5" demonstrates D1-level mental tools and maturity. A "3" is typical varsity player. Look for leadership emergence, response to adversity, and competitive fire. These intangibles often predict college success better than current skill level.`,
    ratingCalibration: `Calibrate ratings for high school: Technical execution should be evaluated against varsity-level expectations, not college-level. Highlight areas where technique can improve with college-level coaching. Intangibles should identify potential red/green flags for recruiters.`
  },
  
  juco: {
    label: 'Junior College (JUCO)',
    evaluationFocus: `JUCO Transfer Context: Evaluate for D1/D2 transfer readiness. These athletes need to demonstrate rapid improvement, competitive readiness against higher-level competition, and maturity to handle the transition. Focus on current skill level, athletic ability, and coachability for quick integration.`,
    intangibleGuidance: `Rate intangibles for JUCO athletes: A "5" shows transfer-ready mental game and leadership. A "3" is developing college-level mental skills. Key focus: Can this athlete contribute immediately at the next level?`,
    ratingCalibration: `Calibrate ratings for JUCO: Technical execution should be near-college-ready. Identify specific gaps that need closing for 4-year program success. Intangibles should assess readiness for increased competition and academic demands.`
  },
  
  d3: {
    label: 'NCAA Division III',
    evaluationFocus: `D3 Context: Evaluate as a student-athlete balancing academics and athletics. D3 coaches seek athletes with solid fundamentals, high basketball IQ, strong work ethic, and leadership. Physical measurables are less critical than skill, IQ, and attitude.`,
    intangibleGuidance: `Rate intangibles for D3 athletes: A "5" is team captain material with excellent game awareness. A "3" is solid contributor. Emphasize teamwork, coachability, and ability to maximize potential through effort.`,
    ratingCalibration: `Calibrate ratings for D3: Technical execution should be fundamentally sound. Focus on game IQ, positioning, and decision-making over elite athleticism. Intangibles should highlight team-first attitude and leadership potential.`
  },
  
  d2: {
    label: 'NCAA Division II',
    evaluationFocus: `D2 Competitive Context: Evaluate for high-level collegiate competition. D2 programs seek skilled athletes who can compete against near-D1 talent. Balance of athleticism, skill development, and mental game is critical. Focus on competitive readiness and continued development potential.`,
    intangibleGuidance: `Rate intangibles for D2 athletes: A "5" demonstrates D1-caliber mental game. A "3" is solid D2 competitor. Look for athletes who can elevate their game in big moments and lead by example.`,
    ratingCalibration: `Calibrate ratings for D2: Technical execution should be refined with room for polish. Athletic ability should be evident. Intangibles should assess ability to compete at the scholarship level and handle pressure.`
  },
  
  d1: {
    label: 'NCAA Division I',
    evaluationFocus: `D1 Elite Context: Evaluate against the highest collegiate standard. D1 athletes must demonstrate elite technical execution, exceptional athletic ability, advanced game IQ, and professional-level mental approach. Focus on what separates good from great at this level.`,
    intangibleGuidance: `Rate intangibles at D1 standard: A "5" is elite, pro-ready mental game. A "3" is expected D1 baseline. At this level, intangibles often determine playing time and future professional potential. Be rigorous and specific with evidence.`,
    ratingCalibration: `Calibrate ratings for D1: Technical execution must be refined and consistent under pressure. Any mechanical flaws will be exploited at this level. Intangibles should identify what makes this athlete special or what limits their ceiling.`
  },
  
  professional: {
    label: 'Professional',
    evaluationFocus: `Professional Context: Evaluate against elite professional standards. Focus on execution precision, advanced metrics, situational excellence, and marginal gains that separate professionals. Technical and tactical analysis should be highly sophisticated.`,
    intangibleGuidance: `Rate intangibles at professional standard: A "5" is elite, all-star level mental game. A "3" is professional baseline. At this level, small mental edges create significant competitive advantages. Be extremely specific with evidence.`,
    ratingCalibration: `Calibrate ratings for professional: Technical execution must be elite and repeatable under maximum pressure. Any inefficiency is a liability. Intangibles should identify championship-level mentality or areas preventing peak performance.`
  }
};

// Default to high school context if level not specified
export function getLevelContext(level: string | undefined | null): LevelContext {
  if (!level || !levelContexts[level]) {
    return levelContexts.high_school;
  }
  return levelContexts[level];
}

// Get sport-specific context adjusted for level
export function getSportLevelContext(sport: string, level: string | undefined | null): string {
  const levelCtx = getLevelContext(level);
  
  const sportContexts: Record<string, Record<string, string>> = {
    basketball: {
      youth: 'Focus on: dribbling with head up, basic passing, defensive stance, court awareness basics.',
      middle_school: 'Focus on: shooting form, ball handling progression, understanding positions, team concepts.',
      high_school: 'Recruiters evaluate: shooting efficiency, assist/turnover ratio, defensive versatility, basketball IQ, and leadership.',
      juco: 'Transfer evaluators look for: immediate impact ability, refined skills, competitive experience.',
      d3: 'Coaches value: high IQ play, team-first attitude, consistent effort, skill development.',
      d2: 'Scouts assess: athletic ability, skill refinement, competitive drive, potential for growth.',
      d1: 'Elite evaluation: shooting percentages, advanced metrics, athletic testing (vertical, shuttle), defensive versatility.',
      professional: 'Elite metrics: PER, true shooting %, defensive rating, clutch performance, advanced analytics.'
    },
    baseball: {
      youth: 'Focus on: throwing mechanics, basic hitting stance, fielding fundamentals, game rules understanding.',
      middle_school: 'Focus on: arm slot consistency, bat path development, position-specific skills, game situations.',
      high_school: 'Recruiters evaluate: exit velocity (90+ mph), pitch velocity (85+ mph), 60-yard dash (<7.0s), fielding %.',
      juco: 'Transfer scouts look for: refined mechanics, competitive stats, defensive reliability.',
      d3: 'Coaches value: consistent at-bats, defensive reliability, team contribution, baseball IQ.',
      d2: 'Scouts assess: power potential, arm strength, speed, competitive experience.',
      d1: 'Elite evaluation: exit velocity, pitch velocity, pop time, defensive range, competitive stats.',
      professional: 'Elite metrics: launch angle, spin rate, bat speed, defensive WAR, situational hitting.'
    },
    football: {
      youth: 'Focus on: flag/tackle fundamentals, catching, basic routes, tackling form, effort.',
      middle_school: 'Focus on: position basics, physical development, understanding schemes, competitive spirit.',
      high_school: 'Recruiters evaluate: 40-yard dash, vertical jump, strength metrics, football IQ, film quality.',
      juco: 'Transfer scouts look for: physical development, scheme versatility, immediate contributors.',
      d3: 'Coaches value: technique, effort, leadership, academic-athletic balance.',
      d2: 'Scouts assess: size-speed combo, position skills, competitive experience.',
      d1: 'Elite evaluation: combine metrics, position-specific testing, against-competition film, character.',
      professional: 'Elite metrics: athletic testing, scheme fit, injury history, football character.'
    },
    soccer: {
      youth: 'Focus on: ball control, basic passing, positioning awareness, game enjoyment.',
      middle_school: 'Focus on: both-foot development, tactical understanding, fitness foundation.',
      high_school: 'Recruiters evaluate: technical ability, tactical awareness, fitness, 1v1 ability, tournament exposure.',
      juco: 'Transfer scouts look for: immediate impact, tactical maturity, competitive experience.',
      d3: 'Coaches value: technical skill, game intelligence, fitness, team contribution.',
      d2: 'Scouts assess: athleticism, technical quality, competitive drive.',
      d1: 'Elite evaluation: elite technique, tactical sophistication, fitness metrics, tournament results.',
      professional: 'Elite metrics: passing accuracy, pressing intensity, xG contribution, defensive actions.'
    },
    volleyball: {
      youth: 'Focus on: passing platform, serving basics, court movement, team communication.',
      middle_school: 'Focus on: swing development, defensive positioning, setting fundamentals.',
      high_school: 'Recruiters evaluate: vertical jump (25"+ F, 30"+ M), hitting efficiency, serve accuracy, court awareness.',
      juco: 'Transfer scouts look for: immediate contributors, refined skills, competitive experience.',
      d3: 'Coaches value: consistent skills, court awareness, leadership, team chemistry.',
      d2: 'Scouts assess: athletic tools, skill development, competitive experience.',
      d1: 'Elite evaluation: vertical, arm swing, block timing, serve receive, leadership.',
      professional: 'Elite metrics: kill efficiency, block rate, serve velocity, defensive coverage.'
    },
    tennis: {
      youth: 'Focus on: grip fundamentals, footwork basics, rally consistency, match enjoyment.',
      middle_school: 'Focus on: stroke development, court coverage, point construction basics.',
      high_school: 'Recruiters evaluate: UTR rating (10+), serve speed (100+ mph), mental toughness, tournament results.',
      juco: 'Transfer scouts look for: competitive record, refined strokes, match mentality.',
      d3: 'Coaches value: consistency, competitive spirit, team contribution, improvement trajectory.',
      d2: 'Scouts assess: stroke quality, athletic ability, competitive record.',
      d1: 'Elite evaluation: UTR, serve stats, tournament performance, mental game.',
      professional: 'Elite metrics: first serve %, break point conversion, movement efficiency, clutch performance.'
    },
    golf: {
      youth: 'Focus on: grip and setup, swing fundamentals, course etiquette, score relative to age.',
      middle_school: 'Focus on: full swing development, short game basics, course management intro.',
      high_school: 'Recruiters evaluate: handicap (scratch or better), scoring average, driving distance (270+ yds), tournament results.',
      juco: 'Transfer scouts look for: competitive scoring, course management, mental composure.',
      d3: 'Coaches value: consistent scoring, team contribution, improvement trajectory.',
      d2: 'Scouts assess: scoring average, competitive experience, work ethic.',
      d1: 'Elite evaluation: handicap, tournament scoring, driving stats, short game proficiency.',
      professional: 'Elite metrics: strokes gained, GIR, scrambling, putting stats, pressure performance.'
    },
    rugby: {
      youth: 'Focus on: safe tackling, passing basics, positioning, game understanding, effort.',
      middle_school: 'Focus on: position skills, physical development, game awareness, team play.',
      high_school: 'Recruiters evaluate: physicality, tackle effectiveness, running lines, game intelligence, work rate.',
      juco: 'Transfer scouts look for: physical maturity, refined skills, competitive experience.',
      d3: 'Coaches value: work rate, team contribution, coachability, improvement.',
      d2: 'Scouts assess: size-speed combo, position skills, competitive experience.',
      d1: 'Elite evaluation: physical metrics, skill execution, game IQ, leadership.',
      professional: 'Elite metrics: tackle success, carries per game, meters gained, defensive actions.'
    }
  };

  const sportLevel = sportContexts[sport]?.[level || 'high_school'] || sportContexts.basketball.high_school;
  
  return `${levelCtx.evaluationFocus}\n\n${sportLevel}\n\n${levelCtx.intangibleGuidance}\n\n${levelCtx.ratingCalibration}`;
}
