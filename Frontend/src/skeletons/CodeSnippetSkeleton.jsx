import React from "react";

const CodeSnippetSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Date skeleton */}
      {/* <div className="h-4 bg-gray-300 rounded w-24" /> */}

      {/* Code box skeleton */}
      <div className="bg-gray-300 px-4 py-3 rounded-lg mb-2 flex justify-between items-center font-mono shadow">
        <div className="h-4 bg-gray-400 rounded w-32" />
        <div className="h-4 w-4 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
};

export default CodeSnippetSkeleton;
