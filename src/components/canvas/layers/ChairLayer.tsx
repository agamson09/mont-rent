'use client';

import React from 'react';

interface ChairLayerProps {
  chairId: string;
}

export const ChairLayer: React.FC<ChairLayerProps> = ({ chairId }) => {
  return (
    <div className="relative z-20 flex flex-col items-center select-none transition-all duration-500 scale-90 sm:scale-100">
      {/* --- CHAIR TYPE 1: ERGOPRO AERO-MESH (BALI EDITION) --- */}
      {chairId === 'chair-ergopro-mesh' && (
        <div className="relative flex flex-col items-center">
          {/* Headrest */}
          <div className="w-16 h-8 rounded-full bg-slate-800 border border-slate-700 shadow-md relative overflow-hidden flex items-center justify-center">
            <div className="w-12 h-5 rounded-full bg-slate-700/60 border border-slate-600/40" />
            <div className="absolute -bottom-2 w-4 h-3 bg-slate-900" />
          </div>

          {/* Neck spine joint */}
          <div className="w-3.5 h-3 bg-slate-900 border-x border-slate-700" />

          {/* Ergonomic Mesh Backrest with Lumbar Frame */}
          <div className="w-32 sm:w-36 h-36 rounded-t-3xl bg-slate-900/95 border-2 border-slate-700 shadow-xl relative overflow-hidden flex items-center justify-center">
            {/* Mesh Texture pattern */}
            <div
              className="absolute inset-1.5 rounded-t-2xl opacity-40 bg-[radial-gradient(#94A3B8_1px,transparent_1px)]"
              style={{ backgroundSize: '4px 4px' }}
            />
            
            {/* Dynamic Lumbar Support Band */}
            <div className="absolute bottom-5 w-24 h-6 rounded-full bg-slate-800/90 border border-emerald-500/40 shadow-inner flex items-center justify-center">
              <span className="text-[8px] tracking-widest text-emerald-400 font-mono font-bold uppercase">LUMBAR PRO</span>
            </div>

            {/* Spine skeleton ribs */}
            <div className="w-1.5 h-28 bg-slate-700 rounded-full" />
          </div>

          {/* Armrests */}
          <div className="absolute top-16 -left-5 sm:-left-6 w-7 h-16 rounded-md bg-slate-800 border border-slate-700 shadow-md transform -rotate-3">
            <div className="w-full h-3 rounded-t-md bg-slate-700" />
          </div>
          <div className="absolute top-16 -right-5 sm:-right-6 w-7 h-16 rounded-md bg-slate-800 border border-slate-700 shadow-md transform rotate-3">
            <div className="w-full h-3 rounded-t-md bg-slate-700" />
          </div>

          {/* Waterfall Mesh Seat Cushion */}
          <div className="w-36 sm:w-40 h-10 -mt-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-600/30" />
          </div>

          {/* Mechanism & Gas Lift Cylinder */}
          <div className="w-8 h-4 bg-slate-950 border-x border-slate-700" />
          <div className="w-4 h-12 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-800 shadow-md" />

          {/* 5-Star Wheel Base */}
          <div className="relative w-40 sm:w-44 h-8 -mt-1 flex items-center justify-center">
            {/* Center Hub */}
            <div className="w-8 h-4 rounded-full bg-slate-900 border border-slate-700 z-10" />
            {/* Castor Legs */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 40">
              <path d="M100,5 L30,30 M100,5 L70,35 M100,5 L100,38 M100,5 L130,35 M100,5 L170,30" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="30" cy="32" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
              <circle cx="70" cy="36" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
              <circle cx="100" cy="38" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
              <circle cx="130" cy="36" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
              <circle cx="170" cy="32" r="4.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      )}

      {/* --- CHAIR TYPE 2: EXECUTIVE NAPPA LEATHER --- */}
      {chairId === 'chair-executive-leather' && (
        <div className="relative flex flex-col items-center">
          {/* Integrated Headrest Pillow */}
          <div className="w-24 h-10 rounded-t-2xl bg-neutral-900 border-t-2 border-neutral-700 shadow-lg flex items-center justify-center">
            <div className="w-18 h-6 rounded-full bg-neutral-800 border border-neutral-700" />
          </div>

          {/* Plush Backrest with Horizontal Stitching */}
          <div className="w-34 sm:w-38 h-36 bg-gradient-to-b from-neutral-900 to-neutral-950 border-x-2 border-neutral-800 shadow-2xl flex flex-col justify-around py-3 px-4 relative">
            <div className="h-0.5 w-full bg-neutral-700/50 shadow-xs" />
            <div className="h-0.5 w-full bg-neutral-700/50 shadow-xs" />
            <div className="h-0.5 w-full bg-neutral-700/50 shadow-xs" />
          </div>

          {/* Chrome Loop Armrests */}
          <div className="absolute top-14 -left-6 sm:-left-7 w-8 h-20 rounded-xl border-4 border-slate-300 shadow-lg bg-neutral-900/60" />
          <div className="absolute top-14 -right-6 sm:-right-7 w-8 h-20 rounded-xl border-4 border-slate-300 shadow-lg bg-neutral-900/60" />

          {/* Deep Padded Seat */}
          <div className="w-38 sm:w-42 h-11 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-950 border-2 border-neutral-700 shadow-2xl" />

          {/* Chrome Cylinder */}
          <div className="w-4 h-12 bg-gradient-to-r from-slate-200 via-white to-slate-400 shadow-md" />

          {/* Polished Chrome Starbase */}
          <div className="relative w-40 sm:w-44 h-8 -mt-1 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 200 40">
              <path d="M100,5 L30,30 M100,5 L70,35 M100,5 L100,38 M100,5 L130,35 M100,5 L170,30" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
              <circle cx="30" cy="32" r="4.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="100" cy="38" r="4.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
              <circle cx="170" cy="32" r="4.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}

      {/* --- CHAIR TYPE 3: ACTIVE CORE BALANCE STOOL --- */}
      {chairId === 'chair-active-stool' && (
        <div className="relative flex flex-col items-center">
          {/* Ergonomic Saddle Cushion */}
          <div className="w-28 sm:w-32 h-14 rounded-3xl bg-gradient-to-b from-teal-600 via-teal-700 to-teal-900 border-2 border-teal-400/50 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="w-16 h-6 rounded-full bg-teal-500/30 blur-xs" />
            <div className="absolute bottom-1 w-10 h-1 bg-black/40 rounded-full" />
          </div>

          {/* Gas Lift Adjustment Ring Handle */}
          <div className="w-14 h-3 rounded-full border border-slate-600 bg-slate-900 mt-1" />

          {/* Tall Pneumatic Lift Cylinder */}
          <div className="w-5 h-28 bg-gradient-to-r from-slate-700 via-slate-400 to-slate-800 shadow-xl" />

          {/* Heavy Rounded Wobble Dome Base */}
          <div className="w-32 sm:w-36 h-9 rounded-b-full bg-gradient-to-b from-slate-800 to-slate-950 border-t-2 border-slate-600 shadow-2xl relative">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-teal-500/40 rounded-full blur-xs" />
          </div>
        </div>
      )}

      {/* --- CHAIR TYPE 4: NORDIC SCANDI SWIVEL --- */}
      {chairId === 'chair-scandi-swivel' && (
        <div className="relative flex flex-col items-center">
          {/* Curved Fabric Shell Back */}
          <div className="w-32 sm:w-36 h-32 rounded-t-[40px] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 border border-slate-400 shadow-lg relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-slate-100/50 blur-xs" />
          </div>

          {/* Fabric Seat Cushion */}
          <div className="w-34 sm:w-38 h-9 -mt-1 rounded-2xl bg-gradient-to-b from-slate-300 to-slate-400 border border-slate-400 shadow-xl" />

          {/* Swivel Pivot Base */}
          <div className="w-6 h-6 bg-slate-900 rounded-sm" />

          {/* 4 Tapered Oak Wooden Legs */}
          <svg className="w-36 sm:w-40 h-12" viewBox="0 0 160 50">
            <line x1="80" y1="5" x2="20" y2="48" stroke="#B07D4C" strokeWidth="6" strokeLinecap="round" />
            <line x1="80" y1="5" x2="60" y2="48" stroke="#9A6939" strokeWidth="6" strokeLinecap="round" />
            <line x1="80" y1="5" x2="100" y2="48" stroke="#9A6939" strokeWidth="6" strokeLinecap="round" />
            <line x1="80" y1="5" x2="140" y2="48" stroke="#B07D4C" strokeWidth="6" strokeLinecap="round" />
            {/* Black leg caps */}
            <circle cx="20" cy="48" r="3.5" fill="#1E293B" />
            <circle cx="140" cy="48" r="3.5" fill="#1E293B" />
          </svg>
        </div>
      )}
    </div>
  );
};
