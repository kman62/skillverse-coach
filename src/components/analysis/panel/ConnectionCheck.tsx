
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConnectionCheckProps {
  isCheckingConnection: boolean;
  onCheckConnection: () => void;
}

const ConnectionCheck = ({ 
  isCheckingConnection, 
  onCheckConnection 
}: ConnectionCheckProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onCheckConnection} 
      disabled={isCheckingConnection}
    >
      {isCheckingConnection ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Checking...
        </>
      ) : (
        'Check Connection'
      )}
    </Button>
  );
};

export default ConnectionCheck;
