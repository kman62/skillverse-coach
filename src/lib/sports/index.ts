
import { BASKETBALL } from './basketball';
import { BASEBALL } from './baseball';
import { FOOTBALL } from './football';
import { TENNIS } from './tennis';
import { GOLF } from './golf';
import { SOCCER } from './soccer';
import { RUGBY } from './rugby';
import { Sport, Drill, TeamAnalysis } from '../types/sports';

export const SPORTS: Sport[] = [
  BASKETBALL,
  BASEBALL,
  FOOTBALL,
  TENNIS,
  GOLF,
  SOCCER,
  RUGBY
];

export const getDrillById = (sportId: string, drillId: string): Drill | undefined => {
  const sport = SPORTS.find(s => s.id === sportId);
  return sport?.drills.find(d => d.id === drillId);
};

export const getSportById = (id: string): Sport | undefined => {
  return SPORTS.find(sport => sport.id === id);
};

export const getTeamAnalysisById = (sportId: string, analysisId: string): TeamAnalysis | undefined => {
  const sport = SPORTS.find(s => s.id === sportId);
  return sport?.teamAnalysis?.find(a => a.id === analysisId);
};

export * from '../types/sports';
