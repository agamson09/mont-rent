'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { RoomBackdrop } from './layers/RoomBackdrop';
import { DeskLayer } from './layers/DeskLayer';
import { ChairLayer } from './layers/ChairLayer';
import { MonitorLayer } from './layers/MonitorLayer';
import { LightingLayer } from './layers/LightingLayer';
import { PlantLayer } from './layers/PlantLayer';
import { PeripheralsLayer } from './layers/PeripheralsLayer';
import { LifestyleLayer } from './layers/LifestyleLayer';
import { CanvasHotspot } from './CanvasHotspot';
import { Sun, Sunset, Moon, Palmtree, Sparkles, RefreshCw } from 'lucide-react';
import { PRESETS } from '@/data/presets';

export const WorkspaceCanvas: React.FC = () => {
  const {
    deskId,
    chairId,
    monitorId,
    lightingId,
    plantId,
    peripheralsId,
    lifestyleIds,
    backdrop,
    lightingMode,
    activePresetId,
    setBackdrop,
    setLightingMode,
    setActiveTab,
    resetWorkspace,
  } = useWorkspaceStore();

  const currentPreset = PRESETS.find((p) => p.id === activePresetId);

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-950">
      {/* 1. ROOM BACKGROUND (Window, Sky, Floor, Lighting Mode) */}
      <RoomBackdrop backdrop={backdrop} lightingMode={lightingMode} />

      {/* 2. LIGHTING & AMBIENT GLOW LAYER */}
      <LightingLayer lightingId={lightingId} lightingMode={lightingMode} />

      {/* 3. CENTERPIECE STAGE (DESK, MONITOR, PERIPHERALS, CHAIR) */}
      <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12 pointer-events-none">
        {/* Monitors (Positioned above and on the desk) */}
        <div className="relative z-16 -mb-10 sm:-mb-14">
          <MonitorLayer monitorId={monitorId} />
        </div>

        {/* Desk Tabletop and Legs */}
        <div className="relative z-15">
          <DeskLayer deskId={deskId} />
        </div>

        {/* Peripherals on Desk Top */}
        <PeripheralsLayer peripheralsId={peripheralsId} />

        {/* Ergonomic Chair (Positioned in front of the desk) */}
        <div className="relative z-20 -mt-24 sm:-mt-32">
          <ChairLayer chairId={chairId} />
        </div>
      </div>

      {/* 4. FLORA LAYER (Monstera, Fiddle fig, or Bonsai) */}
      <PlantLayer plantId={plantId} />

      {/* 5. BALI LIFESTYLE LAYER (Surfboard, Coffee Bar, Bean Bag, Scooter) */}
      <LifestyleLayer lifestyleIds={lifestyleIds} />

      {/* --- ON-CANVAS INTERACTIVE HOTSPOTS (From the sketch!) --- */}
      {/* Monitor Hotspot */}
      <CanvasHotspot
        label={monitorId ? 'Displays' : '+ Add Monitor!'}
        isActive={Boolean(monitorId)}
        onClick={() => setActiveTab('monitors')}
        positionClasses="top-[24%] sm:top-[22%] left-1/2 -translate-x-1/2"
      />

      {/* Desk Hotspot */}
      <CanvasHotspot
        label="Desk"
        isActive={Boolean(deskId)}
        onClick={() => setActiveTab('desks')}
        positionClasses="top-[45%] left-[20%] sm:left-[24%]"
      />

      {/* Chair Hotspot */}
      <CanvasHotspot
        label="Chair"
        isActive={Boolean(chairId)}
        onClick={() => setActiveTab('chairs')}
        positionClasses="bottom-[18%] sm:bottom-[16%] left-1/2 -translate-x-1/2"
      />

      {/* Lighting Hotspot */}
      <CanvasHotspot
        label={lightingId ? 'Lighting' : '+ Add Lamp!'}
        isActive={Boolean(lightingId)}
        onClick={() => setActiveTab('lighting')}
        positionClasses="top-[32%] right-[22%] sm:right-[26%]"
      />

      {/* Plant Hotspot */}
      <CanvasHotspot
        label={plantId ? 'Flora' : '+ Place a Plant!'}
        isActive={Boolean(plantId)}
        onClick={() => setActiveTab('plants')}
        positionClasses="bottom-[24%] left-[6%] sm:left-[10%]"
      />

      {/* Coffee / Lifestyle Hotspot */}
      <CanvasHotspot
        label={lifestyleIds.includes('lifestyle-coffee-station') ? 'Coffee' : '+ Add Coffee!'}
        isActive={lifestyleIds.includes('lifestyle-coffee-station')}
        onClick={() => setActiveTab('lifestyle')}
        positionClasses="top-[38%] right-[8%] sm:right-[12%]"
      />

      {/* --- TOP CANVAS CONTROLS TOOLBAR --- */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Active Preset Indicator or Monis Badge */}
        <div className="flex items-center gap-2">
          {currentPreset ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/50 text-xs font-medium text-emerald-300 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preset: <strong>{currentPreset.name}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-300 shadow-lg">
              <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bali Villa Studio</span>
            </div>
          )}
        </div>

        {/* Right: Environment Toggles (Backdrop & Lighting Mode) */}
        <div className="flex items-center gap-2">
          {/* Backdrop switcher */}
          <div className="flex items-center bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/60 p-1 shadow-lg text-xs">
            <button
              onClick={() => setBackdrop('villa-pool')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                backdrop === 'villa-pool'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Villa Pool
            </button>
            <button
              onClick={() => setBackdrop('rice-terrace')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                backdrop === 'rice-terrace'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rice Terrace
            </button>
            <button
              onClick={() => setBackdrop('minimal-studio')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                backdrop === 'minimal-studio'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Loft
            </button>
          </div>

          {/* Time of Day Lighting */}
          <div className="flex items-center bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/60 p-1 shadow-lg">
            <button
              onClick={() => setLightingMode('day')}
              title="Day Mode"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'day' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('sunset')}
              title="Sunset Golden Hour"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'sunset' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('night')}
              title="Night Focus Mode"
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                lightingMode === 'night' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetWorkspace}
            title="Reset to default"
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 transition-all cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
