
import React from 'react';

interface StatusIndicatorsProps {
  detectionActive: boolean;
  poseDetected: boolean;
  isDemoMode?: boolean;
}

const StatusIndicators = ({ 
  detectionActive, 
  poseDetected, 
  isDemoMode 
}: StatusIndicatorsProps) => {
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1">
      {detectionActive && (
        <div className={`px-2 py-1 rounded text-xs ${poseDetected ? 'bg-green-600/70' : 'bg-yellow-600/70'} text-white`}>
          {poseDetected ? 'Pose Detected' : 'Searching...'}
        </div>
      )}
      {isDemoMode && (
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
          Demo Annotations
        </div>
      )}
    </div>
  );
};

export default StatusIndicators;
