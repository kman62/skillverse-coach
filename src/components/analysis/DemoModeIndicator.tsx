
import React from 'react';
import { Info } from 'lucide-react';

const DemoModeIndicator = () => {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
      <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-blue-700 font-medium">Demo Mode Active</p>
        <p className="text-xs text-blue-600 mt-1">
          This analysis uses simulated data for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default DemoModeIndicator;
