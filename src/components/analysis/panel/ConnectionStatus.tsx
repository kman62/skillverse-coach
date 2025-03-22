
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConnectionStatusProps {
  connectionStatus: 'connected' | 'limited' | 'offline';
}

const ConnectionStatus = ({ connectionStatus }: ConnectionStatusProps) => {
  if (connectionStatus === 'connected') return null;
  
  return (
    <div className={`mb-4 p-3 rounded-md flex items-start gap-2 ${
      connectionStatus === 'limited' 
        ? 'bg-yellow-50 border border-yellow-200' 
        : 'bg-red-50 border border-red-200'
    }`}>
      <AlertTriangle size={18} className={`flex-shrink-0 mt-0.5 ${
        connectionStatus === 'limited' ? 'text-yellow-500' : 'text-red-500'
      }`} />
      <p className={`text-sm ${
        connectionStatus === 'limited' ? 'text-yellow-700' : 'text-red-700'
      }`}>
        {connectionStatus === 'limited' 
          ? 'Analysis service is operating in limited capacity. Some features may be slower than usual.' 
          : 'Analysis service is currently offline. Local analysis will be used automatically.'}
      </p>
    </div>
  );
};

export default ConnectionStatus;
