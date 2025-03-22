
import React from 'react';
import { Info } from 'lucide-react';

interface DemoModeAlertProps {
  usesDemoData: boolean;
  isAnalyzing: boolean;
  useLocalAnalysis: boolean;
}

const DemoModeAlert = ({ 
  usesDemoData, 
  isAnalyzing, 
  useLocalAnalysis 
}: DemoModeAlertProps) => {
  if (!usesDemoData || isAnalyzing) return null;
  
  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
      <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-700">
        Using demo mode. The API connection could not be established, so {
          useLocalAnalysis ? 'local' : 'simulated'
        } analysis data will be shown.
      </p>
    </div>
  );
};

export default DemoModeAlert;
