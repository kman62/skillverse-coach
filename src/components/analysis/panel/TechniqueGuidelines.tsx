
import React from 'react';

const TechniqueGuidelines = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3">Tips for Best Results</h3>
      <ul className="space-y-2 pl-5">
        <li className="text-muted-foreground text-sm list-disc">
          Ensure good lighting and a clear background
        </li>
        <li className="text-muted-foreground text-sm list-disc">
          Position the camera to capture your full body movement
        </li>
        <li className="text-muted-foreground text-sm list-disc">
          Perform the technique at a normal speed
        </li>
        <li className="text-muted-foreground text-sm list-disc">
          Wear appropriate clothing that makes it easy to see your form
        </li>
        <li className="text-muted-foreground text-sm list-disc">
          Keep videos under 50MB for optimal processing
        </li>
      </ul>
    </div>
  );
};

export default TechniqueGuidelines;
