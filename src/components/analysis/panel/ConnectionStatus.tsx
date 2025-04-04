
import React from 'react';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ConnectionStatusProps {
  connectionStatus: 'connected' | 'limited' | 'offline';
  isWorking?: boolean;
}

const ConnectionStatus = ({ connectionStatus, isWorking = false }: ConnectionStatusProps) => {
  // If the connection is showing as limited but we know it's working, don't display an alert
  if (connectionStatus === 'connected' || (connectionStatus === 'limited' && isWorking)) {
    return null;
  }
  
  return (
    <Alert variant={connectionStatus === 'limited' ? 'default' : 'destructive'} className="mb-4">
      {connectionStatus === 'limited' ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <AlertTitle>
        {connectionStatus === 'limited' 
          ? 'Limited Connectivity' 
          : 'AI Analysis Service Unavailable'}
      </AlertTitle>
      <AlertDescription>
        {connectionStatus === 'limited' 
          ? 'The AI analysis service is experiencing some issues. You may experience slower response times.' 
          : 'The AI analysis service is currently unavailable. Please enable Demo Mode to continue with simulated analysis.'}
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus;
