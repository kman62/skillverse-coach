
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Key } from 'lucide-react';
import { checkOpenAIApiKey } from '@/utils/api/apiKeyValidator';
import { toast } from '@/hooks/use-toast';

interface ApiKeyValidatorProps {
  className?: string;
}

const ApiKeyValidator: React.FC<ApiKeyValidatorProps> = ({ className }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    isValid?: boolean;
    message?: string;
    timestamp?: string;
  } | null>(null);

  const handleCheckApiKey = async () => {
    setIsChecking(true);
    setCheckResult(null);
    
    try {
      const result = await checkOpenAIApiKey();
      
      setCheckResult({
        isValid: result.isValid,
        message: result.message,
        timestamp: new Date().toLocaleTimeString()
      });
      
      if (result.isValid) {
        toast({
          title: "API Key Validated",
          description: "Your OpenAI API key is valid and working correctly.",
          variant: "default"
        });
      } else {
        toast({
          title: "API Key Invalid",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      setCheckResult({
        isValid: false,
        message: error instanceof Error ? error.message : 'Unknown error checking API key',
        timestamp: new Date().toLocaleTimeString()
      });
      
      toast({
        title: "Validation Error",
        description: "An error occurred while checking your API key.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Key size={16} className="text-gray-600" />
          <h3 className="text-sm font-medium">OpenAI API Key Status</h3>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleCheckApiKey}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <Loader2 size={14} className="mr-1 animate-spin" />
              Checking...
            </>
          ) : (
            'Validate Key'
          )}
        </Button>
      </div>
      
      {checkResult && (
        <div className={`mt-3 p-2 text-sm rounded ${
          checkResult.isValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center space-x-1.5">
            {checkResult.isValid ? (
              <CheckCircle size={14} className="text-green-600" />
            ) : (
              <XCircle size={14} className="text-red-600" />
            )}
            <span>{checkResult.message}</span>
          </div>
          {checkResult.timestamp && (
            <div className="mt-1 text-xs opacity-70">
              Checked at {checkResult.timestamp}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiKeyValidator;
