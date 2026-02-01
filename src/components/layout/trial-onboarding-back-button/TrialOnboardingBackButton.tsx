"use client";

import { Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TrialStorage } from "@/lib/trial-storage";

/**
 * お試し体験（トライアルモード）の復帰ボタン
 *
 * 役割:
 * - ユーザーがお試し体験中にオンボーディングの選択画面（/onboarding-trial/choice）から離れた際、
 *   すぐに戻れるように目立つボタンを画面右下に表示する。
 *
 * 表示条件:
 * - TrialStorage に rootAccount が存在すること（お試し体験中）
 * - 現在のパスが /onboarding-trial/choice ではないこと
 */
export function TrialOnboardingBackButton() {
  const pathname = usePathname();
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const checkTrial = () => {
      const data = TrialStorage.load();
      setIsTrial(!!data?.rootAccount);
    };
    checkTrial();

    // ストレージの変更を監視（オプション、今回は簡易実装）
    window.addEventListener("storage", checkTrial);
    return () => window.removeEventListener("storage", checkTrial);
  }, []);

  // 表示条件:
  // 1. トライアル中であること (isTrial)
  // 2. 現在のパスが「チュートリアル」または「ゴーストモード」の配下であること
  //    (ユーザー要望: "チュートリアル中に途中でやめたい場合のみ表示")
  // ※ ホーム(/)やプロフィール作成(/profile)などでは表示しない
  // ※ /tutorial/story は専用のUIで表示するため除外
  const isTargetPage =
    (pathname?.startsWith("/tutorial") && pathname !== "/tutorial/story") ||
    pathname?.startsWith("/ghost");

  if (!isTrial || !isTargetPage) {
    return null;
  }

  return (
    <div className="fixed top-20 right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
      <TrialBackButtonContent />
    </div>
  );
}

export function TrialBackButtonContent() {
  return (
    <Link href="/onboarding-trial/choice">
      <div className="group relative flex items-center gap-3">
        {/* 背景装飾（アニメーション削除） */}
        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 scale-110" />

        {/* ボタン本体 */}
        <button
          className="relative flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full
                   shadow-[0_8px_30px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.6)]
                   border border-white/20 backdrop-blur-md transition-all duration-300 transform group-hover:scale-105 active:scale-95"
          aria-label="旅の選択に戻る"
        >
          <div className="flex h-8 w-8 items-center justify-center bg-white/20 rounded-full">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Return to
            </span>
            <span className="text-lg font-black whitespace-nowrap">
              旅の選択に戻る
            </span>
          </div>
        </button>

        {/* ツールチップ（モバイル配慮で通常表示でも可） */}
        <div className="absolute -top-10 right-0 px-3 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          いつでも旅の詳細を選び直せます
        </div>
      </div>
    </Link>
  );
}
