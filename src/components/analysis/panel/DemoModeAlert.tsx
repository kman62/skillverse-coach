
import React from 'react';
import { Info } from 'lucide-react';

interface DemoModeAlertProps {
  usesDemoData: boolean;
  isAnalyzing: boolean;
}

const DemoModeAlert = ({ 
  usesDemoData, 
  isAnalyzing 
}: DemoModeAlertProps) => {
  if (!usesDemoData || isAnalyzing) return null;
  
  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
      <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-700">
        Using demo mode. GPT-4o connection could not be established, so simulated analysis data will be shown.
      </p>
    </div>
  );
};

export default DemoModeAlert;
