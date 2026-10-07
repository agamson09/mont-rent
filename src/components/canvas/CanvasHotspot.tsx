'use client';

import React from 'react';
import { Plus, Check } from 'lucide-react';

interface CanvasHotspotProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  positionClasses: string;
}

export const CanvasHotspot: React.FC<CanvasHotspotProps> = ({
  label,
  isActive = false,
  onClick,
  positionClasses,
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`group absolute z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-lg cursor-pointer backdrop-blur-md ${positionClasses} ${
        isActive
          ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white border border-emerald-400/50 shadow-emerald-500/20'
          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-emerald-500/50 hover:text-white'
      }`}
      aria-label={label}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isActive ? 'bg-emerald-300' : 'bg-emerald-400'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isActive ? 'bg-emerald-200' : 'bg-emerald-400'
          }`}
        />
      </span>
      <span className="whitespace-nowrap flex items-center gap-1 font-semibold">
        {isActive ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-emerald-400" />}
        {label}
      </span>
    </button>
  );
};
