'use client';

import React from 'react';

interface LightingLayerProps {
  lightingId: string | null;
  lightingMode: 'day' | 'sunset' | 'night';
}

export const LightingLayer: React.FC<LightingLayerProps> = ({ lightingId, lightingMode }) => {
  if (!lightingId) return null;

  const isNightOrSunset = lightingMode === 'night' || lightingMode === 'sunset';

  return (
    <div className="absolute inset-0 pointer-events-none z-18 overflow-hidden select-none">
      {/* --- OPTION 1: BENQ SCREENBAR HALO --- */}
      {lightingId === 'light-screenbar' && (
        <div className="relative w-full h-full flex justify-center">
          {/* Lightbar clamped atop monitor */}
          <div className="absolute top-[28%] sm:top-[26%] flex flex-col items-center">
            {/* Horizontal Light Tube */}
            <div className="w-40 sm:w-52 h-2.5 rounded-full bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center">
              <div className="w-36 sm:w-48 h-1 rounded-full bg-amber-100 shadow-[0_0_12px_#FDE047]" />
            </div>
            {/* Clamp bracket */}
            <div className="w-5 h-4 bg-slate-800 rounded-b-xs border-x border-slate-700" />
          </div>

          {/* Cast Light Cone onto the desk surface */}
          <div
            className={`absolute top-[29%] left-1/2 -translate-x-1/2 w-72 sm:w-96 h-64 bg-gradient-to-b from-amber-200/40 via-amber-100/20 to-transparent rounded-b-full filter blur-md transition-opacity duration-500 ${
              isNightOrSunset ? 'opacity-90' : 'opacity-60'
            }`}
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
      )}

      {/* --- OPTION 2: WARM BRASS ARCHITECTURAL ANGLE LAMP --- */}
      {lightingId === 'light-brass-architect' && (
        <div className="absolute left-[14%] sm:left-[18%] top-[30%] sm:top-[28%] z-22">
          {/* Articulated Brass Arm & Shade */}
          <div className="relative flex flex-col items-center">
            {/* Brass Dome Shade tilted downwards */}
            <div className="w-10 h-7 rounded-t-full bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 shadow-lg border border-amber-300 transform -rotate-25 origin-bottom-right">
              {/* Internal glowing bulb */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 rounded-t-full bg-yellow-200 shadow-[0_0_15px_#FACC15]" />
            </div>

            {/* Articulated Brass Rods & Joints */}
            <svg className="w-20 h-28 -mt-2" viewBox="0 0 80 110">
              {/* Upper arm */}
              <line x1="25" y1="5" x2="55" y2="50" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              <circle cx="55" cy="50" r="3.5" fill="#B45309" />
              {/* Lower arm */}
              <line x1="55" y1="50" x2="35" y2="95" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              <circle cx="35" cy="95" r="3.5" fill="#B45309" />
              {/* Base */}
              <rect x="20" y="98" width="30" height="8" rx="4" fill="#92400E" stroke="#F59E0B" strokeWidth="1" />
            </svg>

            {/* Warm Desk Glow Cone */}
            <div
              className={`absolute top-6 left-2 w-56 h-60 bg-gradient-to-br from-amber-300/45 via-yellow-200/20 to-transparent filter blur-md transition-opacity duration-500 pointer-events-none ${
                isNightOrSunset ? 'opacity-95' : 'opacity-65'
              }`}
              style={{
                clipPath: 'polygon(0% 0%, 30% 0%, 100% 100%, 0% 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* --- OPTION 3: BALI SUNSET AMBIENT LED STRIP --- */}
      {lightingId === 'light-sunset-rgb' && (
        <div className="absolute top-[26%] left-1/2 -translate-x-1/2 w-[85%] max-w-2xl h-48 pointer-events-none">
          {/* Sunset glow behind monitor and desk */}
          <div
            className={`w-full h-full bg-gradient-to-t from-orange-500/40 via-rose-500/30 to-amber-400/20 rounded-full filter blur-2xl transition-opacity duration-700 ${
              isNightOrSunset ? 'opacity-90 animate-pulse' : 'opacity-40'
            }`}
          />
        </div>
      )}
    </div>
  );
};
