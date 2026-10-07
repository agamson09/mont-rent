'use client';

import React from 'react';
import { PRESETS } from '@/data/presets';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Sparkles, Terminal, Palette, Briefcase } from 'lucide-react';

export const PresetSelector: React.FC = () => {
  const { activePresetId, applyPreset } = useWorkspaceStore();

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'preset-10x-dev':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'preset-minimal-creator':
        return <Palette className="w-4 h-4 text-cyan-400" />;
      case 'preset-island-founder':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            Nomad Presets
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          1-Click Bali curated setups
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`group text-left p-3.5 rounded-2xl border transition-all duration-300 relative cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                    {getPresetIcon(preset.id)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {preset.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {preset.role}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-xs">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
