"use client";

import { useMemo } from "react";

interface MandalaCellProps {
  /** セルの内容 */
  value: string;
  /** グリッド内の位置 (0-8) */
  cellIdx: number;
  /** グリッド全体のインデックス (0-8) */
  gridIdx: number;
  /** クリック時のハンドラ */
  onClick: () => void;
  /** 集中モード中かどうか */
  isFocused?: boolean;
}

/**
 * マンダラチャートの最小単位セルコンポーネント
 * 仕様書のカラーリングルールに従い背景色を変更する
 */
export const MandalaCell = ({
  value,
  cellIdx,
  gridIdx,
  onClick,
  isFocused = false,
}: MandalaCellProps) => {
  // 背景色の判定 (仕様書 6. 暗黙の仕様 準拠)
  const bgColorClass = useMemo(() => {
    if (gridIdx === 4 && cellIdx === 4) {
      return "bg-[#1E3A8A] text-white"; // 大目標 (より深い青: blue-900 相当)
    }
    if (cellIdx === 4) {
      return "bg-[#DBEAFE] text-[#111827] font-bold"; // 中目標 (blue-100 背景に gray-900 文字)
    }
    if (gridIdx === 4) {
      return "bg-[#F8FAFC] text-[#1E293B]"; // 中央グリッド背景 (slate-50 背景に slate-800 文字)
    }
    return "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50"; // 小目標
  }, [gridIdx, cellIdx]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex aspect-square w-full items-center justify-center p-2 text-center
        text-[1rem] leading-tight font-medium transition-all duration-200
        ${bgColorClass}
        backdrop-blur-sm border border-white/20 shadow-sm
        hover:scale-[1.02] hover:shadow-md active:scale-95
        ${isFocused ? "text-lg md:text-xl" : "text-[0.75rem] md:text-[0.875rem] lg:text-[1rem]"}
        overflow-hidden break-words rounded-md
      `}
      aria-label={`${value ? value : '空の目標'} (グリッド ${gridIdx + 1}, セル ${cellIdx + 1})`}
    >
      {value || ""}
    </button>
  );
};
