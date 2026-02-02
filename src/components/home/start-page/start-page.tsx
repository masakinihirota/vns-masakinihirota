"use client";

/**
 * スタートページ プレゼンテーションコンポーネント
 * ログイン後のホームページUI
 */

import { BeginnerGuideView } from "./beginner-guide-view";
import { LatestInfoView } from "./latest-info-view";
import type { ViewMode } from "./start-page.types";
import { ViewToggle } from "./view-toggle";

interface StartPageInternalProps {
  readonly viewMode: ViewMode;
  readonly onViewModeChange: (mode: ViewMode) => void;
}

export function StartPage({
  viewMode,
  onViewModeChange,
}: StartPageInternalProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F1A] text-slate-900 dark:text-neutral-200 font-sans flex flex-col text-[18px]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 dark:bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-[24px]">
            M
          </div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-800 dark:text-neutral-100">
            masakinihirota
          </h1>
        </div>

        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-grow w-full">
        {viewMode === "latest" ? <LatestInfoView /> : <BeginnerGuideView />}
      </main>

      {/* 最終目標セクション */}
      <section className="max-w-4xl mx-auto px-6 py-12 w-full text-center border-t border-slate-50 dark:border-neutral-800 mt-10">
        <p className="text-slate-400 dark:text-neutral-500 font-normal">
          最終目標：組織では生涯のパートナーを探し、そして国ではノーベル平和賞を目指します。
        </p>
      </section>

      {/* フッター */}
      <footer className="max-w-4xl mx-auto px-6 py-8 w-full text-center text-slate-300 dark:text-neutral-600">
        <p>© 2026 VNS masakinihirota - Value Network Service</p>
      </footer>
    </div>
  );
}
