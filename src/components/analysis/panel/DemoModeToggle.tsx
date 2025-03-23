
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

const DemoModeToggle = ({ isDemoMode, onToggle, disabled = false }: DemoModeToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="demo-mode"
        checked={isDemoMode}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
      <Label htmlFor="demo-mode" className="text-sm cursor-pointer">
        Demo Mode {isDemoMode ? '(ON)' : '(OFF)'}
      </Label>
      <div className="relative group">
        <div className="cursor-help text-sm text-muted-foreground ml-1">ⓘ</div>
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-popover p-3 rounded-md shadow-md hidden group-hover:block text-xs">
          <p className="font-medium mb-1">Demo Mode</p>
          <p>When enabled, analyses are simulated locally instead of using the GPT-4o AI service. Use this if the AI service is unavailable or if you want to test without using API credits.</p>
        </div>
      </div>
    </div>
  );
};

export default DemoModeToggle;
