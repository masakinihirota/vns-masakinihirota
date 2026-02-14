'use client';

import React from 'react';
import { OBJECTIVE_PRESETS } from '../../profile-mask/profile-mask.constants';

export interface ObjectiveSelectorProps {
  readonly selectedIds: readonly string[];
  readonly onToggle: (id: string) => void;
}

/**
 * 目的選択グリッド
 */
export const ObjectiveSelector: React.FC<ObjectiveSelectorProps> = ({ selectedIds, onToggle }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
    {OBJECTIVE_PRESETS.map((preset) => (
      <button
        key={preset.id}
        onClick={() => onToggle(preset.id)}
        className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all space-y-3 ${selectedIds.includes(preset.id)
          ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg scale-[1.05]'
          : 'bg-[var(--card)] backdrop-blur-md border-slate-100 dark:border-white/10 text-slate-400 hover:border-slate-300'
          }`}
        aria-pressed={selectedIds.includes(preset.id)}
      >
        <preset.icon size={24} aria-hidden="true" />
        <span className="text-xs font-black uppercase tracking-tight text-center leading-tight">
          {preset.label}
        </span>
      </button>
    ))}
  </div>
);
