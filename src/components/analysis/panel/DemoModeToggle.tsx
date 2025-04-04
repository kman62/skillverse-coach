
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DemoModeToggleProps {
  useDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const DemoModeToggle = ({ 
  useDemoMode, 
  onToggle, 
  disabled = false 
}: DemoModeToggleProps) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Switch 
        id="demo-mode"
        checked={useDemoMode}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
      <Label htmlFor="demo-mode" className={disabled ? "text-muted-foreground" : ""}>
        Enable Demo Mode
      </Label>
    </div>
  );
};

export default DemoModeToggle;
