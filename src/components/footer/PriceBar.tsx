'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export const PriceBar: React.FC = () => {
  const {
    getSelectedProducts,
    durationType,
    durationUnits,
    currency,
    setDurationType,
    setDurationUnits,
    setCurrency,
    setCheckoutOpen,
    getFormattedTotal,
  } = useWorkspaceStore();

  const selectedItems = getSelectedProducts();
  const itemCount = selectedItems.length;

  const handleDecreaseUnits = () => {
    if (durationUnits > 1) {
      setDurationUnits(durationUnits - 1);
    }
  };

  const handleIncreaseUnits = () => {
    if (durationUnits < 12) {
      setDurationUnits(durationUnits + 1);
    }
  };

  return (
    <footer className="sticky bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Left: Manifest Quick Stats & Guarantee */}
          <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">EQUIPPED GEAR</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {itemCount} Items
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free Villa Setup & Delivery
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Fully Insured & Tested
                </span>
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'IDR' ? 'bg-emerald-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                IDR (Rp)
              </button>
            </div>
          </div>

          {/* Right: Duration Toggle, Stepper, Total, and Rent Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 w-full lg:w-auto justify-between lg:justify-end">
            {/* Duration Type Tabs (Weekly vs Monthly) */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => setDurationType('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  durationType === 'weekly'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setDurationType('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  durationType === 'monthly'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Monthly</span>
                <span className="text-[10px] px-1 py-0.2 bg-emerald-500 text-slate-950 rounded-xs font-extrabold">
                  -25%
                </span>
              </button>
            </div>

            {/* Duration Units Stepper */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <button
                onClick={handleDecreaseUnits}
                disabled={durationUnits <= 1}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                aria-label="Decrease duration"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-200 min-w-16 text-center">
                {durationUnits} {durationType === 'weekly' ? (durationUnits === 1 ? 'Week' : 'Weeks') : (durationUnits === 1 ? 'Month' : 'Months')}
              </span>
              <button
                onClick={handleIncreaseUnits}
                disabled={durationUnits >= 12}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                aria-label="Increase duration"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total Price display */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">TOTAL ESTIMATE</span>
              <div className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {getFormattedTotal()}
              </div>
            </div>

            {/* Main Action: Ready to Rent! */}
            <button
              onClick={() => setCheckoutOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Ready to Rent?</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
