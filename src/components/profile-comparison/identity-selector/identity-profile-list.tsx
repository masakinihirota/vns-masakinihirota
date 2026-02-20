"use client";

import { UserCircle } from "lucide-react";
import React from "react";
import { Profile } from "../comparison-engine/comparison.logic";

interface IdentityProfileListProps {
  readonly profiles: readonly Profile[];
  readonly selectedId: string | number;
  readonly onSelect: (id: string | number) => void;
}

/**
 * 自己プロファイル（千の仮面）を選択するためのリストコンポーネント
 */
export const IdentityProfileList: React.FC<IdentityProfileListProps> = ({
  profiles,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm z-20">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] opacity-50">
            Identity Switch
          </h2>
          <div className="text-lg font-black uppercase tracking-tight">
            My Profiles
          </div>
        </div>
        <UserCircle size={28} className="text-blue-400" />
      </div>

      {/* Profile Buttons */}
      <div className="p-4 space-y-3 border-b border-slate-100 bg-slate-50/50 flex-1 overflow-y-auto">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`w-full p-5 rounded-2xl text-left transition-all duration-300 border-2 ${
              selectedId === p.id
                ? "bg-white border-blue-600 shadow-xl ring-2 ring-blue-100 scale-[1.02]"
                : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
            }`}
          >
            <div
              className={`font-black text-base uppercase tracking-tight mb-1 ${selectedId === p.id ? "text-blue-700" : "text-slate-800"}`}
            >
              {p.name}
            </div>
            <div className="text-xs font-bold text-slate-400 truncate tracking-tight">
              {p.role}
            </div>
          </button>
        ))}
      </div>

      {/* Summary Section (Optional footer space in sidebar) */}
      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          Switch your persona to analyze alignment from different perspectives.
        </p>
      </div>
    </div>
  );
};
