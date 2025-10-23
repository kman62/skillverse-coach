// Legacy analysis service - disabled
// All video analysis now happens in HighlightReelPage

export const performVideoAnalysis = async () => {
  throw new Error('Legacy analysis service - use HighlightReelPage instead');
};

export const saveAnalysisData = async () => {
  throw new Error('Legacy analysis service - use HighlightReelPage instead');
};
