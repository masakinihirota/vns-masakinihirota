"use client";

import { CheckCircle2 } from "lucide-react";
import React from "react";
import { ProfileType } from "../../profile-mask/profile-mask.types";

export interface TypeCardProps {
  readonly type: ProfileType;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
}

/**
 * プロフィールタイプ選択カード
 * グラスモーフィズムのデザインシステムに基づき、背景や境界線にCSS変数を使用
 */
export const TypeCard: React.FC<TypeCardProps> = ({
  type,
  isSelected,
  onSelect,
}) => (
  <button
    onClick={() => onSelect(type.id)}
    className={`flex items-start p-6 rounded-[2rem] border-4 transition-all text-left group w-full ${
      isSelected
        ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl scale-[1.01]"
        : type.isSpecial
          ? "bg-amber-50/10 dark:bg-amber-500/5 border-amber-100/20 dark:border-amber-500/20 text-[var(--text)] hover:border-amber-300 shadow-sm"
          : "bg-[var(--card)] backdrop-blur-md border-slate-100 dark:border-white/10 text-[var(--text)] hover:border-slate-300 dark:hover:border-white/20 shadow-sm"
    }`}
    aria-pressed={isSelected}
  >
    <div
      className={`p-4 rounded-xl mr-6 transition-colors shrink-0 ${
        isSelected
          ? "bg-white/20 text-white"
          : "bg-slate-100 dark:bg-white/10 text-slate-400"
      }`}
    >
      <type.icon size={28} />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-lg font-black ${isSelected ? "text-white" : "text-[var(--text)]"}`}
        >
          {type.label}
        </span>
        {isSelected && <CheckCircle2 size={24} />}
      </div>
      <p
        className={`text-sm font-bold leading-relaxed ${
          isSelected ? "text-white/80" : "text-slate-400 dark:text-neutral-500"
        }`}
      >
        {type.description}
      </p>
    </div>
  </button>
);
