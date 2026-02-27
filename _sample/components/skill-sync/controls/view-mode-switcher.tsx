"use client";

import { Layers, User, UserCheck } from "lucide-react";
import React from "react";

import { ViewMode } from "../types";

interface ViewModeSwitcherProperties {
  readonly currentMode: ViewMode;
  readonly onChange: (mode: ViewMode) => void;
}

/**
 * 表示モード切り替えスイッチ
 * 自分 / すべて比較 / 相手
 * @param root0
 * @param root0.currentMode
 * @param root0.onChange
 */
export const ViewModeSwitcher: React.FC<ViewModeSwitcherProperties> = ({
  currentMode,
  onChange,
}) => {
  const modes = [
    {
      id: "me",
      label: "自分",
      icon: User,
      activeClass: "bg-emerald-500 text-white",
    },
    {
      id: "all",
      label: "すべて比較",
      icon: Layers,
      activeClass: "bg-white text-slate-900 shadow-sm",
    },
    {
      id: "target",
      label: "相手",
      icon: UserCheck,
      activeClass: "bg-amber-500 text-white",
    },
  ] as const;

  return (
    <div className="flex justify-center">
      <nav
        className="flex space-x-1.5 rounded-2xl border border-slate-200 bg-slate-200/50 p-2 shadow-inner"
        aria-label="表示モード切り替え"
      >
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`flex items-center space-x-3 rounded-xl px-6 py-2.5 text-[1rem] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? `${m.activeClass} shadow-md`
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-pressed={isActive}
            >
              <m.icon size={18} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
