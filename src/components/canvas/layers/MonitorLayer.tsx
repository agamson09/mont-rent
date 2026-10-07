'use client';

import React from 'react';

interface MonitorLayerProps {
  monitorId: string;
}

export const MonitorLayer: React.FC<MonitorLayerProps> = ({ monitorId }) => {
  return (
    <div className="relative z-15 flex flex-col items-center select-none transition-all duration-500">
      {/* --- OPTION 1: SINGLE 27" 4K DISPLAY --- */}
      {monitorId === 'monitor-single-27' && (
        <div className="relative flex flex-col items-center">
          {/* Display Bezel & Screen */}
          <div className="w-56 sm:w-68 h-36 sm:h-44 rounded-lg bg-slate-900 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Screen Content: Sleek VS Code Editor */}
            <div className="h-4 bg-slate-950 px-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[8px] font-mono text-slate-400">workspace.tsx — DreamDesk</span>
              <div className="w-4" />
            </div>

            {/* Code Lines with Syntax Coloring */}
            <div className="flex-1 bg-[#0D1117] p-2 font-mono text-[8px] sm:text-[9px] leading-relaxed text-slate-300 overflow-hidden shadow-inner">
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">1</span>
                <span><span className="text-purple-400">export const</span> <span className="text-blue-400">BaliNomadWorkspace</span> = () =&gt; &#123;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">2</span>
                <span className="pl-2"><span className="text-purple-400">const</span> status = <span className="text-emerald-400">&quot;Vibes in Canggu 🌴&quot;</span>;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">3</span>
                <span className="pl-2"><span className="text-cyan-400">rentEquipment</span>(&#123; speed: <span className="text-amber-400">&apos;1Gbps&apos;</span> &#125;);</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">4</span>
                <span className="pl-2"><span className="text-purple-400">return</span> &lt;<span className="text-rose-400">DreamDeskStudio</span> /&gt;;</span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-600 select-none">5</span>
                <span>&#125;;</span>
              </div>
              {/* Terminal line */}
              <div className="mt-2 pt-1 border-t border-slate-800 flex items-center gap-1 text-[7px] text-emerald-400">
                <span>➜ dreamdesk git:(main)</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>

            {/* Monitor Chin */}
            <div className="h-2.5 bg-slate-800 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-slate-600 rounded-full" />
            </div>
          </div>

          {/* Stand Neck */}
          <div className="w-5 h-10 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 shadow-md" />
          {/* Stand Base */}
          <div className="w-24 h-2.5 rounded-sm bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 shadow-lg border-b border-slate-600" />
        </div>
      )}

      {/* --- OPTION 2: DUAL 27" 4K DISPLAYS --- */}
      {monitorId === 'monitor-dual-27' && (
        <div className="relative flex flex-col items-center">
          {/* Dual Screens Container */}
          <div className="flex items-center gap-2">
            {/* Left Screen: IDE */}
            <div className="w-44 sm:w-56 h-32 sm:h-40 rounded-lg bg-slate-900 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col transform -rotate-1 origin-bottom-right">
              <div className="h-3.5 bg-slate-950 px-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[7px] font-mono text-slate-400">backend/api.ts</span>
              </div>
              <div className="flex-1 bg-[#0D1117] p-2 font-mono text-[7px] leading-relaxed text-slate-300 overflow-hidden">
                <p className="text-cyan-400">const server = fastify();</p>
                <p className="text-purple-400">server.get(&apos;/status&apos;, ...)</p>
                <p className="text-emerald-400">✓ Database connected</p>
                <p className="text-amber-400">⚡ Port 3000 listening</p>
              </div>
            </div>

            {/* Right Screen: Live UI Preview */}
            <div className="w-44 sm:w-56 h-32 sm:h-40 rounded-lg bg-slate-900 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col transform rotate-1 origin-bottom-left">
              <div className="h-3.5 bg-slate-950 px-2 flex items-center justify-between border-b border-slate-800">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
                <span className="text-[7px] font-mono text-emerald-400">localhost:3000</span>
              </div>
              {/* Simulated UI layout */}
              <div className="flex-1 bg-slate-950 p-2 flex flex-col gap-1.5">
                <div className="w-full h-8 rounded bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center px-2">
                  <div className="w-8 h-2 bg-white/70 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-1 flex-1">
                  <div className="rounded bg-slate-800 p-1">
                    <div className="w-6 h-1.5 bg-slate-600 rounded-full mb-1" />
                    <div className="w-10 h-1 bg-emerald-400 rounded-full" />
                  </div>
                  <div className="rounded bg-slate-800 p-1">
                    <div className="w-6 h-1.5 bg-slate-600 rounded-full mb-1" />
                    <div className="w-10 h-1 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dual Gas-Spring Clamp Arm */}
          <div className="relative w-44 h-9 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 160 35">
              <path d="M80,30 L40,5 M80,30 L120,5" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
              <circle cx="80" cy="30" r="6" fill="#0F172A" />
            </svg>
          </div>
          <div className="w-8 h-3 rounded-xs bg-slate-900 shadow-md" />
        </div>
      )}

      {/* --- OPTION 3: 34" CURVED ULTRAWIDE --- */}
      {monitorId === 'monitor-ultrawide-34' && (
        <div className="relative flex flex-col items-center">
          {/* Curved Ultrawide Display */}
          <div
            className="w-72 sm:w-88 h-34 sm:h-42 rounded-xl bg-slate-900 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col"
            style={{
              clipPath: 'polygon(1% 0%, 99% 0%, 97% 100%, 3% 100%)',
            }}
          >
            {/* Top Bar */}
            <div className="h-4 bg-slate-950 px-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[8px] font-mono text-cyan-400">34&quot; 21:9 WQHD — PANORAMIC WORKSPACE</span>
              <div className="w-4" />
            </div>

            {/* Split Screen Content (3 Panels in 21:9) */}
            <div className="flex-1 grid grid-cols-3 gap-1 bg-[#0A0D14] p-1.5 font-mono text-[7px]">
              {/* Left Column: Code */}
              <div className="rounded bg-[#121620] p-1.5 text-slate-300">
                <p className="text-purple-400 font-bold mb-1">// API Route</p>
                <p className="text-slate-400">const req = await fetch(&apos;/bali&apos;);</p>
                <p className="text-emerald-400">const res = await req.json();</p>
              </div>
              {/* Middle Column: Design Canvas */}
              <div className="rounded bg-[#161B26] p-1.5 flex flex-col items-center justify-center">
                <div className="w-16 h-10 rounded border border-emerald-500/50 bg-emerald-950/30 flex items-center justify-center">
                  <span className="text-[7px] text-emerald-400">Figma Studio</span>
                </div>
              </div>
              {/* Right Column: Slack / Terminal */}
              <div className="rounded bg-[#121620] p-1.5 text-slate-300">
                <p className="text-amber-400 font-bold mb-1">#canggu-nomads</p>
                <p className="text-slate-400">&gt; &quot;Surf break at 4pm?&quot;</p>
                <p className="text-cyan-400">&gt; &quot;Ready! Just rented desk&quot;</p>
              </div>
            </div>
          </div>

          {/* Stand Neck */}
          <div className="w-6 h-9 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 shadow-md" />
          {/* V-Shape Stand Base */}
          <div className="w-36 h-3 rounded-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 shadow-xl" />
        </div>
      )}

      {/* --- OPTION 4: 49" SUPER-ULTRAWIDE (32:9) --- */}
      {monitorId === 'monitor-superwide-49' && (
        <div className="relative flex flex-col items-center">
          {/* 32:9 Panoramic Curved Shell */}
          <div
            className="w-80 sm:w-104 h-32 sm:h-38 rounded-xl bg-slate-900 border-4 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col"
            style={{
              clipPath: 'polygon(1.5% 0%, 98.5% 0%, 96% 100%, 4% 100%)',
            }}
          >
            <div className="h-3.5 bg-slate-950 px-3 flex items-center justify-between border-b border-slate-800">
              <span className="text-[7px] font-mono text-emerald-400">49&quot; DUAL-QHD COCKPIT COMMAND (32:9)</span>
              <span className="text-[7px] font-mono text-slate-400">5120 × 1440</span>
            </div>
            {/* 4 Split Panes */}
            <div className="flex-1 grid grid-cols-4 gap-1 bg-[#07090E] p-1.5 font-mono text-[6.5px]">
              <div className="rounded bg-slate-900/90 p-1 text-slate-300 border border-slate-800">
                <p className="text-cyan-400 font-bold">TERMINAL 1</p>
                <p className="text-emerald-400">docker compose up</p>
              </div>
              <div className="rounded bg-slate-900/90 p-1 text-slate-300 border border-slate-800">
                <p className="text-purple-400 font-bold">NEXT.JS</p>
                <p>Turbopack ready in 120ms</p>
              </div>
              <div className="rounded bg-slate-900/90 p-1 text-slate-300 border border-slate-800">
                <p className="text-amber-400 font-bold">METRICS</p>
                <p className="text-emerald-400">CPU: 12% | RAM: 18GB</p>
              </div>
              <div className="rounded bg-slate-900/90 p-1 text-slate-300 border border-slate-800">
                <p className="text-rose-400 font-bold">MONIS.RENT</p>
                <p className="text-white">Active Bali Session</p>
              </div>
            </div>
          </div>

          {/* Heavy Duty Stand */}
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 shadow-md" />
          <div className="w-48 h-3 rounded-full bg-slate-800 shadow-2xl border-t border-slate-600" />
        </div>
      )}
    </div>
  );
};
