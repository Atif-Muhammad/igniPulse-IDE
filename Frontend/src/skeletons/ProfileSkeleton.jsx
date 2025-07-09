import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative w-full animate-pulse">
      {/* Profile Image Skeleton */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 md:top-0 top-20 left-1/2">
        <div className="bg-gray-300 border-4 border-blue-300 rounded-full shadow-xl w-36 h-36" />
      </div>

      <div className="flex flex-col w-full gap-5 px-4">
        {/* Name and Email Skeleton */}
        <div>
          <div className="w-48 h-6 mb-2 bg-gray-300 rounded" />
          <div className="w-56 h-4 mb-4 bg-gray-300 rounded" />
        </div>

        <div>
          {/* Current Progress Title Skeleton */}
          <div className="w-40 h-5 mb-3 bg-gray-300 rounded" />

          {/* Current Badge Title Skeleton */}
          <div className="w-32 h-4 mb-4 bg-gray-300 rounded" />

          {/* Progress Bar Section */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
            <div className="relative flex-1 h-2 overflow-hidden bg-gray-300 rounded-full" />
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          </div>

          {/* Points Skeleton */}
          <div className="w-48 h-5 mb-2 bg-gray-300 rounded" />
          <div className="h-4 mb-6 bg-gray-300 rounded w-60" />
        </div>
      </div>

      {/* Stats Box Skeleton */}
      <div className="w-11/12 p-4 mx-auto bg-gray-100 border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col gap-3 text-md">
          <div className="flex justify-between">
            <div className="w-32 h-4 bg-gray-300 rounded" />
            <div className="w-10 h-4 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-28" />
            <div className="w-10 h-4 bg-gray-300 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="w-20 h-4 bg-gray-300 rounded" />
            <div className="w-10 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
