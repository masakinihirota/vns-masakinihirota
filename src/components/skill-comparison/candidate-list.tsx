"use client";

import { ArrowRightLeft, Plus, Star, X } from "lucide-react";
import React from "react";
import { getMasteryCount, Profile } from "./skill-comparison.logic";

interface CandidateListProps {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly candidates: readonly Profile[];
  readonly focusedSkill: string;
  readonly selectedTargetId: string | number;
  readonly onSelectTarget: (id: string | number) => void;
  readonly onToggleAction?: (
    id: string | number,
    action: "followed" | "watched"
  ) => void;
  readonly actionType?: "remove" | "add";
  readonly countBadge?: number;
  readonly showDetails?: boolean;
}

/**
 * 候補者リスト・コンポーネント
 *
 * 指定されたスキルに対するマスタリー進度を表示し、選択やアクション（フォロー、ウォッチ）を可能にします。
 * 文字サイズは 1rem (text-base) 基準。
 */
export const CandidateList: React.FC<CandidateListProps> = ({
  title,
  icon,
  candidates,
  focusedSkill,
  selectedTargetId,
  onSelectTarget,
  onToggleAction,
  actionType,
  countBadge,
  showDetails = false,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-sm font-black text-slate-400 gap-2 uppercase tracking-widest flex items-center">
          {icon}
          {title}
          {countBadge !== undefined && (
            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-black">
              {countBadge}
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-2">
        {candidates.map((c) => {
          const isSelected = selectedTargetId === c.id;
          const masteryCount = getMasteryCount(c, focusedSkill);

          if (!showDetails) {
            // シンプルなリスト表示 (左サイドバー用)
            return (
              <div key={c.id} className="flex group">
                <button
                  onClick={() => onSelectTarget(c.id)}
                  className={`flex-1 p-3 rounded-l-lg border text-left text-base font-bold transition-all flex justify-between items-center ${isSelected
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                >
                  <span>{c.name}</span>
                  <span className="text-xs font-black bg-slate-100 px-2 py-1 rounded text-slate-500">
                    {masteryCount}/8
                  </span>
                </button>
                {onToggleAction && (
                  <button
                    onClick={() =>
                      onToggleAction(
                        c.id,
                        actionType === "add" ? "followed" : "followed"
                      )
                    }
                    className="px-3 border border-l-0 border-slate-100 rounded-r-lg hover:bg-rose-50 text-slate-300 transition-colors"
                    aria-label={`${c.name}をリストから削除`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            );
          }

          // 詳細カード表示 (右サイドバー用)
          return (
            <div
              key={c.id}
              onClick={() => onSelectTarget(c.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group relative ${isSelected
                  ? "bg-white border-indigo-600 shadow-lg ring-4 ring-indigo-50 scale-[1.02]"
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-base font-black uppercase text-slate-800 tracking-tight flex items-center">
                  <span>{c.name}</span>
                  <span
                    className={`ml-3 text-xs px-2.5 py-1 rounded-full font-black tabular-nums transition-colors ${masteryCount >= 6
                        ? "bg-indigo-600 text-white"
                        : masteryCount >= 3
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {masteryCount}/8
                  </span>
                </div>
                <ArrowRightLeft
                  size={18}
                  className={`transition-colors duration-300 ${isSelected ? "text-indigo-400" : "text-slate-200 group-hover:text-indigo-300"}`}
                />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5 italic truncate line-clamp-1">
                {c.role}
              </p>

              <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                <div className="flex -space-x-1.5">
                  {Object.keys(c.mastery || {}).map((s) => (
                    <div
                      key={s}
                      className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shadow-sm"
                      title={s}
                    >
                      <span className="text-[8px] font-bold text-slate-400 capitalize">
                        {s[0]}
                      </span>
                    </div>
                  ))}
                </div>
                {onToggleAction && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAction(c.id, "watched");
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all shadow-sm"
                      aria-label={`${c.name}をウォッチリストに追加/削除`}
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAction(c.id, "followed");
                      }}
                      className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
                      aria-label={`${c.name}をフォロー/アンフォロー`}
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
