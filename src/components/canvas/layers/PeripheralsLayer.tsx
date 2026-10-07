'use client';

import React from 'react';

interface PeripheralsLayerProps {
  peripheralsId: string | null;
}

export const PeripheralsLayer: React.FC<PeripheralsLayerProps> = ({ peripheralsId }) => {
  if (!peripheralsId) return null;

  return (
    <div className="absolute top-[46%] sm:top-[44%] left-1/2 -translate-x-1/2 z-19 flex flex-col items-center select-none pointer-events-none transition-all duration-300">
      {/* --- DESK MAT (SHARED BASE) --- */}
      <div
        className={`w-64 sm:w-80 h-16 sm:h-20 rounded-md shadow-md flex items-center justify-center relative transition-colors duration-300 ${
          peripheralsId === 'peripherals-deskmat-wool'
            ? 'bg-neutral-800/90 border border-neutral-700 shadow-inner'
            : peripheralsId === 'peripherals-apple-studio'
            ? 'bg-slate-800/80 border border-slate-700/60'
            : 'bg-stone-900/95 border border-stone-800'
        }`}
        style={{
          transform: 'perspective(400px) rotateX(15deg)',
          transformOrigin: 'bottom center',
        }}
      >
        {/* Felt Wool Texture or Leather edge stitching */}
        <div className="absolute inset-1 border border-white/5 rounded-xs pointer-events-none" />

        {/* --- OPTION 1: LOGITECH MX MASTER 3S & MECHANICAL KEYBOARD --- */}
        {peripheralsId === 'peripherals-pro-bundle' && (
          <div className="flex items-center gap-4">
            {/* MX Mechanical Mini Keyboard */}
            <div className="w-36 sm:w-44 h-9 sm:h-11 rounded-sm bg-slate-900 border border-slate-700 shadow-md p-0.5 flex flex-col justify-between">
              {/* Key rows grid simulation */}
              <div className="flex justify-between gap-0.5 h-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-slate-800 rounded-xs" />
                ))}
              </div>
              <div className="flex justify-between gap-0.5 h-1.5">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-slate-700 rounded-xs" />
                ))}
              </div>
              <div className="flex justify-between gap-0.5 h-2">
                <div className="w-4 bg-slate-800 rounded-xs" />
                <div className="flex-1 bg-slate-600 rounded-xs" /> {/* Spacebar */}
                <div className="w-4 bg-slate-800 rounded-xs" />
              </div>
            </div>

            {/* MX Master 3S Mouse */}
            <div className="w-6 sm:w-7 h-10 sm:h-12 rounded-full bg-slate-900 border border-slate-700 shadow-md relative flex flex-col items-center pt-1">
              {/* Click button split */}
              <div className="w-4 h-4 border-b border-slate-700 flex justify-center">
                <div className="w-0.5 h-full bg-slate-700" />
              </div>
              {/* Metal MagSpeed Scroll Wheel */}
              <div className="w-1.5 h-3 rounded-full bg-slate-400 absolute top-1 shadow-xs" />
              {/* Ergonomic thumb rest wing */}
              <div className="absolute -left-1 bottom-2 w-2 h-4 rounded-l-full bg-slate-800" />
            </div>
          </div>
        )}

        {/* --- OPTION 2: APPLE MAGIC KEYBOARD & TRACKPAD --- */}
        {peripheralsId === 'peripherals-apple-studio' && (
          <div className="flex items-center gap-3">
            {/* Apple Magic Keyboard with Touch ID */}
            <div className="w-36 sm:w-44 h-8 sm:h-10 rounded-sm bg-neutral-300 border border-neutral-400 shadow-md p-1 flex flex-col justify-between">
              <div className="flex justify-between gap-0.5 h-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-neutral-900 rounded-xs" />
                ))}
              </div>
              <div className="flex justify-between gap-0.5 h-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-neutral-900 rounded-xs" />
                ))}
              </div>
              <div className="flex justify-center h-1.5">
                <div className="w-16 bg-neutral-900 rounded-xs" />
              </div>
            </div>

            {/* Apple Magic Trackpad */}
            <div className="w-12 sm:w-14 h-8 sm:h-10 rounded-sm bg-neutral-300 border border-neutral-400 shadow-md relative flex items-center justify-center">
              <div className="w-10 sm:w-12 h-6 sm:h-8 rounded-xs bg-neutral-200 shadow-inner" />
            </div>
          </div>
        )}

        {/* --- OPTION 3: MERINO WOOL DESK MAT ALONE (CLEAN DESK) --- */}
        {peripheralsId === 'peripherals-deskmat-wool' && (
          <div className="flex items-center justify-center">
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
              MERINO WOOL FELT • 900 × 400 MM
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
