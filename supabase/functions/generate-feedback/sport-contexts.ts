export function getSportFeedbackContext(sport: string): string {
  const contexts: Record<string, string> = {
    basketball: `D1 Basketball Recruiting Context: Coaches look for shooting efficiency, assist-to-turnover ratio, defensive versatility, basketball IQ, and leadership. Key metrics include points per game, shooting percentage, and athletic testing (vertical jump, shuttle times).`,

    baseball: `D1 Baseball Recruiting Context: Coaches look for exit velocity (90+ mph), pitch velocity (85+ mph for pitchers), 60-yard dash time (<7.0s), fielding percentage, and baseball IQ. Position-specific skills and competitive stats are crucial.`,

    football: `D1 Football Recruiting Context: Coaches look for 40-yard dash times, vertical jump, strength metrics (bench press, squat), football IQ, position-specific technique, and competitive film. Size, speed, and physicality are position-dependent.`,

    soccer: `D1 Soccer Recruiting Context: Coaches look for technical ability with both feet, tactical awareness, fitness levels, vision, 1v1 ability, and decision-making under pressure. Club team performance and tournament exposure are important.`,

    volleyball: `D1 Volleyball Recruiting Context: Coaches look for vertical jump (25"+ females, 30"+ males), blocks/digs per set, hitting efficiency, serve accuracy, court awareness, and leadership. Height and athleticism are position-dependent.`,

    tennis: `D1 Tennis Recruiting Context: Coaches look for UTR rating (10+ for competitive D1), serve speed (100+ mph), consistency, mental toughness, match win percentage, and tournament results against ranked opponents.`,

    golf: `D1 Golf Recruiting Context: Coaches look for handicap (scratch or better), scoring average, driving distance (270+ yards), tournament performance, course management, and mental composure under pressure.`,

    rugby: `D1 Rugby Recruiting Context: Coaches look for physicality, tackle effectiveness, running lines, game intelligence, work rate, position-specific skills, and ability to perform in high-pressure situations.`
  };

  return contexts[sport] || contexts.basketball;
}
