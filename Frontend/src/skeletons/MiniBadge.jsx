import React from "react";

const MiniBadgeSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 shadow animate-pulse">
      <div className="w-20 h-18 bg-gray-300 rounded mb-2" />
      <div className="h-4 bg-gray-300 rounded w-16" />
    </div>
  );
};

export default MiniBadgeSkeleton;
