import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface-elevated rounded-xl border border-border overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-video bg-gray-200"></div>
      
      {/* Content placeholder */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
        
        {/* Meta info row */}
        <div className="flex gap-4 mt-2">
          <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        
        {/* Attendees bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="h-2 bg-gray-200 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
