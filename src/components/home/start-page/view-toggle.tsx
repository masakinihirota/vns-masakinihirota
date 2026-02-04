"use client";

/**
 * ビュートグルコンポーネント
 * 最新情報と基本の使い方を切り替えるタブUI
 */

import type { ViewToggleProps } from "./start-page.types";

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-neutral-800 rounded-xl p-1.5 border border-slate-200 dark:border-neutral-700">
      <button
        onClick={() => onViewModeChange("latest")}
        className={`px-6 py-2 rounded-lg font-bold transition-all ${
          viewMode === "latest"
            ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200 dark:bg-blue-600 dark:text-white dark:ring-0"
            : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800"
        }`}
      >
        最新情報
      </button>
      <button
        onClick={() => onViewModeChange("beginner")}
        className={`px-6 py-2 rounded-lg font-bold transition-all ${
          viewMode === "beginner"
            ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200 dark:bg-blue-600 dark:text-white dark:ring-0"
            : "text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800"
        }`}
      >
        基本の使い方
      </button>
    </div>
  );
}
