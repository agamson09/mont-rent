'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { BALI_LOCATIONS } from '@/data/products';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setCheckoutOpen,
    getSelectedProducts,
    durationType,
    durationUnits,
    currency,
    getFormattedTotal,
    getTotalPrice,
  } = useWorkspaceStore();

  const [selectedLocation, setSelectedLocation] = useState(BALI_LOCATIONS[0].id);
  const [villaName, setVillaName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, []);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationId, setReservationId] = useState('');

  if (!isCheckoutOpen) return null;

  const selectedItems = getSelectedProducts();
  const locationObj = BALI_LOCATIONS.find((l) => l.id === selectedLocation) || BALI_LOCATIONS[0];

  const handleOnlineReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MN-${Math.floor(100000 + Math.random() * 900000)}`;
    setReservationId(newId);
    setIsSuccess(true);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#F43F5E'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const generateWhatsAppMessage = () => {
    const itemsList = selectedItems
      .map((item) => `• ${item.name} (${item.slotName})`)
      .join('\n');

    const durationText = `${durationUnits} ${durationType === 'weekly' ? 'week(s)' : 'month(s)'}`;
    const totalText = getFormattedTotal();

    const msg = `🌴 *Hello Monis.rent Concierge!*
I just designed my DreamDesk workspace on your interactive designer and I'd like to book it!

📋 *Equipment Manifest:*
${itemsList}

⏱️ *Rental Duration:* ${durationText}
💰 *Total Rate:* ${totalText}
📍 *Villa Location:* ${locationObj.name} ${villaName ? `(${villaName})` : ''}
📅 *Preferred Delivery:* ${deliveryDate}
👤 *Contact:* ${customerName || 'Nomad'} (${whatsappNumber || 'WhatsApp'})

Please confirm availability and villa setup schedule. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/6281234567890?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto relative">
        {/* Modal Close Button */}
        <button
          onClick={() => {
            setCheckoutOpen(false);
            setIsSuccess(false);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- STATE 1: CELEBRATION SUCCESS SCREEN --- */}
        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-2">
              RESERVATION CONFIRMED • {reservationId}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Your DreamDesk is on its way! 🌴
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Our Bali concierge has received your workspace manifest for{' '}
              <strong className="text-slate-200">{locationObj.name}</strong>. We will deliver and assemble everything on{' '}
              <strong className="text-slate-200">{deliveryDate}</strong>.
            </p>

            {/* Manifest Summary Box */}
            <div className="w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800 my-6 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs text-slate-400">
                <span>Selected Equipment ({selectedItems.length} items)</span>
                <span className="font-bold text-white">{getFormattedTotal()}</span>
              </div>
              <ul className="mt-3 space-y-1.5 max-h-36 overflow-y-auto text-xs text-slate-300">
                {selectedItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span className="truncate pr-2">✓ {item.name}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 uppercase">{item.slotName}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={generateWhatsAppMessage}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Bali Concierge</span>
              </button>
              <button
                onClick={() => {
                  setCheckoutOpen(false);
                  setIsSuccess(false);
                }}
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* --- STATE 2: CHECKOUT & RESERVATION FORM --- */
          <form onSubmit={handleOnlineReservation} className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Workspace Summary & Rental
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Review your setup manifest, specify your Bali villa, and reserve your gear.
            </p>

            {/* Gear Manifest Scroll Box */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 mb-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <span>Selected Equipment ({selectedItems.length} items)</span>
                <span>
                  {durationUnits} {durationType === 'weekly' ? 'Week(s)' : 'Month(s)'}
                </span>
              </div>

              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedItems.map((item) => {
                  const itemPrice =
                    durationType === 'weekly'
                      ? currency === 'USD'
                        ? `$${item.priceWeeklyUSD * durationUnits}`
                        : `Rp ${(item.priceWeeklyIDR * durationUnits).toLocaleString('id-ID')}`
                      : currency === 'USD'
                      ? `$${item.priceMonthlyUSD * durationUnits}`
                      : `Rp ${(item.priceMonthlyIDR * durationUnits).toLocaleString('id-ID')}`;

                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-medium text-slate-200 truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">({item.slotName})</span>
                      </div>
                      <span className="font-mono text-slate-300 shrink-0">{itemPrice}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Footnote */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Rental Rate</span>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Truck className="w-3.5 h-3.5" /> Free delivery & on-site assembly
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {getFormattedTotal()}
                </div>
              </div>
            </div>

            {/* Bali Villa Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Bali Location Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Bali Delivery Area
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {BALI_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.tag})
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>

              {/* Villa / Co-living Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Villa Name / Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Villa Frangipani, Jl. Batu Bolong No. 42"
                  value={villaName}
                  onChange={(e) => setVillaName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Contact
                </label>
                <input
                  type="tel"
                  placeholder="+62 812... or International"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 mb-6 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No long-term lock-in
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Assembly in 30 mins
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free replacement warranty
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* WhatsApp Direct Order (Primary Bali Channel) */}
              <button
                type="button"
                onClick={generateWhatsAppMessage}
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Rent via WhatsApp</span>
              </button>

              {/* Online Direct Reservation */}
              <button
                type="submit"
                className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Reserve Online</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
