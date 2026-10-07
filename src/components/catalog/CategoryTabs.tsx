'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { CATEGORIES } from '@/data/products';
import { CategoryId } from '@/types/workspace';
import { 
  Layout, 
  Armchair, 
  Monitor, 
  Lamp, 
  Flower2, 
  Keyboard, 
  Palmtree 
} from 'lucide-react';

export const CategoryTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useWorkspaceStore();

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'desks':
        return <Layout className="w-4 h-4" />;
      case 'chairs':
        return <Armchair className="w-4 h-4" />;
      case 'monitors':
        return <Monitor className="w-4 h-4" />;
      case 'lighting':
        return <Lamp className="w-4 h-4" />;
      case 'plants':
        return <Flower2 className="w-4 h-4" />;
      case 'peripherals':
        return <Keyboard className="w-4 h-4" />;
      case 'lifestyle':
        return <Palmtree className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2">
      <div className="flex items-center gap-2 min-w-max p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as CategoryId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>
                {getCategoryIcon(cat.id as CategoryId)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-slate-950/20 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
