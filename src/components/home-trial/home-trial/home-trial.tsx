"use client";

import { AlertCircle } from "lucide-react";
import { ViewToggle } from "@/components/home/start-page/view-toggle";
import { BeginnerGuideView } from "../views/beginner-guide-view";
import { LatestInfoView } from "../views/latest-info-view";
import { ViewMode } from "./home-trial.logic";

type Props = {
  viewMode: ViewMode;
  onToggleView: (mode: ViewMode) => void;
};

export const HomeTrial = ({ viewMode, onToggleView }: Props) => {
  return (
    <div className="flex flex-col text-[18px]">
      {/* お試しモード警告バー */}
      <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 text-sm flex items-center justify-center gap-2 font-bold border rounded-lg border-amber-200 dark:border-amber-800 mb-6">
        <AlertCircle size={16} />
        <span>
          お試し体験モード中：データはこのブラウザにのみ保存されます。キャッシュをクリアするとデータは消失します。
        </span>
      </div>

      <div className="flex items-center justify-end mb-8">
        <ViewToggle
          viewMode={viewMode as any}
          onViewModeChange={onToggleView as any}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-grow w-full">
        {viewMode === "latest" ? <LatestInfoView /> : <BeginnerGuideView />}
      </div>

      {/* 最終目標セクション */}
      <section className="w-full text-center border-t border-slate-50 dark:border-neutral-800 mt-10 pt-10">
        <p className="text-slate-400 dark:text-neutral-500 font-normal">
          最終目標：「生きる！」
          グループでは生涯のパートナーを探し、そして国ではノーベル平和賞を目指します。
        </p>
      </section>

      {/* フッター */}
      <footer className="w-full text-center text-slate-300 dark:text-neutral-600 py-8">
        <p>© 2026 VNS masakinihirota - Value Network Service</p>
      </footer>
    </div>
  );
};
