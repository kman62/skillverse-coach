
// Configure API endpoints based on environment
const API_ENDPOINTS = {
  // Updated API endpoints
  development: "https://api.aithlete.io/v1/analyze", 
  production: "https://api.aithlete.io/v1/analyze",
  fallback: "https://fallback-api.aithlete.io/analyze"
};

// Get the current environment API URL
export const getApiUrl = () => {
  // For now we'll use the development URL (in production this would be determined properly)
  return API_ENDPOINTS.development;
};

// Get fallback API URL
export const getFallbackApiUrl = () => {
  return API_ENDPOINTS.fallback;
};
