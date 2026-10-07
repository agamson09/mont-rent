'use client';

import React from 'react';

interface DeskLayerProps {
  deskId: string;
}

export const DeskLayer: React.FC<DeskLayerProps> = ({ deskId }) => {
  // Model configurations
  const deskConfig = {
    'desk-standing-teak': {
      topColor: 'from-[#C98244] via-[#DE9958] to-[#B77336]',
      edgeColor: 'bg-[#9C5D28]',
      legColor: 'bg-[#1E293B]',
      feetColor: 'bg-[#0F172A]',
      heightType: 'motorized',
      texture: 'wood',
      widthClass: 'w-[78%] max-w-[620px]',
    },
    'desk-minimalist-white': {
      topColor: 'from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9]',
      edgeColor: 'bg-[#CBD5E1]',
      legColor: 'bg-[#E2E8F0]',
      feetColor: 'bg-[#94A3B8]',
      heightType: 'fixed',
      texture: 'matte',
      widthClass: 'w-[74%] max-w-[580px]',
    },
    'desk-artisan-walnut': {
      topColor: 'from-[#453022] via-[#5A402E] to-[#36251A]',
      edgeColor: 'bg-[#291B13]',
      legColor: 'bg-[#18181B]',
      feetColor: 'bg-[#09090B]',
      heightType: 'executive',
      texture: 'walnut',
      widthClass: 'w-[82%] max-w-[660px]',
    },
    'desk-bamboo-compact': {
      topColor: 'from-[#DFC08D] via-[#EBD2A4] to-[#CCA973]',
      edgeColor: 'bg-[#B58D54]',
      legColor: 'bg-[#D4B07B]',
      feetColor: 'bg-[#A37B42]',
      heightType: 'compact',
      texture: 'bamboo',
      widthClass: 'w-[68%] max-w-[520px]',
    },
  }[deskId] || {
    topColor: 'from-[#C98244] via-[#DE9958] to-[#B77336]',
    edgeColor: 'bg-[#9C5D28]',
    legColor: 'bg-[#1E293B]',
    feetColor: 'bg-[#0F172A]',
    heightType: 'motorized',
    texture: 'wood',
    widthClass: 'w-[78%] max-w-[620px]',
  };

  return (
    <div className={`relative mx-auto ${deskConfig.widthClass} transition-all duration-500`}>
      {/* --- DESK SURFACE (TOP) --- */}
      <div className="relative z-10">
        {/* Tabletop Perspective Surface */}
        <div
          className={`h-28 rounded-t-xl bg-gradient-to-b ${deskConfig.topColor} shadow-md border-t border-white/20 relative overflow-hidden`}
          style={{
            transform: 'perspective(600px) rotateX(16deg)',
            transformOrigin: 'bottom center',
          }}
        >
          {/* Surface Texture Grains */}
          {deskConfig.texture === 'wood' && (
            <div className="absolute inset-0 opacity-15 mix-blend-overlay">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <filter id="woodGrain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04 0.003" numOctaves="3" />
                  <feColorMatrix type="saturate" values="0.1" />
                </filter>
                <rect width="100%" height="100%" filter="url(#woodGrain)" />
              </svg>
            </div>
          )}

          {deskConfig.texture === 'walnut' && (
            <div className="absolute inset-0 opacity-20 mix-blend-color-dodge">
              <svg className="w-full h-full">
                <filter id="walnutGrain">
                  <feTurbulence type="turbulence" baseFrequency="0.03 0.005" numOctaves="4" />
                </filter>
                <rect width="100%" height="100%" filter="url(#walnutGrain)" />
              </svg>
            </div>
          )}

          {/* Chamfer Highlight at rear edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />

          {/* Desk Cable Grommet */}
          <div className="absolute top-3 right-8 w-5 h-5 rounded-full bg-black/40 border border-white/20 shadow-inner flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-black/70" />
          </div>

          {/* Motorized Height Keypad Display (For Standing Desk) */}
          {deskConfig.heightType === 'motorized' && (
            <div className="absolute bottom-2 right-6 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[9px] font-mono text-emerald-400 flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>74.5 cm</span>
            </div>
          )}

          {/* Executive Built-in Brass Power Hub */}
          {deskConfig.heightType === 'executive' && (
            <div className="absolute top-3 left-10 w-12 h-3.5 rounded bg-neutral-900 border border-amber-600/40 flex items-center justify-around px-1">
              <div className="w-1.5 h-1.5 bg-amber-500/80 rounded-xs" />
              <div className="w-1.5 h-1.5 bg-amber-500/80 rounded-xs" />
              <div className="w-2.5 h-1 bg-amber-300/40 rounded-xs" />
            </div>
          )}
        </div>

        {/* Front Edge Bevel (Thickness of tabletop) */}
        <div className={`h-4.5 rounded-b-md ${deskConfig.edgeColor} shadow-xl flex items-center justify-between px-6 border-b border-black/30`}>
          <div className="w-full h-0.5 bg-white/10" />
        </div>
      </div>

      {/* --- DESK LEGS & FRAME --- */}
      <div className="relative -mt-2 z-0 flex justify-between px-6 sm:px-10">
        {/* Left Leg */}
        <div className="flex flex-col items-center">
          {/* Leg column */}
          <div className={`w-5 sm:w-6 h-40 sm:h-48 ${deskConfig.legColor} shadow-2xl relative`}>
            {/* Telescopic segment lines for standing desk */}
            {deskConfig.heightType === 'motorized' && (
              <>
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-black/40 border-b border-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-black/40 border-b border-white/10" />
              </>
            )}
          </div>
          {/* Leg Foot Base */}
          <div className={`w-14 sm:w-18 h-3 rounded-full ${deskConfig.feetColor} shadow-lg`} />
        </div>

        {/* Cable Management Beam */}
        <div className="flex-1 mt-4 mx-4 h-3 bg-black/50 rounded-sm shadow-inner hidden sm:block opacity-70" />

        {/* Right Leg */}
        <div className="flex flex-col items-center">
          {/* Leg column */}
          <div className={`w-5 sm:w-6 h-40 sm:h-48 ${deskConfig.legColor} shadow-2xl relative`}>
            {deskConfig.heightType === 'motorized' && (
              <>
                <div className="absolute top-1/3 left-0 right-0 h-1 bg-black/40 border-b border-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-1 bg-black/40 border-b border-white/10" />
              </>
            )}
          </div>
          {/* Leg Foot Base */}
          <div className={`w-14 sm:w-18 h-3 rounded-full ${deskConfig.feetColor} shadow-lg`} />
        </div>
      </div>
    </div>
  );
};
