'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { PRODUCTS } from '@/data/products';
import { Check, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    activeTab,
    deskId,
    chairId,
    monitorId,
    lightingId,
    plantId,
    peripheralsId,
    lifestyleIds,
    currency,
    durationType,
    setDesk,
    setChair,
    setMonitor,
    setLighting,
    setPlant,
    setPeripherals,
    toggleLifestyle,
  } = useWorkspaceStore();

  const currentProducts = PRODUCTS.filter((p) => p.category === activeTab);

  const isSelected = (itemId: string) => {
    switch (activeTab) {
      case 'desks':
        return deskId === itemId;
      case 'chairs':
        return chairId === itemId;
      case 'monitors':
        return monitorId === itemId;
      case 'lighting':
        return lightingId === itemId;
      case 'plants':
        return plantId === itemId;
      case 'peripherals':
        return peripheralsId === itemId;
      case 'lifestyle':
        return lifestyleIds.includes(itemId);
      default:
        return false;
    }
  };

  const handleItemClick = (itemId: string) => {
    switch (activeTab) {
      case 'desks':
        setDesk(itemId);
        break;
      case 'chairs':
        setChair(itemId);
        break;
      case 'monitors':
        setMonitor(itemId);
        break;
      case 'lighting':
        setLighting(itemId);
        break;
      case 'plants':
        setPlant(itemId);
        break;
      case 'peripherals':
        setPeripherals(itemId);
        break;
      case 'lifestyle':
        toggleLifestyle(itemId);
        break;
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProducts.map((item) => {
          const selected = isSelected(item.id);
          const price =
            durationType === 'weekly'
              ? currency === 'USD'
                ? `$${item.priceWeeklyUSD}`
                : `Rp ${item.priceWeeklyIDR.toLocaleString('id-ID')}`
              : currency === 'USD'
              ? `$${item.priceMonthlyUSD}`
              : `Rp ${item.priceMonthlyIDR.toLocaleString('id-ID')}`;

          const periodLabel = durationType === 'weekly' ? '/wk' : '/mo';

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer ${
                selected
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              {/* Card Header & Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.badge && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                      {item.slotName}
                    </span>
                  </div>

                  {/* Equipped Checkbox or Toggle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      selected
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                        : 'bg-slate-800 text-slate-500 group-hover:text-slate-300 border border-slate-700'
                    }`}
                  >
                    {selected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>

                {/* Product Title */}
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>

                {/* Specs List */}
                <ul className="mt-3 space-y-1">
                  {item.specs.slice(0, 3).map((spec, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer: Price & Equip Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-white">{price}</span>
                    <span className="text-[11px] font-medium text-slate-400">{periodLabel}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block">Bali Villa Delivery</span>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    selected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300'
                  }`}
                >
                  {selected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Equipped</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Equip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
