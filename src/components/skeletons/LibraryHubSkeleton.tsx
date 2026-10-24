import React from 'react';
import { SkeletonBlock } from './SkeletonBlock';

export const LibraryHubSkeleton: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-20 max-w-6xl mx-auto pb-16 select-none animate-pulse" aria-busy="true" aria-label="Loading Tactical Library">
      {/* Hero Section Skeleton */}
      <div className="rounded-[28px] p-7 sm:p-10 lg:p-12 border border-[#e6e6e8] dark:border-[#2c2c2e] bg-[#f5f5f7] dark:bg-[#161617]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl w-full">
            {/* Kicker */}
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-4 w-36" rounded="rounded-md" />
              <SkeletonBlock className="h-4 w-28 hidden sm:block" rounded="rounded-md" />
            </div>

            {/* Headline Title */}
            <div className="space-y-2">
              <SkeletonBlock className="h-12 sm:h-14 w-3/4 max-w-md" rounded="rounded-xl" />
              <SkeletonBlock className="h-4 sm:h-5 w-full max-w-xl" rounded="rounded-lg" />
              <SkeletonBlock className="h-4 sm:h-5 w-4/5 max-w-lg" rounded="rounded-lg" />
            </div>

            {/* Unboxed Metadata row */}
            <div className="flex flex-wrap gap-3 pt-2">
              <SkeletonBlock className="h-5 w-32" rounded="rounded-md" />
              <SkeletonBlock className="h-5 w-36" rounded="rounded-md" />
              <SkeletonBlock className="h-5 w-44" rounded="rounded-md" />
            </div>
          </div>

          {/* Profile Card Skeleton */}
          <div className="w-full lg:w-72 bg-white dark:bg-[#1c1c1e] border border-[#e6e6e8] dark:border-[#2c2c2e] rounded-[28px] p-6 shrink-0 space-y-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-10 h-10 shrink-0" rounded="rounded-full" />
              <div className="space-y-1.5 w-full">
                <SkeletonBlock className="h-3 w-20" rounded="rounded" />
                <SkeletonBlock className="h-4 w-28" rounded="rounded" />
              </div>
            </div>
            <div className="pt-3 border-t border-[#e6e6e8] dark:border-[#2c2c2e] flex items-center justify-between">
              <SkeletonBlock className="h-4 w-24" rounded="rounded" />
              <SkeletonBlock className="h-7 w-20" rounded="rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Flagship Game Showcase Cards */}
      <div className="space-y-6">
        <div className="space-y-2">
          <SkeletonBlock className="h-7 w-48" rounded="rounded-lg" />
          <SkeletonBlock className="h-4 w-72" rounded="rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[28px] border border-[#e6e6e8] dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 16:10 Thumbnail preview */}
                <div className="p-2">
                  <div className="aspect-[16/10] w-full rounded-[20px] overflow-hidden bg-[#f5f5f7] dark:bg-[#161617]">
                    <SkeletonBlock className="w-full h-full rounded-[20px]" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-3.5 w-24" rounded="rounded" />
                    <SkeletonBlock className="h-3.5 w-16" rounded="rounded" />
                  </div>
                  <SkeletonBlock className="h-6 w-36" rounded="rounded-lg" />
                  <SkeletonBlock className="h-4 w-full" rounded="rounded" />
                  <SkeletonBlock className="h-4 w-4/5" rounded="rounded" />

                  {/* 4 launch pills */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <SkeletonBlock className="h-7" rounded="rounded-full" />
                    <SkeletonBlock className="h-7" rounded="rounded-full" />
                    <SkeletonBlock className="h-7" rounded="rounded-full" />
                    <SkeletonBlock className="h-7" rounded="rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <SkeletonBlock className="h-9 w-full" rounded="rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <SkeletonBlock className="h-7 w-44" rounded="rounded-lg" />
            <SkeletonBlock className="h-4 w-64" rounded="rounded-md" />
          </div>
          <SkeletonBlock className="h-9 w-64" rounded="rounded-full" />
        </div>

        {/* Search bar */}
        <SkeletonBlock className="h-11 w-full" rounded="rounded-full" />

        {/* Grid of Tactical Tools Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-7 rounded-[28px] border border-[#e6e6e8] dark:border-[#2c2c2e] bg-white dark:bg-[#1c1c1e] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <SkeletonBlock className="w-10 h-10" rounded="rounded-full" />
                  <SkeletonBlock className="h-4 w-20" rounded="rounded" />
                </div>
                <SkeletonBlock className="h-4 w-28" rounded="rounded" />
                <SkeletonBlock className="h-5 w-3/4" rounded="rounded-lg" />
                <div className="space-y-1.5 pt-1">
                  <SkeletonBlock className="h-3.5 w-full" rounded="rounded" />
                  <SkeletonBlock className="h-3.5 w-4/5" rounded="rounded" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#e6e6e8] dark:border-[#2c2c2e] flex items-center justify-between">
                <SkeletonBlock className="h-3.5 w-24" rounded="rounded" />
                <SkeletonBlock className="h-3.5 w-16" rounded="rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
