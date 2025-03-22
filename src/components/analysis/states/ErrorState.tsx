
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  errorMessage: string;
  onRetry?: () => void;
}

const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <div className="bg-card rounded-xl border border-destructive h-[500px] flex items-center justify-center p-6 text-center">
      <div>
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-destructive" />
        </div>
        <h3 className="text-lg font-medium">Analysis Error</h3>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          {errorMessage || "There was an error analyzing your video. Please try again."}
        </p>
        {onRetry && (
          <Button 
            variant="outline"
            className="mt-4"
            onClick={onRetry}
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
