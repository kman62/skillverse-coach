/**
 * Suppresses known benign errors from console
 * These are auth token refresh errors that don't affect public features
 */

const SUPPRESSED_ERROR_PATTERNS = [
  /Failed to fetch.*token.*refresh/i,
  /Failed to fetch.*auth.*token/i,
  /SupabaseAuthClient.*refreshAccessToken/i,
];

export function initializeErrorSuppression() {
  const originalConsoleError = console.error;
  
  console.error = (...args: any[]) => {
    const errorString = args.join(' ');
    
    // Check if this error should be suppressed
    const shouldSuppress = SUPPRESSED_ERROR_PATTERNS.some(pattern => 
      pattern.test(errorString)
    );
    
    if (shouldSuppress) {
      // Log to debug console only, not user-facing console
      console.debug('[Suppressed Auth Error]:', errorString.substring(0, 200));
      return;
    }
    
    // Pass through all other errors
    originalConsoleError.apply(console, args);
  };
}
