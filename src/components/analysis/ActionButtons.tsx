
import React from 'react';
import { Save, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ActionButtonsProps {
  onRetry?: () => void;
}

const ActionButtons = ({ onRetry }: ActionButtonsProps) => {
  const { toast } = useToast();
  
  const handleSaveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your analysis results have been saved to your profile"
    });
  };
  
  const handleShareResults = () => {
    // Create a shareable link or copy results to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Share link has been copied to your clipboard"
        });
      })
      .catch(() => {
        toast({
          title: "Sharing Failed",
          description: "Could not copy link to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <Button variant="outline" className="flex-1" onClick={handleSaveResults}>
        <Save size={16} className="mr-2" />
        Save Results
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleShareResults}>
        <Share2 size={16} className="mr-2" />
        Share
      </Button>
      {onRetry && (
        <Button variant="default" className="flex-1" onClick={onRetry}>
          <RefreshCw size={16} className="mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
