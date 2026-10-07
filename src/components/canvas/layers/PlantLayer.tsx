'use client';

import React from 'react';

interface PlantLayerProps {
  plantId: string | null;
}

export const PlantLayer: React.FC<PlantLayerProps> = ({ plantId }) => {
  if (!plantId) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* --- OPTION 1: MONSTERA DELICIOSA (BALI CERAMIC POT) --- */}
      {plantId === 'plant-monstera' && (
        <div className="absolute left-[3%] sm:left-[6%] bottom-[12%] sm:bottom-[15%] z-24 flex flex-col items-center">
          {/* Lush Monstera Leaves SVG */}
          <div className="relative w-28 sm:w-36 h-36 sm:h-44">
            <svg className="w-full h-full" viewBox="0 0 140 180">
              {/* Stems */}
              <path d="M70,160 Q55,100 35,60 M70,160 Q80,95 105,50 M70,160 Q70,90 70,30" stroke="#065F46" strokeWidth="4" strokeLinecap="round" fill="none" />
              
              {/* Leaf 1 (Left Split Leaf) */}
              <g transform="translate(10, 20) rotate(-18)">
                <path
                  d="M40,70 C10,50 5,20 30,5 C55,20 50,50 40,70"
                  fill="#059669"
                  stroke="#047857"
                  strokeWidth="1.5"
                />
                {/* Leaf cutouts / fenestrations */}
                <ellipse cx="25" cy="25" rx="3" ry="8" transform="rotate(-30 25 25)" fill="#F3EEEA" opacity="0.6" />
                <ellipse cx="38" cy="30" rx="3" ry="8" transform="rotate(30 38 30)" fill="#F3EEEA" opacity="0.6" />
              </g>

              {/* Leaf 2 (Center Top Leaf) */}
              <g transform="translate(45, 5)">
                <path
                  d="M25,65 C0,40 5,10 25,0 C45,10 50,40 25,65"
                  fill="#10B981"
                  stroke="#059669"
                  strokeWidth="1.5"
                />
                <ellipse cx="16" cy="25" rx="3" ry="7" transform="rotate(-25 16 25)" fill="#F3EEEA" opacity="0.6" />
                <ellipse cx="34" cy="25" rx="3" ry="7" transform="rotate(25 34 25)" fill="#F3EEEA" opacity="0.6" />
              </g>

              {/* Leaf 3 (Right Leaf) */}
              <g transform="translate(70, 25) rotate(22)">
                <path
                  d="M25,65 C0,45 5,15 25,5 C45,15 50,45 25,65"
                  fill="#047857"
                  stroke="#064E3B"
                  strokeWidth="1.5"
                />
                <ellipse cx="17" cy="28" rx="2.5" ry="7" transform="rotate(-25 17 28)" fill="#F3EEEA" opacity="0.6" />
                <ellipse cx="33" cy="28" rx="2.5" ry="7" transform="rotate(25 33 28)" fill="#F3EEEA" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Artisan Terracotta Pot & Saucer */}
          <div className="relative flex flex-col items-center -mt-4">
            {/* Pot Rim */}
            <div className="w-18 sm:w-22 h-4 rounded-full bg-[#C25E35] border border-amber-800 shadow-md" />
            {/* Pot Body */}
            <div
              className="w-16 sm:w-20 h-16 rounded-b-xl bg-gradient-to-b from-[#B8542B] to-[#963F1B] border-x border-b border-amber-900 shadow-2xl relative"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 82% 100%, 18% 100%)' }}
            />
            {/* Saucer */}
            <div className="w-18 sm:w-22 h-2.5 rounded-full bg-[#853414] shadow-lg -mt-1" />
          </div>
        </div>
      )}

      {/* --- OPTION 2: FIDDLE LEAF FIG TREE (WOVEN BASKET) --- */}
      {plantId === 'plant-fiddle-fig' && (
        <div className="absolute right-[4%] sm:right-[7%] bottom-[14%] sm:bottom-[16%] z-24 flex flex-col items-center">
          {/* Tree Canopy */}
          <div className="relative w-28 sm:w-36 h-48 sm:h-56">
            <svg className="w-full h-full" viewBox="0 0 140 220">
              {/* Woody Trunk */}
              <path d="M70,200 Q68,140 70,80 Q72,40 70,10" stroke="#78350F" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M70,120 Q85,100 100,90" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M70,140 Q50,115 35,110" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Distinctive Fiddle-Shaped Broad Leaves */}
              {/* Leaf Bottom Left */}
              <path d="M40,120 C20,110 15,90 28,75 C20,65 30,55 50,65 C60,85 55,105 40,120 Z" fill="#047857" stroke="#064E3B" strokeWidth="1.5" />
              {/* Leaf Bottom Right */}
              <path d="M100,105 C120,95 125,75 112,60 C120,50 110,40 90,50 C80,70 85,90 100,105 Z" fill="#059669" stroke="#064E3B" strokeWidth="1.5" />
              {/* Leaf Top Canopy */}
              <path d="M70,60 C45,45 40,20 60,5 C75,0 90,15 85,35 C95,45 85,55 70,60 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Woven Seagrass Basket */}
          <div className="relative flex flex-col items-center -mt-6">
            <div className="w-18 sm:w-22 h-4 rounded-full bg-[#CA8A04] border border-amber-700 shadow-md" />
            <div
              className="w-16 sm:w-20 h-16 rounded-b-lg bg-gradient-to-b from-[#B45309] to-[#92400E] border-x border-b border-amber-950 shadow-2xl relative flex items-center justify-center overflow-hidden"
              style={{ clipPath: 'polygon(3% 0%, 97% 0%, 85% 100%, 15% 100%)' }}
            >
              {/* Woven Crosshatch texture */}
              <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_6px)]" />
            </div>
            {/* Basket Handles */}
            <div className="absolute -top-1 w-20 flex justify-between px-1">
              <div className="w-3 h-3 rounded-full border-2 border-amber-900" />
              <div className="w-3 h-3 rounded-full border-2 border-amber-900" />
            </div>
          </div>
        </div>
      )}

      {/* --- OPTION 3: DESKTOP SUCCULENT TRIO --- */}
      {plantId === 'plant-desktop-bonsai' && (
        <div className="absolute right-[22%] sm:right-[26%] top-[45%] sm:top-[44%] z-21">
          {/* Concrete Desktop Planter */}
          <div className="relative flex flex-col items-center">
            {/* Succulent Leaves */}
            <div className="flex items-end gap-1 -mb-1">
              {/* Succulent 1 */}
              <div className="w-4 h-5 rounded-t-full bg-emerald-600 border border-emerald-500 shadow-xs" />
              {/* Succulent 2 (Rosette) */}
              <div className="w-6 h-6 rounded-full bg-teal-500 border border-teal-400 shadow-xs flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-teal-600" />
              </div>
              {/* Succulent 3 */}
              <div className="w-4 h-4 rounded-t-full bg-emerald-500 border border-emerald-400 shadow-xs" />
            </div>

            {/* Cast Architectural Concrete Planter */}
            <div className="w-14 h-3.5 rounded-sm bg-gradient-to-b from-slate-400 to-slate-500 border border-slate-300 shadow-md flex items-center justify-center">
              <span className="text-[6px] font-mono text-slate-800 tracking-tighter">CONCRETE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
