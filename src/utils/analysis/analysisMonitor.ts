
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
    
    console.log(`Analysis check: Found ${count} free throw analyses in the last ${minutes} minutes.`);
    if (mostRecent) {
      console.log(`Most recent analysis was ${timeSinceLastRun} minutes ago for drill: "${mostRecent.drillName}"`);
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

/**
 * Get the all-time statistics for free throw analysis runs
 */
export const getFreeThrowAnalysisStats = () => {
  try {
    const analysisLog = JSON.parse(localStorage.getItem('freeThrowAnalysisLog') || '[]');
    
    if (analysisLog.length === 0) {
      return {
        totalRuns: 0,
        message: "No free throw analyses have been recorded"
      };
    }
    
    // Calculate average scores
    let totalPreparation = 0;
    let totalHandPlacement = 0;
    let totalAiming = 0;
    let totalMotion = 0;
    let totalEvaluation = 0;
    let totalScore = 0;
    
    analysisLog.forEach((entry: any) => {
      totalPreparation += entry.components?.preparation || 0;
      totalHandPlacement += entry.components?.handPlacement || 0;
      totalAiming += entry.components?.aiming || 0;
      totalMotion += entry.components?.motion || 0;
      totalEvaluation += entry.components?.evaluation || 0;
      totalScore += entry.score || 0;
    });
    
    const count = analysisLog.length;
    
    return {
      totalRuns: count,
      firstRun: analysisLog[0].timestamp,
      lastRun: analysisLog[count - 1].timestamp,
      averageScores: {
        overall: Math.round(totalScore / count),
        preparation: Math.round(totalPreparation / count),
        handPlacement: Math.round(totalHandPlacement / count),
        aiming: Math.round(totalAiming / count),
        motion: Math.round(totalMotion / count),
        evaluation: Math.round(totalEvaluation / count)
      }
    };
  } catch (error) {
    console.error('Error getting free throw analysis stats:', error);
    return {
      error: error.message
    };
  }
};
