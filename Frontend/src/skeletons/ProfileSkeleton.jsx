import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="relative w-full animate-pulse">
      {/* Profile Image Skeleton */}
      <div className="absolute md:top-0 top-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-36 h-36 rounded-full bg-gray-300 border-4 border-blue-300 shadow-xl" />
      </div>

      <div className="w-full px-4 flex flex-col gap-5">
        {/* Name and Email Skeleton */}
        <div>
          <div className="h-6 bg-gray-300 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-56 mb-4" />
        </div>

        <div>
          {/* Current Progress Title Skeleton */}
          <div className="h-5 bg-gray-300 rounded w-40 mb-3" />

          {/* Current Badge Title Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32 mb-4" />

          {/* Progress Bar Section */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-300" />
            <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden relative" />
            <div className="w-20 h-20 rounded-full bg-gray-300" />
          </div>

          {/* Points Skeleton */}
          <div className="h-5 bg-gray-300 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-60 mb-6" />
        </div>
      </div>

      {/* Stats Box Skeleton */}
      <div className="w-11/12 bg-gray-100 border border-gray-200 rounded-xl shadow-sm p-4 mx-auto">
        <div className="flex flex-col gap-3 text-md">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-4 bg-gray-300 rounded w-10" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-28" />
            <div className="h-4 bg-gray-300 rounded w-10" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-300 rounded w-20" />
            <div className="h-4 bg-gray-300 rounded w-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
