'use client';

import { CheckCircle2, Plus } from 'lucide-react';
import React from 'react';
import { Cassette } from '../../profile-mask/profile-mask.types';

export interface CassetteSelectorProps {
  readonly label: string;
  readonly icon: any;
  readonly colorClass: string;
  readonly cassettes: readonly Cassette[];
  readonly selectedId?: string;
  readonly onSelect: (id: string) => void;
  readonly onAction?: () => void;
}

/**
 * カセットセレクター
 */
export const CassetteSelector: React.FC<CassetteSelectorProps> = ({
  label,
  icon: Icon,
  colorClass,
  cassettes,
  selectedId,
  onSelect,
  onAction,
}) => (
  <div className={`p-8 bg-[var(--card)] backdrop-blur-md border border-white/20 dark:border-white/10 rounded-[2rem] shadow-xl border-l-8 ${colorClass}`}>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <Icon size={28} className={colorClass.replace('border-l-', 'text-')} />
        <span className="font-black text-lg uppercase tracking-widest text-[var(--text)]">{label}</span>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="p-2 bg-slate-100 dark:bg-white/10 rounded-lg hover:bg-white dark:hover:bg-white/20 transition-all text-[var(--text)]"
          aria-label={`${label}を追加`}
        >
          <Plus size={18} />
        </button>
      )}
    </div>
    <div className="flex flex-col gap-3">
      {cassettes.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`p-5 rounded-[1.25rem] text-sm font-bold text-left border-2 transition-all flex items-center justify-between ${selectedId === c.id
            ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-md'
            : 'bg-white/50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10 hover:border-[var(--accent)]'
            }`}
          aria-pressed={selectedId === c.id}
        >
          <span>{c.name}</span>
          {selectedId === c.id && <CheckCircle2 size={18} />}
        </button>
      ))}
    </div>
  </div>
);
