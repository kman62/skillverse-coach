
/**
 * Utility for logging analysis stages and dispatching events
 */

// Custom event for tracking analysis stages
export const dispatchAnalysisEvent = (stage: string, detail: any = {}) => {
  console.log(`Analysis stage: ${stage}`, detail);
  window.dispatchEvent(new CustomEvent('analysis-stage', { 
    detail: { stage, ...detail }
  }));
};

/**
 * Log debugging information for API requests
 */
export const logApiRequest = (message: string, data: any = {}) => {
  console.log(message, {
    ...data,
    timestamp: new Date().toISOString()
  });
};
