import React from "react";

const BadgeSkeleton = () => {
  return (
    <div className="flex items-center border-b justify-between gap-4 py-2 animate-pulse">
      <div className="flex-1 text-center">
        <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-2" />
        <div className="h-4 bg-gray-300 rounded w-24 mx-auto" />
      </div>
      <div className="relative w-28 h-28 flex-shrink-0">
        <div className="w-full h-full bg-gray-300 rounded-md" />
        <div className="absolute top-8 right-8 bg-gray-300 p-3 rounded-full shadow-xl w-6 h-6" />
      </div>
    </div>
  );
};

export default BadgeSkeleton;
