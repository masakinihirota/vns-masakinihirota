'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import React from 'react';
import { ALL_SLOTS } from '../../profile-mask/profile-mask.constants';

export interface SlotSelectorProps {
  readonly selectedSlots: readonly string[];
  readonly onToggle: (id: string) => void;
}

/**
 * スロット設定グリッド
 */
export const SlotSelector: React.FC<SlotSelectorProps> = ({ selectedSlots, onToggle }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {ALL_SLOTS.map((slot) => {
      const isSelected = selectedSlots.includes(slot.id);
      return (
        <button
          key={slot.id}
          onClick={() => onToggle(slot.id)}
          className={`flex items-center space-x-4 p-5 rounded-[1.5rem] border-2 transition-all ${isSelected
            ? 'bg-white dark:bg-white/10 border-[var(--accent)] shadow-xl text-blue-900 dark:text-blue-400 ring-4 ring-blue-50/50 dark:ring-blue-500/10'
            : 'bg-[var(--card)] backdrop-blur-md border-transparent text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:border-slate-200'
            }`}
          aria-pressed={isSelected}
        >
          <div className={isSelected ? 'text-[var(--accent)]' : 'text-slate-300'}>
            {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </div>
          <div className="flex items-center space-x-3">
            <slot.icon size={20} className={isSelected ? 'text-[var(--accent)]' : 'opacity-40'} />
            <span className="text-sm font-black tracking-tight">{slot.label}</span>
          </div>
        </button>
      );
    })}
  </div>
);
