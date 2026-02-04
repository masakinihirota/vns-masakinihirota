"use client";

import { ViewToggle } from "@/components/home/start-page/view-toggle";
import { TrialBanner } from "../trial-banner";
import { BeginnerGuideView } from "../views/beginner-guide-view";
import { LatestInfoView, PublicWork } from "../views/latest-info-view";
import { ViewMode } from "./home-trial.logic";

type Props = {
  viewMode: ViewMode;
  onToggleView: (mode: ViewMode) => void;
  points?: number;
  works?: PublicWork[];
};

export const HomeTrial = ({ viewMode, onToggleView, points, works }: Props) => {
  return (
    <div className="flex flex-col text-[18px]">
      <TrialBanner points={points} />

      <div className="flex items-center justify-end mb-8">
        <ViewToggle
          viewMode={viewMode as any}
          onViewModeChange={onToggleView as any}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow w-full">
        {viewMode === "latest" ? (
          <LatestInfoView works={works} />
        ) : (
          <BeginnerGuideView />
        )}
      </div>

      {/* 最終目標セクション */}
      <section className="w-full text-center border-t border-slate-50 dark:border-neutral-800 mt-10 pt-10">
        <p className="text-slate-700 dark:text-neutral-200 font-bold text-[16px]">
          最終目標：「生きる！」
          グループでは生涯のパートナーを探し、そして国ではノーベル平和賞を目指します。
        </p>
      </section>

      {/* フッター */}
      <footer className="w-full text-center text-slate-500 dark:text-neutral-200 py-8">
        <p>© 2026 VNS masakinihirota - Value Network Service</p>
      </footer>
    </div>
  );
};
