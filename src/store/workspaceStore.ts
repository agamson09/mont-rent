import { create } from 'zustand';
import { CategoryId, RentalDurationType, PresetSetup, ProductItem } from '@/types/workspace';
import { PRODUCTS } from '@/data/products';
import { PRESETS } from '@/data/presets';

interface WorkspaceStore {
  deskId: string;
  chairId: string;
  monitorId: string;
  lightingId: string | null;
  plantId: string | null;
  peripheralsId: string | null;
  lifestyleIds: string[];
  
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio';
  lightingMode: 'day' | 'sunset' | 'night';
  
  durationType: RentalDurationType;
  durationUnits: number;
  currency: 'USD' | 'IDR';
  
  activeTab: CategoryId;
  isCheckoutOpen: boolean;
  isShareModalOpen: boolean;
  activePresetId: string | null;
  
  // Actions
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  setMonitor: (id: string) => void;
  setLighting: (id: string | null) => void;
  setPlant: (id: string | null) => void;
  setPeripherals: (id: string | null) => void;
  toggleLifestyle: (id: string) => void;
  
  applyPreset: (presetId: string) => void;
  setBackdrop: (backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio') => void;
  setLightingMode: (mode: 'day' | 'sunset' | 'night') => void;
  setDurationType: (type: RentalDurationType) => void;
  setDurationUnits: (units: number) => void;
  setCurrency: (currency: 'USD' | 'IDR') => void;
  setActiveTab: (tab: CategoryId) => void;
  setCheckoutOpen: (open: boolean) => void;
  setShareModalOpen: (open: boolean) => void;
  resetWorkspace: () => void;
  
  // Helpers
  getSelectedProducts: () => ProductItem[];
  getWeeklyTotalUSD: () => number;
  getWeeklyTotalIDR: () => number;
  getMonthlyTotalUSD: () => number;
  getMonthlyTotalIDR: () => number;
  getTotalPrice: () => number;
  getFormattedTotal: () => string;
}

const DEFAULT_STATE = {
  deskId: 'desk-standing-teak',
  chairId: 'chair-ergopro-mesh',
  monitorId: 'monitor-single-27',
  lightingId: 'light-screenbar',
  plantId: 'plant-monstera',
  peripheralsId: 'peripherals-pro-bundle',
  lifestyleIds: ['lifestyle-coffee-station'],
  backdrop: 'villa-pool' as const,
  lightingMode: 'day' as const,
  durationType: 'weekly' as RentalDurationType,
  durationUnits: 1,
  currency: 'USD' as const,
  activeTab: 'desks' as CategoryId,
  isCheckoutOpen: false,
  isShareModalOpen: false,
  activePresetId: null as string | null,
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  ...DEFAULT_STATE,

  setDesk: (id) => set({ deskId: id, activePresetId: null }),
  setChair: (id) => set({ chairId: id, activePresetId: null }),
  setMonitor: (id) => set({ monitorId: id, activePresetId: null }),
  
  setLighting: (id) => set((state) => ({ 
    lightingId: state.lightingId === id ? null : id, 
    activePresetId: null 
  })),
  
  setPlant: (id) => set((state) => ({ 
    plantId: state.plantId === id ? null : id, 
    activePresetId: null 
  })),
  
  setPeripherals: (id) => set((state) => ({ 
    peripheralsId: state.peripheralsId === id ? null : id, 
    activePresetId: null 
  })),
  
  toggleLifestyle: (id) => set((state) => {
    const exists = state.lifestyleIds.includes(id);
    return {
      lifestyleIds: exists 
        ? state.lifestyleIds.filter((item) => item !== id)
        : [...state.lifestyleIds, id],
      activePresetId: null,
    };
  }),

  applyPreset: (presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    set({
      deskId: preset.deskId,
      chairId: preset.chairId,
      monitorId: preset.monitorId,
      lightingId: preset.lightingId,
      plantId: preset.plantId,
      peripheralsId: preset.peripheralsId,
      lifestyleIds: preset.lifestyleIds,
      backdrop: preset.backdrop,
      activePresetId: preset.id,
    });
  },

  setBackdrop: (backdrop) => set({ backdrop }),
  setLightingMode: (lightingMode) => set({ lightingMode }),
  setDurationType: (durationType) => set({ durationType }),
  setDurationUnits: (durationUnits) => set({ durationUnits }),
  setCurrency: (currency) => set({ currency }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),
  setShareModalOpen: (isShareModalOpen) => set({ isShareModalOpen }),

  resetWorkspace: () => set({ ...DEFAULT_STATE }),

  getSelectedProducts: () => {
    const state = get();
    const ids = [
      state.deskId,
      state.chairId,
      state.monitorId,
      state.lightingId,
      state.plantId,
      state.peripheralsId,
      ...state.lifestyleIds,
    ].filter(Boolean) as string[];

    return ids
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is ProductItem => p !== undefined);
  },

  getWeeklyTotalUSD: () => {
    const items = get().getSelectedProducts();
    return items.reduce((sum, item) => sum + item.priceWeeklyUSD, 0);
  },

  getWeeklyTotalIDR: () => {
    const items = get().getSelectedProducts();
    return items.reduce((sum, item) => sum + item.priceWeeklyIDR, 0);
  },

  getMonthlyTotalUSD: () => {
    const items = get().getSelectedProducts();
    return items.reduce((sum, item) => sum + item.priceMonthlyUSD, 0);
  },

  getMonthlyTotalIDR: () => {
    const items = get().getSelectedProducts();
    return items.reduce((sum, item) => sum + item.priceMonthlyIDR, 0);
  },

  getTotalPrice: () => {
    const state = get();
    const isWeekly = state.durationType === 'weekly';
    const isUSD = state.currency === 'USD';

    if (isWeekly) {
      const base = isUSD ? state.getWeeklyTotalUSD() : state.getWeeklyTotalIDR();
      return base * state.durationUnits;
    } else {
      const base = isUSD ? state.getMonthlyTotalUSD() : state.getMonthlyTotalIDR();
      return base * state.durationUnits;
    }
  },

  getFormattedTotal: () => {
    const state = get();
    const total = state.getTotalPrice();
    if (state.currency === 'USD') {
      return `$${total.toLocaleString('en-US')}`;
    } else {
      return `Rp ${total.toLocaleString('id-ID')}`;
    }
  },
}));
