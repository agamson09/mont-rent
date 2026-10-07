export type CategoryId = 
  | 'desks' 
  | 'chairs' 
  | 'monitors' 
  | 'lighting' 
  | 'plants' 
  | 'peripherals' 
  | 'lifestyle';

export interface ProductItem {
  id: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  specs: string[];
  priceWeeklyUSD: number;
  priceMonthlyUSD: number;
  priceWeeklyIDR: number;
  priceMonthlyIDR: number;
  badge?: string;
  inStock: boolean;
  imageAlt: string;
  colorHex?: string;
  slotName: string;
}

export type RentalDurationType = 'weekly' | 'monthly';

export interface WorkspaceState {
  deskId: string;
  chairId: string;
  monitorId: string;
  lightingId: string | null;
  plantId: string | null;
  peripheralsId: string | null;
  lifestyleIds: string[]; // surfboard, coffee-machine, bean-bag, scooter-gear
  
  // Environment controls
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio';
  lightingMode: 'day' | 'sunset' | 'night';
  
  // Checkout & Pricing state
  durationType: RentalDurationType;
  durationUnits: number; // e.g. 1 week, 2 weeks, 1 month, 3 months
  currency: 'USD' | 'IDR';
  
  // UI state
  activeTab: CategoryId;
  isCheckoutOpen: boolean;
  isShareModalOpen: boolean;
}

export interface PresetSetup {
  id: string;
  name: string;
  role: string;
  description: string;
  deskId: string;
  chairId: string;
  monitorId: string;
  lightingId: string | null;
  plantId: string | null;
  peripheralsId: string | null;
  lifestyleIds: string[];
  backdrop: 'villa-pool' | 'rice-terrace' | 'minimal-studio';
}
