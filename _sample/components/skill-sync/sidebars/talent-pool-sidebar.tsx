"use client";

import {
  Activity,
  ArrowRightLeft,
  Award,
  SortAsc,
  SortDesc,
} from "lucide-react";
import React from "react";

import { getMasteryCount } from "../mandala-chart/mandala-chart.logic";
import { Profile, SortOrder } from "../types";

interface TalentPoolSidebarProperties {
  readonly candidates: readonly Profile[];
  readonly selectedId: string;
  readonly focusedSkill: string;
  readonly sortOrder: SortOrder;
  readonly lastLog: string;
  readonly onSelect: (id: string) => void;
  readonly onToggleSort: () => void;
}

/**
 * 右サイドバー: ターゲット（パートナー）の選択と一覧
 * @param root0
 * @param root0.candidates
 * @param root0.selectedId
 * @param root0.focusedSkill
 * @param root0.sortOrder
 * @param root0.lastLog
 * @param root0.onSelect
 * @param root0.onToggleSort
 */
export const TalentPoolSidebar: React.FC<TalentPoolSidebarProperties> = ({
  candidates,
  selectedId,
  focusedSkill,
  sortOrder,
  lastLog,
  onSelect,
  onToggleSort,
}) => {
  return (
    <aside className="z-30 flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white shadow-sm">
      {/* ネットワークヘッダー */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-5">
        <div>
          <h2 className="text-[0.8rem] font-black uppercase tracking-widest text-slate-400">
            Network
          </h2>
          <div className="text-[1.1rem] font-black uppercase tracking-tight">
            Talent Pool
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="mr-1 flex flex-col items-end">
            <span className="mb-1 text-[0.7rem] font-black uppercase leading-none text-slate-400">
              Sort by Progress
            </span>
            <button
              onClick={onToggleSort}
              className={`flex h-8 w-8 items-center justify-center rounded shadow-sm transition-all ${
                sortOrder === "desc"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-500 hover:bg-slate-300"
              }`}
              title="習得数でソート"
            >
              {sortOrder === "desc" ? (
                <SortDesc size={16} />
              ) : (
                <SortAsc size={16} />
              )}
            </button>
          </div>
          <span className="rounded bg-slate-900 px-2.5 py-1 text-[1rem] font-black tabular-nums text-white">
            {candidates.length}
          </span>
        </div>
      </div>

      {/* 候補者リスト */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-hide">
        {candidates.map((c) => {
          const count = getMasteryCount(c, focusedSkill);
          const isSelected = selectedId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`group relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                isSelected
                  ? "scale-[1.02] border-indigo-600 bg-white shadow-lg ring-4 ring-indigo-50"
                  : "border-slate-100 bg-white hover:border-slate-300"
              }`}
              role="button"
              aria-pressed={isSelected}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center text-[1rem] font-black uppercase tracking-tight text-slate-800">
                  <span>{c.name}</span>
                  <span
                    className={`ml-3 rounded-full px-2 py-0.5 text-[0.8rem] font-black tabular-nums transition-colors ${
                      count >= 6
                        ? "bg-indigo-600 text-white"
                        : (count >= 3
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500")
                    }`}
                  >
                    {count}/8
                  </span>
                </div>
                <ArrowRightLeft
                  size={18}
                  className={`transition-colors duration-300 ${
                    isSelected
                      ? "text-indigo-400"
                      : "text-slate-200 group-hover:text-indigo-300"
                  }`}
                />
              </div>
              <p className="mb-4 truncate text-[0.85rem] font-bold uppercase italic tracking-widest text-slate-400">
                {c.role}
              </p>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex -space-x-1.5">
                  {Object.keys(c.mastery).map((s) => (
                    <div
                      key={s}
                      className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm"
                      title={s}
                    >
                      <Award size={12} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                <div className="text-[0.75rem] font-black uppercase tracking-widest text-slate-300">
                  View Profile
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 運用パルス（ログ） */}
      <div className="bg-slate-950 p-5 font-mono text-white">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.75rem] font-black uppercase tracking-[0.2em] text-slate-500">
            Operational Pulse
          </span>
          <Activity size={12} className="animate-pulse text-green-500" />
        </div>
        <div className="truncate font-mono text-[0.8rem] font-black italic tracking-tight leading-relaxed text-indigo-400/80 uppercase">
          &gt; {lastLog}
        </div>
      </div>
    </aside>
  );
};
