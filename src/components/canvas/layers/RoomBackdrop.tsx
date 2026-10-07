'use client';

import React from 'react';

interface RoomBackdropProps {
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio';
  lightingMode: 'day' | 'sunset' | 'night';
}

export const RoomBackdrop: React.FC<RoomBackdropProps> = ({ backdrop, lightingMode }) => {
  // Atmosphere lighting gradients
  const skyColors = {
    day: 'from-sky-300 via-sky-100 to-amber-50',
    sunset: 'from-amber-600 via-rose-500 to-indigo-900',
    night: 'from-slate-950 via-indigo-950 to-slate-900',
  };

  const wallColors = {
    day: 'bg-gradient-to-b from-[#F3EEEA] to-[#EBE5DF]',
    sunset: 'bg-gradient-to-b from-[#F1D6C5] via-[#E4BEAA] to-[#C99C87]',
    night: 'bg-gradient-to-b from-[#1E293B] to-[#0F172A]',
  };

  const floorColors = {
    day: 'bg-gradient-to-t from-[#B07D4C] via-[#C89464] to-[#D5A577]',
    sunset: 'bg-gradient-to-t from-[#824E27] via-[#9C6337] to-[#B3784A]',
    night: 'bg-gradient-to-t from-[#2C1D13] via-[#3D291C] to-[#4F3626]',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden select-none transition-colors duration-700 ${wallColors[lightingMode]}`}>
      {/* Background Architectural Window / View */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[88%] max-w-4xl h-[62%] rounded-t-[140px] border-8 border-white/40 shadow-2xl overflow-hidden backdrop-blur-xs">
        {/* Sky */}
        <div className={`absolute inset-0 bg-gradient-to-b ${skyColors[lightingMode]} transition-colors duration-700`} />

        {/* Backdrop Content: Villa Pool */}
        {backdrop === 'villa-pool' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Distant palm trees & Bali sky */}
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
              {/* Sun / Moon */}
              {lightingMode === 'day' && (
                <circle cx="200" cy="90" r="40" fill="#FEF08A" opacity="0.85" className="blur-xs" />
              )}
              {lightingMode === 'sunset' && (
                <circle cx="500" cy="180" r="55" fill="#FB923C" opacity="0.9" className="blur-xs" />
              )}
              {lightingMode === 'night' && (
                <g>
                  <circle cx="800" cy="80" r="30" fill="#F8FAFC" opacity="0.9" />
                  <circle cx="790" cy="75" r="28" fill="#1E1B4B" />
                  {/* Stars */}
                  <circle cx="150" cy="40" r="1.5" fill="#FFF" opacity="0.8" />
                  <circle cx="320" cy="65" r="2" fill="#FFF" opacity="0.9" />
                  <circle cx="600" cy="30" r="1.5" fill="#FFF" opacity="0.7" />
                  <circle cx="450" cy="90" r="1.5" fill="#FFF" opacity="0.8" />
                </g>
              )}

              {/* Tropical Villa Horizon & Frangipani Foliage */}
              <path
                d="M0,260 Q250,230 500,250 T1000,240 L1000,400 L0,400 Z"
                fill={lightingMode === 'night' ? '#064E3B' : '#059669'}
                opacity={lightingMode === 'night' ? 0.6 : 0.7}
              />
              {/* Palm Silhouettes */}
              <g fill={lightingMode === 'night' ? '#022C22' : '#047857'}>
                {/* Left Palm */}
                <path d="M70,300 Q90,190 120,110 C80,95 40,110 30,140 M120,110 C140,80 180,90 200,120 M120,110 C110,60 140,40 160,50 M120,110 C70,60 50,70 40,90" stroke={lightingMode === 'night' ? '#022C22' : '#047857'} strokeWidth="5" fill="none" />
                {/* Right Palm */}
                <path d="M920,320 Q890,200 860,120 C900,100 940,115 955,145 M860,120 C830,90 790,105 780,135 M860,120 C865,70 835,50 815,65 M860,120 C905,75 925,85 935,105" stroke={lightingMode === 'night' ? '#022C22' : '#047857'} strokeWidth="5" fill="none" />
              </g>

              {/* Pool Edge & Water */}
              <path
                d="M0,290 L1000,290 L1000,400 L0,400 Z"
                fill={lightingMode === 'night' ? '#0C4A6E' : '#0284C7'}
                opacity="0.9"
              />
              {/* Pool Water Ripples */}
              <path
                d="M100,310 Q250,305 400,312 T700,308 T1000,314 M50,340 Q300,335 550,342 T950,338 M150,370 Q450,365 750,372"
                stroke={lightingMode === 'night' ? '#38BDF8' : '#BAE6FD'}
                strokeWidth="2.5"
                fill="none"
                opacity="0.5"
              />
            </svg>

            {/* Villa Poolside Wood Deck Rim */}
            <div className="absolute bottom-0 w-full h-8 bg-amber-900/40 backdrop-blur-xs border-t border-amber-500/30" />
          </div>
        )}

        {/* Backdrop Content: Ubud Rice Terrace */}
        {backdrop === 'rice-terrace' && (
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
              {lightingMode === 'day' && (
                <circle cx="350" cy="100" r="45" fill="#FEF08A" opacity="0.8" className="blur-xs" />
              )}
              {lightingMode === 'sunset' && (
                <circle cx="500" cy="160" r="50" fill="#F97316" opacity="0.85" className="blur-xs" />
              )}
              {/* Rice Terrace Layers */}
              <path d="M0,180 Q300,160 600,190 T1000,175 L1000,400 L0,400 Z" fill={lightingMode === 'night' ? '#064E3B' : '#10B981'} opacity="0.4" />
              <path d="M0,220 Q400,200 800,230 T1000,215 L1000,400 L0,400 Z" fill={lightingMode === 'night' ? '#047857' : '#059669'} opacity="0.6" />
              <path d="M0,265 Q250,245 650,270 T1000,255 L1000,400 L0,400 Z" fill={lightingMode === 'night' ? '#065F46' : '#047857'} opacity="0.8" />
              <path d="M0,310 Q450,290 850,320 T1000,300 L1000,400 L0,400 Z" fill={lightingMode === 'night' ? '#022C22' : '#064E3B'} />
              
              {/* Coconut Palms */}
              <g stroke={lightingMode === 'night' ? '#022C22' : '#064E3B'} strokeWidth="4" fill="none">
                <path d="M220,320 Q200,200 180,120 M180,120 C140,110 120,130 110,150 M180,120 C220,105 240,125 250,145" />
                <path d="M780,330 Q800,210 820,130 M820,130 C780,120 760,140 750,160 M820,130 C860,115 880,135 890,155" />
              </g>
            </svg>
          </div>
        )}

        {/* Backdrop Content: Minimalist Studio */}
        {backdrop === 'minimal-studio' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`w-full h-full bg-gradient-to-b ${lightingMode === 'night' ? 'from-slate-900 to-slate-950' : 'from-slate-100 to-slate-200'} opacity-80`} />
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 p-6 opacity-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-slate-400 rounded-sm" />
              ))}
            </div>
          </div>
        )}

        {/* Window Framing & Panes */}
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-950/20">
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-amber-950/25" />
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-amber-950/25" />
        </div>
      </div>

      {/* Villa Hardwood Floor Plank System */}
      <div className={`absolute bottom-0 left-0 right-0 h-[40%] ${floorColors[lightingMode]} transition-colors duration-700 shadow-inner`}>
        {/* Floor plank perspective lines */}
        <svg className="w-full h-full opacity-25" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <line x1="100" y1="300" x2="350" y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="280" y1="300" x2="420" y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="460" y1="300" x2="480" y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="640" y1="300" x2="540" y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="820" y1="300" x2="600" y2="0" stroke="#000" strokeWidth="1.5" />
          <line x1="980" y1="300" x2="680" y2="0" stroke="#000" strokeWidth="1.5" />
        </svg>

        {/* Ambient base shadow under desk setup */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] max-w-2xl h-24 bg-black/35 rounded-full blur-xl" />
      </div>

      {/* Ambient Night / Sunset Overlay */}
      {lightingMode === 'night' && (
        <div className="absolute inset-0 bg-blue-950/45 mix-blend-multiply pointer-events-none transition-opacity duration-700" />
      )}
      {lightingMode === 'sunset' && (
        <div className="absolute inset-0 bg-amber-600/20 mix-blend-color-burn pointer-events-none transition-opacity duration-700" />
      )}
    </div>
  );
};
