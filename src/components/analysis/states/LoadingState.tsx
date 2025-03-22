
import React from 'react';

const LoadingState = () => {
  return (
    <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center animate-pulse">
      <div>
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium">Analyzing Your Technique</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Please wait while our AI analyzes your movement patterns...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
