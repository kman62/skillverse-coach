
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const DemoModeToggle = ({ 
  isDemoMode, 
  onToggle, 
  disabled = false 
}: DemoModeToggleProps) => {
  return (
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isDemoMode} 
            onCheckedChange={onToggle}
            disabled={disabled}
            id="demo-mode"
          />
          <Label htmlFor="demo-mode" className="font-medium text-sm cursor-pointer">Demo Mode</Label>
        </div>
      </div>
      
      {isDemoMode && (
        <div className="mt-2 flex items-start gap-2">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Using demo mode with simulated analysis data. GPT-4o will not be used for analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoModeToggle;
