
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { checkOpenAIApiKey } from '@/utils/api/apiKeyValidator';
import { useToast } from '@/hooks/use-toast';

const ApiKeyValidator = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const { toast } = useToast();

  const validateApiKey = async () => {
    setIsChecking(true);
    setKeyStatus('unchecked');
    
    try {
      const result = await checkOpenAIApiKey();
      
      if (result.isValid) {
        setKeyStatus('valid');
        toast({
          title: "API Key Valid",
          description: "Your OpenAI API key is correctly configured.",
          variant: "default",
        });
      } else {
        setKeyStatus('invalid');
        toast({
          title: "API Key Issue",
          description: result.message || "There was a problem with your OpenAI API key.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setKeyStatus('invalid');
      toast({
        title: "Connection Error",
        description: "Could not check API key due to a connection error.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={validateApiKey}
        disabled={isChecking}
        className="flex items-center"
      >
        {keyStatus === 'valid' ? (
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
        ) : keyStatus === 'invalid' ? (
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
        ) : (
          <Key className="h-4 w-4 mr-2" />
        )}
        {isChecking ? 'Checking...' : 'Validate API Key'}
      </Button>
    </div>
  );
};

export default ApiKeyValidator;
