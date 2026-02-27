"use client";

import { UserCircle } from "lucide-react";
import React from "react";

import { Profile } from "../types";

interface ProfileSidebarProperties {
  readonly profiles: readonly Profile[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}

/**
 * 左サイドバー: 自分のプロファイル選択
 * @param root0
 * @param root0.profiles
 * @param root0.selectedId
 * @param root0.onSelect
 */
export const ProfileSidebar: React.FC<ProfileSidebarProperties> = ({
  profiles,
  selectedId,
  onSelect,
}) => {
  return (
    <aside className="z-30 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto border-b border-slate-200 bg-slate-950 p-5 text-white">
        <div className="mb-6 flex items-center space-x-3">
          <div className="rounded-lg bg-indigo-500 p-2">
            <UserCircle size={20} className="text-white" />
          </div>
          <span className="text-[0.9rem] font-black uppercase tracking-widest">
            My Identity
          </span>
        </div>
        <nav className="space-y-3" aria-label="プロファイル選択">
          {profiles.map((p) => {
            const isSelected = selectedId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-600 shadow-lg ring-2 ring-indigo-500/20"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                }`}
                aria-pressed={isSelected}
              >
                <div
                  className={`text-[1rem] font-black uppercase tracking-tighter ${
                    isSelected ? "text-white" : ""
                  }`}
                >
                  {p.name}
                </div>
                <div className="mt-1 text-[0.8rem] font-bold uppercase opacity-60">
                  {p.role}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
