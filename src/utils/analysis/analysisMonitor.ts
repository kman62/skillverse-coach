
/**
 * Utility function to check if the Free Throw analysis was executed recently
 * @param minutes - Number of minutes to look back (default: 20)
 * @returns Object with information about recent executions
 */
export const checkRecentFreeThrowAnalysis = (minutes: number = 20) => {
  try {
    // Get the log from localStorage
    const analysisLog = JSON.parse(localStorage.getItem('freeThrowAnalysisLog') || '[]');
    
    // Calculate the cutoff time for "recent"
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes);
    
    // Filter for recent entries
    const recentAnalyses = analysisLog.filter((entry: any) => {
      const entryTime = new Date(entry.timestamp);
      return entryTime >= cutoffTime;
    });
    
    // Count and get the most recent entry
    const count = recentAnalyses.length;
    const mostRecent = recentAnalyses.length > 0 
      ? recentAnalyses[recentAnalyses.length - 1] 
      : null;
      
    // Calculate time since most recent
    let timeSinceLastRun = null;
    if (mostRecent) {
      const lastRunTime = new Date(mostRecent.timestamp);
      const now = new Date();
      timeSinceLastRun = Math.round((now.getTime() - lastRunTime.getTime()) / 1000 / 60); // in minutes
    }
    
    return {
      wasRunRecently: count > 0,
      recentRunCount: count,
      mostRecentRun: mostRecent,
      minutesSinceLastRun: timeSinceLastRun
    };
  } catch (error) {
    console.error('Error checking recent free throw analysis:', error);
    return {
      wasRunRecently: false,
      recentRunCount: 0,
      mostRecentRun: null,
      minutesSinceLastRun: null,
      error: error.message
    };
  }
};

/**
 * Utility function to clear the free throw analysis log
 */
export const clearFreeThrowAnalysisLog = () => {
  try {
    localStorage.removeItem('freeThrowAnalysisLog');
    console.log('Free throw analysis log cleared');
    return true;
  } catch (error) {
    console.error('Error clearing free throw analysis log:', error);
    return false;
  }
};
