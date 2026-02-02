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
            ? "bg-white dark:bg-neutral-900 shadow-md text-blue-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300"
        }`}
      >
        最新情報
      </button>
      <button
        onClick={() => onViewModeChange("beginner")}
        className={`px-6 py-2 rounded-lg font-bold transition-all ${
          viewMode === "beginner"
            ? "bg-white dark:bg-neutral-900 shadow-md text-blue-600 dark:text-indigo-400"
            : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300"
        }`}
      >
        基本の使い方
      </button>
    </div>
  );
}
