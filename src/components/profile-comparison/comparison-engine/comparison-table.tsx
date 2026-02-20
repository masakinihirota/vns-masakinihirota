"use client";

import { Flame } from "lucide-react";
import React from "react";
import {
  calculateSyncLevel,
  CATEGORIES,
  ComparisonItem,
  Profile,
  TEMPORAL_AXIS,
} from "./comparison.logic";
import { TierBadge } from "./tier-badge";

interface ComparisonTableProps {
  readonly data: readonly ComparisonItem[];
  readonly currentMe: Profile;
  readonly currentTarget: Profile | null;
}

/**
 * 作品比較リストを表示するテーブルコンポーネント
 */
export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  data,
  currentMe,
  currentTarget,
}) => {
  const syncLevel = calculateSyncLevel(currentMe, currentTarget);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      {/* キャプション・ステータスヘッダー */}
      <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 px-5 py-2.5 rounded-full font-black text-base tracking-widest bg-orange-600 text-white shadow-lg shadow-orange-100">
            <Flame size={20} fill="currentColor" aria-hidden="true" />
            <span>{currentTarget ? "SYNC HEAT" : "SOLO ENGINE"}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center text-base font-black text-slate-400 uppercase tracking-tight">
            Mode:{" "}
            <span className="ml-3 text-slate-900">
              {currentTarget
                ? `Comparison with ${currentTarget.name}`
                : "Personal Assessment"}
            </span>
          </div>
        </div>

        {currentTarget && (
          <div
            className="flex flex-col items-end"
            aria-label={`Match Factor: ${syncLevel} percent`}
          >
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Match Factor
            </span>
            <span className="text-4xl font-black text-blue-600 tracking-tighter leading-none">
              {syncLevel}%
            </span>
          </div>
        )}
      </header>

      {/* リスト内容 */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {data.map((item) => {
            const axis = TEMPORAL_AXIS[item.axis];
            const AxisIcon = axis.icon;
            const category = CATEGORIES[item.category];

            const isMatch =
              currentTarget &&
              item.myTier === item.theirTier &&
              item.myTier !== "UNRATED";

            return (
              <div
                key={item.title}
                className={`grid ${currentTarget ? "grid-cols-[160px_1fr_160px]" : "grid-cols-[160px_1fr]"} bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-300 items-center overflow-hidden`}
              >
                {/* 自分の評価 */}
                <div className="p-6 border-r border-slate-100 flex justify-center bg-slate-50/50">
                  <TierBadge tierKey={item.myTier} />
                </div>

                {/* 作品情報 */}
                <div
                  className={`p-6 ${currentTarget ? "text-center" : "text-left"} flex flex-col space-y-2`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <AxisIcon
                      size={18}
                      className={axis.color}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xl font-black tracking-tight leading-tight ${isMatch ? "text-blue-700" : "text-slate-800"}`}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] text-center">
                    {category.label}{" "}
                    <span className="mx-2 text-slate-200">|</span> {axis.label}
                  </div>
                </div>

                {/* 相手の評価 */}
                {currentTarget && (
                  <div className="p-6 border-l border-slate-100 flex justify-center bg-slate-50/50">
                    <TierBadge tierKey={item.theirTier || "UNRATED"} />
                  </div>
                )}
              </div>
            );
          })}

          {data.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-xl font-bold text-slate-400">
                該当するデータがありません。フィルタ設定を確認してください。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
