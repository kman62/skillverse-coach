
/**
 * Utility function to check if the Free Throw analysis was executed recently
 * @param minutes - Number of minutes to look back (default: 20)
 * @returns Object with information about recent executions
 */
export const checkRecentFreeThrowAnalysis = (minutes: number = 20) => {
  // Removed localStorage dependency - this function is deprecated
  // TODO: Replace with database-backed analysis history
  if (import.meta.env.DEV) {
    console.log('checkRecentFreeThrowAnalysis is deprecated - localStorage removed for security');
  }
  
  return {
    wasRunRecently: false,
    recentRunCount: 0,
    mostRecentRun: null,
    minutesSinceLastRun: null
  };
};

/**
 * Utility function to clear the free throw analysis log
 * Deprecated - localStorage removed for security
 */
export const clearFreeThrowAnalysisLog = () => {
  if (import.meta.env.DEV) {
    console.log('clearFreeThrowAnalysisLog is deprecated');
  }
  return true;
};

/**
 * Get the all-time statistics for free throw analysis runs
 * Deprecated - localStorage removed for security
 */
export const getFreeThrowAnalysisStats = () => {
  // TODO: Replace with database-backed statistics
  return {
    totalRuns: 0,
    message: "Statistics feature requires database implementation"
  };
};
