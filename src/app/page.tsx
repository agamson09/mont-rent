'use client';

import React from 'react';
import { Header } from '@/components/navbar/Header';
import { ThreeWorkspaceSimulator } from '@/components/simulator3d/ThreeWorkspaceSimulator';
import { WorkspaceCanvas } from '@/components/canvas/WorkspaceCanvas';
import { PresetSelector } from '@/components/presets/PresetSelector';
import { CategoryTabs } from '@/components/catalog/CategoryTabs';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { PriceBar } from '@/components/footer/PriceBar';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { 
  Palmtree, 
  Truck, 
  ShieldCheck, 
  Repeat, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Box,
  Layers
} from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = React.useState<'3d' | '2d'>('3d');

  return (
    <div className="min-h-screen flex flex-col bg-[#070A0F] text-slate-100">
      {/* 1. TOP HEADER */}
      <Header />

      {/* 2. MAIN WORKSPACE STUDIO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* HERO TITLE SECTION (Matching the challenge sketch header) */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-xs">
            <Palmtree className="w-3.5 h-3.5" />
            <span>Monis.rent Workspace Designer • Bali Nomad Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Design Your Workspace!
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium tracking-wide">
            — Create Your Perfect Setup &amp; Rent It in Bali —
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Pick your desk, choose an ergonomic chair, drop in 4K monitors, add a plant, or lean your surfboard against the wall. Watch your setup come to life in realistic 3D space.
          </p>

          {/* View Mode Toggle (3D WebGL Simulator vs 2D Sketch Blueprint) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="inline-flex items-center bg-slate-900/90 rounded-full p-1 border border-slate-800 shadow-xl">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Simulator (Three.js)</span>
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Blueprint</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1-CLICK CURATED NOMAD PRESETS */}
        <section className="pt-2">
          <PresetSelector />
        </section>

        {/* CENTERPIECE: 3D WORKSPACE SIMULATOR / 2D CANVAS */}
        <section className="relative">
          {viewMode === '3d' ? <ThreeWorkspaceSimulator /> : <WorkspaceCanvas />}
        </section>

        {/* CUSTOMIZATION STUDIO & CATALOG */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Customize Equipment &amp; Add-ons
              </h2>
              <p className="text-xs text-slate-400">
                Click any gear below to equip or swap items instantly on the canvas.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All equipment certified &amp; sanitized in Bali</span>
            </div>
          </div>

          {/* Category Tabs */}
          <CategoryTabs />

          {/* Product Cards Grid */}
          <ProductGrid />
        </section>

        {/* WHY NOMADS RENT WITH MONIS */}
        <section className="py-8 border-t border-slate-800/80">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Why Bali Nomads Rent with Monis
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Skip the furniture hunt. We equip your Canggu or Ubud villa so you can ship code from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white">White-Glove Villa Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Free delivery across Canggu, Pererenan, Seminyak, and Ubud. Our crew carries everything up to your room, tests monitors, and manages cables.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                <Repeat className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="text-base font-bold text-white">100% Flexible Island Terms</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staying for 2 weeks? Moving villas next month? Extend, swap items, or pause your rental anytime with a quick message to our concierge.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">Ergonomic &amp; Heat Tested</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every chair and desk is selected specifically for Bali&apos;s humidity and long remote work hours. Backed by immediate swap warranty if anything fails.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Digital Nomad FAQs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1">
                How fast can my workspace be delivered?
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Orders placed before 2 PM WITA are delivered next morning directly to your villa or apartment anywhere in South Bali.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1">
                Do you provide international power adapters?
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Yes! Every setup includes multi-plug universal extension cords compatible with US, UK, EU, and AU plugs with surge protection.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1">
                Can I swap a chair or add a second monitor later?
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Absolutely. Just send a WhatsApp message to our team and we will deliver upgrades to your villa without re-charging delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <h5 className="font-bold text-slate-200 mb-1">
                How does deposit and return work?
              </h5>
              <p className="text-slate-400 leading-relaxed">
                A simple refundable deposit is processed via card or Wise. When your rental concludes, our team disassembles and returns your deposit on the spot.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 3. STICKY BOTTOM PRICE & CHECKOUT DOCK */}
      <PriceBar />

      {/* 4. CHECKOUT MODAL & SUMMARY MANIFEST */}
      <CheckoutModal />
    </div>
  );
}
