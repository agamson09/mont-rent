'use client';

import React from 'react';

interface LifestyleLayerProps {
  lifestyleIds: string[];
}

export const LifestyleLayer: React.FC<LifestyleLayerProps> = ({ lifestyleIds }) => {
  const hasSurfboard = lifestyleIds.includes('lifestyle-surfboard');
  const hasCoffee = lifestyleIds.includes('lifestyle-coffee-station');
  const hasBeanbag = lifestyleIds.includes('lifestyle-beanbag');
  const hasScooter = lifestyleIds.includes('lifestyle-scooter-gear');

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-22">
      {/* --- SURFBOARD (FAR RIGHT, PROPPED AGAINST VILLA WALL) --- */}
      {hasSurfboard && (
        <div className="absolute right-[1%] sm:right-[3%] bottom-[8%] sm:bottom-[10%] flex flex-col items-center transform rotate-6 origin-bottom transition-all duration-500 animate-in fade-in zoom-in-95">
          {/* 6'2" Retro Fish Surfboard */}
          <div className="relative w-16 sm:w-20 h-64 sm:h-80">
            {/* Board Outline SVG */}
            <svg className="w-full h-full filter drop-shadow-2xl" viewBox="0 0 100 360">
              {/* Board Body with Wood/Teal Tint */}
              <defs>
                <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
                <linearGradient id="stringerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
              </defs>

              {/* Fish Surfboard Silhouette */}
              <path
                d="M50,5 C75,50 95,150 90,260 C85,310 65,345 50,340 C35,345 15,310 10,260 C5,150 25,50 50,5 Z"
                fill="url(#boardGrad)"
                stroke="#0369A1"
                strokeWidth="2"
              />

              {/* Wood Stringer Spine */}
              <line x1="50" y1="8" x2="50" y2="338" stroke="url(#stringerGrad)" strokeWidth="3" />

              {/* Bamboo Deck Inlay graphic */}
              <ellipse cx="50" cy="180" rx="20" ry="45" fill="#FEF3C7" opacity="0.3" />

              {/* Monis / Canggu Stamp */}
              <text x="50" y="210" textAnchor="middle" fill="#0C4A6E" fontSize="9" fontWeight="bold" fontFamily="monospace">
                ECHO 6&apos;2&quot;
              </text>
              <text x="50" y="222" textAnchor="middle" fill="#0C4A6E" fontSize="7" fontFamily="sans-serif">
                BALI FISH
              </text>

              {/* Wax traction pad at bottom */}
              <path d="M30,270 L70,270 L65,315 L35,315 Z" fill="#0F172A" opacity="0.8" />
            </svg>

            {/* Leash string hanging */}
            <div className="absolute -bottom-2 right-4 w-12 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-full opacity-70" />
          </div>
        </div>
      )}

      {/* --- COFFEE STATION (DE'LONGHI ESPRESSO MACHINE ON DESK RIGHT) --- */}
      {hasCoffee && (
        <div className="absolute right-[16%] sm:right-[20%] top-[39%] sm:top-[38%] z-21 flex flex-col items-center transition-all duration-500 animate-in fade-in">
          {/* Espresso Machine */}
          <div className="relative flex flex-col items-center">
            {/* Cup warming tray */}
            <div className="w-10 h-1.5 rounded-t-xs bg-slate-400 border border-slate-300" />
            
            {/* Machine Main Body (Classic Italian Red or Matte Slate) */}
            <div className="w-12 h-14 rounded-md bg-gradient-to-r from-red-700 via-rose-600 to-red-800 border border-red-500 shadow-xl relative flex flex-col items-center pt-1">
              {/* Pressure gauge dial */}
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-amber-300 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-amber-400" />
              </div>

              {/* Portafilter handle sticking out */}
              <div className="absolute top-5 -left-4 w-5 h-2 rounded-l-full bg-slate-900 border border-slate-700 shadow-xs" />

              {/* Metal drip tray */}
              <div className="absolute bottom-0 w-full h-3 rounded-b-md bg-slate-300 border-t border-slate-400 flex items-center justify-around px-1">
                <div className="w-1 h-1 bg-slate-600 rounded-full" />
                <div className="w-1 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* Ceramic Espresso Cup */}
              <div className="absolute bottom-2.5 w-4 h-3.5 rounded-b-sm bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                {/* Coffee crema inside cup */}
                <div className="w-2.5 h-1 rounded-full bg-amber-900" />
              </div>

              {/* Steam vapor wisps */}
              <div className="absolute -top-3 w-1.5 h-3 bg-white/40 rounded-full filter blur-xs animate-pulse" />
            </div>

            {/* Bag of Bali Kintamani beans beside machine */}
            <div className="absolute -right-5 bottom-0 w-5 h-8 rounded-t-sm bg-amber-900 border border-amber-700 shadow-xs flex flex-col items-center justify-center">
              <span className="text-[5px] text-amber-200 font-bold rotate-90 whitespace-nowrap">KINTAMANI</span>
            </div>
          </div>
        </div>
      )}

      {/* --- OVERSIZED LINEN BEAN BAG (BOTTOM LEFT FLOOR) --- */}
      {hasBeanbag && (
        <div className="absolute left-[3%] sm:left-[8%] bottom-[5%] sm:bottom-[7%] z-23 transition-all duration-500 animate-in fade-in">
          {/* Sun-bleached linen bean bag */}
          <div className="relative flex flex-col items-center">
            {/* Bean bag body */}
            <div className="w-28 sm:w-36 h-20 sm:h-26 rounded-[50px] bg-gradient-to-b from-[#E7E2D8] via-[#D5CEC2] to-[#B8AE9F] border-2 border-[#A89E8F] shadow-2xl relative overflow-hidden flex items-center justify-center">
              {/* Crease folds */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 80">
                <path d="M20,20 Q50,45 80,25 M30,45 Q55,60 75,50" stroke="#78716C" strokeWidth="2" fill="none" />
              </svg>

              {/* Center depression / seat groove */}
              <div className="w-16 h-10 rounded-full bg-black/10 blur-xs" />

              {/* Monis fabric tag */}
              <div className="absolute top-2 right-4 px-1.5 py-0.5 rounded-xs bg-slate-900 text-[6px] font-mono text-white">
                monis
              </div>
            </div>

            {/* Ground contact shadow */}
            <div className="w-24 sm:w-32 h-4 -mt-2 bg-black/40 rounded-full blur-md" />
          </div>
        </div>
      )}

      {/* --- SCOOTER GEAR & HELMET (BOTTOM RIGHT OR ATTACHED HOOK) --- */}
      {hasScooter && (
        <div className="absolute right-[12%] sm:right-[15%] bottom-[8%] sm:bottom-[10%] z-23 transition-all duration-500 animate-in fade-in">
          <div className="relative flex flex-col items-center">
            {/* Vintage Matte Black Nomad Helmet */}
            <div className="w-14 sm:w-16 h-12 sm:h-14 rounded-t-full bg-neutral-900 border-2 border-neutral-700 shadow-2xl relative flex flex-col items-center justify-end overflow-hidden">
              {/* Visor bubble / chrome trim */}
              <div className="w-12 h-6 rounded-t-md bg-gradient-to-b from-amber-400/40 to-transparent border-t-2 border-amber-300/50 shadow-inner" />
              {/* Chin strap buckle */}
              <div className="w-8 h-2 bg-neutral-800 border-t border-neutral-700 flex justify-center">
                <div className="w-2 h-1 bg-amber-500 rounded-xs" />
              </div>
            </div>

            {/* Scooter Keys Keychain (NMAX / Vespa) */}
            <div className="absolute -bottom-2 -left-2 flex items-center gap-0.5">
              <div className="w-3 h-3 rounded-full border-2 border-amber-400" />
              <div className="w-4 h-1.5 rounded-xs bg-slate-300" />
              <span className="text-[7px] font-bold text-amber-500">🛵 NMAX</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
