import React from 'react';
import { SkeletonBlock } from './SkeletonBlock';

interface CalculatorSkeletonProps {
  type?: 'taming' | 'soakers' | 'raiding' | 'recipe' | 'breeding' | 'resources' | 'maps' | 'minecraft' | 'terraria' | 'rust' | 'generic';
  theme?: 'cyan' | 'purple' | 'emerald' | 'orange' | 'default';
  title?: string;
}

export const CalculatorSkeleton: React.FC<CalculatorSkeletonProps> = ({
  type = 'generic',
  theme = 'cyan',
}) => {
  const isTerraria = type === 'terraria';
  const isMinecraft = type === 'minecraft';
  const isRust = type === 'rust';
  const isMaps = type === 'maps';
  const activeTheme = isTerraria ? 'emerald' : isMinecraft ? 'purple' : isRust ? 'orange' : theme;

  return (
    <div 
      className="space-y-6 sm:space-y-8 animate-fade-in pb-12 select-none" 
      aria-busy="true" 
      aria-label="Loading Tactical Calculator"
    >
      {/* Tactical Header Skeleton */}
      <div className={`relative rounded-2xl sm:rounded-3xl border ${
        isTerraria 
          ? 'border-emerald-500/30 bg-[#091515]' 
          : isMinecraft 
          ? 'border-purple-500/30 bg-[#120a22]' 
          : isRust
          ? 'border-orange-500/30 bg-[#120e0c]'
          : 'border-white/[0.08] bg-gradient-to-r from-[#081324] via-[#050c18] to-[#040810]'
      } p-5 sm:p-7 shadow-xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
            {/* Icon Block */}
            <SkeletonBlock 
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" 
              theme={activeTheme} 
              rounded={isTerraria ? 'rounded-lg' : 'rounded-2xl'} 
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <SkeletonBlock className="h-6 sm:h-7 w-48 sm:w-64" theme={activeTheme} rounded="rounded-lg" />
                <SkeletonBlock className="h-5 w-24" theme={activeTheme} rounded="rounded-full" />
              </div>
              <SkeletonBlock className="h-4 w-72 sm:w-96 max-w-full" rounded="rounded" />
            </div>
          </div>

          {/* Quick Action / Rate indicator */}
          <div className="flex items-center gap-2 pt-2 md:pt-0">
            <SkeletonBlock className="h-9 w-28" theme={activeTheme} rounded="rounded-xl" />
            <SkeletonBlock className="h-9 w-32" rounded="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Control / Subtab Navigation Bar */}
      <div className={`flex items-center justify-between gap-3 p-3 rounded-2xl ${
        isTerraria ? 'bg-[#061214] border-emerald-500/20' : isMinecraft ? 'bg-[#0f071e] border-purple-500/20' : 'bg-[#070e1c] border-white/[0.06]'
      } border overflow-x-auto no-scrollbar`}>
        <div className="flex items-center gap-2 shrink-0">
          <SkeletonBlock className="h-8 w-24" theme={activeTheme} rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-36" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-28 hidden sm:block" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-32 hidden md:block" rounded="rounded-xl" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SkeletonBlock className="h-8 w-20" rounded="rounded-xl" />
          <SkeletonBlock className="h-8 w-24" theme={activeTheme} rounded="rounded-xl" />
        </div>
      </div>

      {/* SPECIAL SKELETON: TERRARIA 18-BOSS MATRIX / CHECKLIST */}
      {isTerraria ? (
        <div className="space-y-6">
          {/* Terraria 5 subtabs bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full" theme="emerald" rounded="rounded-xl" />
            ))}
          </div>

          {/* Terraria Boss Table Skeleton */}
          <div className="rounded-2xl border-2 border-emerald-600/30 bg-[#081414] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="space-y-1">
                <SkeletonBlock className="h-6 w-48" theme="emerald" rounded="rounded-lg" />
                <SkeletonBlock className="h-4 w-72" rounded="rounded" />
              </div>
              <SkeletonBlock className="h-9 w-32" theme="emerald" rounded="rounded-xl" />
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 p-3 bg-black/40 rounded-xl border border-white/[0.06]">
              <SkeletonBlock className="h-4 w-8" rounded="rounded" />
              <SkeletonBlock className="h-4 w-28" theme="emerald" rounded="rounded" />
              <SkeletonBlock className="h-4 w-20" rounded="rounded" />
              <SkeletonBlock className="h-4 w-20" rounded="rounded" />
              <SkeletonBlock className="h-4 w-20" rounded="rounded" />
            </div>

            {/* 6 Boss Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4 p-3.5 bg-[#0d1e1e]/60 rounded-xl border border-white/[0.04] items-center">
                <SkeletonBlock className="h-4 w-6" rounded="rounded" />
                <div className="flex items-center gap-2.5">
                  <SkeletonBlock className="w-8 h-8 rounded-lg shrink-0" theme="emerald" />
                  <SkeletonBlock className="h-4 w-28" theme="emerald" rounded="rounded" />
                </div>
                <SkeletonBlock className="h-4 w-16" rounded="rounded" />
                <SkeletonBlock className="h-4 w-16" theme="emerald" rounded="rounded" />
                <SkeletonBlock className="h-4 w-16" rounded="rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : isMaps ? (
        /* SPECIAL SKELETON: INTERACTIVE RESOURCE MAPS */
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-9 w-32 shrink-0" theme="cyan" rounded="rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Canvas placeholder */}
            <div className="lg:col-span-3 aspect-[4/3] rounded-3xl border border-cyan-500/30 bg-[#050f1d] overflow-hidden">
              <SkeletonBlock className="w-full h-full rounded-none" theme="cyan" />
            </div>

            {/* Map Resource Filters sidebar */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#070e1c] border border-white/[0.08]">
              <SkeletonBlock className="h-5 w-32" theme="cyan" rounded="rounded" />
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="w-6 h-6 rounded-md" theme="cyan" />
                    <SkeletonBlock className="h-4 w-20" rounded="rounded" />
                  </div>
                  <SkeletonBlock className="h-4 w-8" rounded="rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD DUAL-COLUMN CALCULATOR SKELETON */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Search & Entity Selection (4 cols) */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4">
            {/* Search box */}
            <SkeletonBlock className="h-11 w-full" rounded="rounded-xl" />

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-hidden">
              <SkeletonBlock className="h-7 w-16 shrink-0" theme={activeTheme} rounded="rounded-lg" />
              <SkeletonBlock className="h-7 w-20 shrink-0" rounded="rounded-lg" />
              <SkeletonBlock className="h-7 w-16 shrink-0" rounded="rounded-lg" />
              <SkeletonBlock className="h-7 w-24 shrink-0" rounded="rounded-lg" />
            </div>

            {/* List items (e.g. Creature or Recipe picker) */}
            <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-[#070e1a]/80 p-3 max-h-[500px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.04] bg-[#0a1424]/50"
                >
                  <SkeletonBlock className="w-10 h-10 shrink-0" theme={activeTheme} rounded="rounded-lg" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <SkeletonBlock className="h-4 w-3/4" rounded="rounded" />
                    <SkeletonBlock className="h-3 w-1/2" rounded="rounded" />
                  </div>
                  <SkeletonBlock className="h-5 w-12 shrink-0" rounded="rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Calculator Engine & Output Metrics (8 cols) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
            {/* Quick Metrics 4-Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-white/[0.06] bg-[#081224]/80 space-y-2.5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-3 w-16" rounded="rounded" />
                    <SkeletonBlock className="w-4 h-4" theme={activeTheme} rounded="rounded-full" />
                  </div>
                  <SkeletonBlock className="h-7 w-24" theme={activeTheme} rounded="rounded-lg" />
                  <SkeletonBlock className="h-3 w-20" rounded="rounded" />
                </div>
              ))}
            </div>

            {/* Primary Calculation Table / Card */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#070e1c] p-5 sm:p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-5 w-48" theme={activeTheme} rounded="rounded" />
                  <SkeletonBlock className="h-3.5 w-64" rounded="rounded" />
                </div>
                <SkeletonBlock className="h-8 w-28" theme={activeTheme} rounded="rounded-xl" />
              </div>

              {/* Table Rows Shimmer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  <SkeletonBlock className="h-4 w-28" rounded="rounded" />
                  <SkeletonBlock className="h-4 w-20" theme={activeTheme} rounded="rounded" />
                  <SkeletonBlock className="h-4 w-16 hidden sm:block" rounded="rounded" />
                  <SkeletonBlock className="h-7 w-20" rounded="rounded-lg" />
                </div>

                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-[#091322]/50"
                  >
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="w-8 h-8 rounded-lg" theme={activeTheme} />
                      <SkeletonBlock className="h-4 w-32" rounded="rounded" />
                    </div>
                    <SkeletonBlock className="h-4 w-16" theme={activeTheme} rounded="rounded" />
                    <SkeletonBlock className="h-4 w-16 hidden sm:block" rounded="rounded" />
                    <SkeletonBlock className="h-7 w-20" theme={activeTheme} rounded="rounded-lg" />
                  </div>
                ))}
              </div>

              {/* Tactical Advice & Alert Banner Skeleton */}
              <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#091528]/60 flex items-start gap-3 mt-4">
                <SkeletonBlock className="w-5 h-5 shrink-0 mt-0.5" theme={activeTheme} rounded="rounded" />
                <div className="space-y-2 flex-1">
                  <SkeletonBlock className="h-4 w-44" rounded="rounded" />
                  <SkeletonBlock className="h-3.5 w-full" rounded="rounded" />
                  <SkeletonBlock className="h-3.5 w-4/5" rounded="rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
