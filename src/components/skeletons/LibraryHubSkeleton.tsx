import React from 'react';
import { SkeletonBlock } from './SkeletonBlock';

export const LibraryHubSkeleton: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-12 select-none" aria-busy="true" aria-label="Loading Tactical Library">
      {/* Hero Section Skeleton */}
      <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-[#071326] via-[#050c18] to-[#03060c] p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-4 max-w-2xl w-full">
            {/* Tag Pill */}
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-6 w-36" theme="cyan" rounded="rounded-full" />
              <SkeletonBlock className="h-6 w-24 hidden sm:block" theme="cyan" rounded="rounded-full" />
            </div>

            {/* Headline Title */}
            <div className="space-y-2">
              <SkeletonBlock className="h-10 sm:h-12 w-3/4 max-w-md" theme="cyan" rounded="rounded-xl" />
              <SkeletonBlock className="h-4 sm:h-5 w-full max-w-xl" rounded="rounded-lg" />
              <SkeletonBlock className="h-4 sm:h-5 w-4/5 max-w-lg" rounded="rounded-lg" />
            </div>

            {/* Calibrated Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <SkeletonBlock className="h-7 w-32" theme="cyan" rounded="rounded-xl" />
              <SkeletonBlock className="h-7 w-40" theme="cyan" rounded="rounded-xl" />
              <SkeletonBlock className="h-7 w-48" theme="emerald" rounded="rounded-xl" />
            </div>
          </div>

          {/* Survivor Profile Card Skeleton */}
          <div className="w-full lg:w-72 bg-[#081224]/90 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 shrink-0 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-12 h-12 shrink-0" theme="cyan" rounded="rounded-xl" />
              <div className="space-y-2 w-full">
                <SkeletonBlock className="h-3 w-20" rounded="rounded" />
                <SkeletonBlock className="h-4 w-32" theme="cyan" rounded="rounded" />
                <SkeletonBlock className="h-3 w-24" rounded="rounded" />
              </div>
            </div>
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <SkeletonBlock className="h-4 w-24" rounded="rounded" />
              <SkeletonBlock className="h-4 w-16" rounded="rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Flagship Game Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* CARD 1: ARK ASCENDED */}
        <div className="rounded-3xl overflow-hidden border-2 border-cyan-500/30 bg-[#08162b]/60 flex flex-col justify-between shadow-2xl">
          <div>
            {/* Header */}
            <div className="bg-[#0a1b32]/80 px-5 py-3.5 flex items-center justify-between border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="w-4 h-4" theme="cyan" rounded="rounded" />
                <SkeletonBlock className="h-4 w-36" theme="cyan" rounded="rounded" />
              </div>
              <SkeletonBlock className="h-5 w-24" theme="cyan" rounded="rounded" />
            </div>
            {/* 16:9 Thumbnail preview */}
            <div className="aspect-[16/9] w-full border-b border-cyan-500/20">
              <SkeletonBlock className="w-full h-full rounded-none" theme="cyan" />
            </div>
            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-48" theme="cyan" rounded="rounded-lg" />
                <SkeletonBlock className="h-4 w-full" rounded="rounded" />
                <SkeletonBlock className="h-4 w-4/5" rounded="rounded" />
              </div>
              {/* 4 quick launch pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <SkeletonBlock className="h-10" theme="cyan" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="cyan" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="cyan" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="cyan" rounded="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 pt-0">
            <SkeletonBlock className="h-12 w-full" theme="cyan" rounded="rounded-xl" />
          </div>
        </div>

        {/* CARD 2: MINECRAFT 1.21+ */}
        <div className="rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-[#150a28]/60 flex flex-col justify-between shadow-2xl">
          <div>
            {/* Header */}
            <div className="bg-[#1e0d38]/80 px-5 py-3.5 flex items-center justify-between border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="w-4 h-4" theme="purple" rounded="rounded" />
                <SkeletonBlock className="h-4 w-40" theme="purple" rounded="rounded" />
              </div>
              <SkeletonBlock className="h-5 w-24" theme="purple" rounded="rounded" />
            </div>
            {/* 16:9 Thumbnail preview */}
            <div className="aspect-[16/9] w-full border-b border-purple-500/20">
              <SkeletonBlock className="w-full h-full rounded-none" theme="purple" />
            </div>
            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-48" theme="purple" rounded="rounded-lg" />
                <SkeletonBlock className="h-4 w-full" rounded="rounded" />
                <SkeletonBlock className="h-4 w-4/5" rounded="rounded" />
              </div>
              {/* 4 quick launch pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <SkeletonBlock className="h-10" theme="purple" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="purple" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="purple" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="purple" rounded="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 pt-0">
            <SkeletonBlock className="h-12 w-full" theme="purple" rounded="rounded-xl" />
          </div>
        </div>

        {/* CARD 3: TERRARIA 1.4.4+ */}
        <div className="rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-[#08170e]/60 flex flex-col justify-between shadow-2xl">
          <div>
            {/* Header */}
            <div className="bg-[#0d2215]/80 px-5 py-3.5 flex items-center justify-between border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="w-4 h-4" theme="emerald" rounded="rounded" />
                <SkeletonBlock className="h-4 w-44" theme="emerald" rounded="rounded" />
              </div>
              <SkeletonBlock className="h-5 w-24" theme="emerald" rounded="rounded" />
            </div>
            {/* 16:9 Thumbnail preview */}
            <div className="aspect-[16/9] w-full border-b border-emerald-500/20">
              <SkeletonBlock className="w-full h-full rounded-none" theme="emerald" />
            </div>
            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-48" theme="emerald" rounded="rounded-lg" />
                <SkeletonBlock className="h-4 w-full" rounded="rounded" />
                <SkeletonBlock className="h-4 w-4/5" rounded="rounded" />
              </div>
              {/* 4 quick launch pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <SkeletonBlock className="h-10" theme="emerald" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="emerald" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="emerald" rounded="rounded-xl" />
                <SkeletonBlock className="h-10" theme="emerald" rounded="rounded-xl" />
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-6 pt-0">
            <SkeletonBlock className="h-12 w-full" theme="emerald" rounded="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Interactive Tool Search & Filter Bar Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <SkeletonBlock className="h-6 w-44" rounded="rounded-lg" />
            <SkeletonBlock className="h-4 w-64" rounded="rounded" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-10 w-28" rounded="rounded-xl" />
            <SkeletonBlock className="h-10 w-32" rounded="rounded-xl" />
            <SkeletonBlock className="h-10 w-32" rounded="rounded-xl" />
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <SkeletonBlock className="h-12 w-full" rounded="rounded-2xl" />
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-hidden py-1">
          <SkeletonBlock className="h-8 w-20 shrink-0" theme="cyan" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-28 shrink-0" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-32 shrink-0" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-28 shrink-0" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-36 shrink-0" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-24 shrink-0" rounded="rounded-xl" />
        </div>
      </div>

      {/* Grid of Tactical Tools Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.08] bg-[#070e1c]/80 p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SkeletonBlock className="w-10 h-10" theme="cyan" rounded="rounded-xl" />
                <SkeletonBlock className="h-5 w-20" rounded="rounded-full" />
              </div>
              <SkeletonBlock className="h-5 w-3/4" rounded="rounded" />
              <div className="space-y-1.5 pt-1">
                <SkeletonBlock className="h-3.5 w-full" rounded="rounded" />
                <SkeletonBlock className="h-3.5 w-5/6" rounded="rounded" />
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <SkeletonBlock className="h-3.5 w-24" rounded="rounded" />
              <SkeletonBlock className="h-3.5 w-16" theme="cyan" rounded="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
