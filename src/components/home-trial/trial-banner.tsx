"use client";

import { AlertCircle, Coins } from "lucide-react";

type Props = {
  points?: number;
};

export const TrialBanner = ({ points }: Props) => {
  return (
    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 text-sm flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 font-bold border rounded-lg border-amber-200 dark:border-amber-800 mb-6">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} />
        <span>お試し体験モード中：ブラウザ保存のみ</span>
      </div>
      {points !== undefined && (
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full text-amber-700 dark:text-amber-300">
          <Coins size={16} />
          <span>保有ポイント: {points.toLocaleString()} pt</span>
        </div>
      )}
    </div>
  );
};
