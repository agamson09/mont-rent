'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { 
  Palmtree, 
  Share2, 
  HelpCircle, 
  Check, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { setCheckoutOpen } = useWorkspaceStore();
  const [copied, setCopied] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="https://monis.rent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Palmtree className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  monis<span className="text-emerald-400">.rent</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  BALI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                DreamDesk Studio
              </p>
            </div>
          </a>
        </div>

        {/* Center: Monis Value Banner (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Next-Day Villa Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>White-Glove Ergonomic Assembly</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Setup Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs"
            title="Copy share link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Share Setup</span>
              </>
            )}
          </button>

          {/* How It Works Modal / Help button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="How Monis works"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick WhatsApp Concierge Button */}
          <a
            href="https://wa.me/6281234567890?text=Hi%20Monis.rent!%20I'm%20customizing%20my%20workspace%20in%20Bali%20and%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Concierge</span>
          </a>
        </div>
      </div>

      {/* How it Works modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">How Monis.rent Works</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-bold text-emerald-300 mb-1">1. Design Your Setup</h4>
                <p className="text-slate-400">
                  Pick your desk, chair, dual/ultrawide displays, and Bali lifestyle accessories directly on the living canvas.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-bold text-emerald-300 mb-1">2. Villa Delivery & Setup</h4>
                <p className="text-slate-400">
                  We deliver right to your villa in Canggu, Pererenan, Seminyak, Ubud, or Uluwatu. Our team handles complete assembly and cable management.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <h4 className="font-bold text-emerald-300 mb-1">3. Flexible Island Living</h4>
                <p className="text-slate-400">
                  Rent by the week or month. Need to change villa or extend your stay? Simply message our concierge on WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setIsHelpOpen(false);
                  setCheckoutOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Got It — Start Designing
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
