"use client";

import { MonitorSmartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const LocalModeButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLocalModeStart = () => {
    startTransition(async () => {
      // ローカルモード用クッキーを設定 (有効期限: 1年)
      document.cookie =
        "local_mode=true; path=/; max-age=31536000; SameSite=Lax";

      try {
        const response = await fetch("/api/auth/anonymous", {
          method: "POST",
        });
        const result = await response.json();

        if (result.success) {
          // オンボーディングの起点へ遷移
          router.push(result.redirect || "/home-trial");
          router.refresh();
        } else {
          console.error("Anonymous login failed:", result.error);
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred during anonymous login:",
          error
        );
      }
    });
  };

  return (
    <button
      onClick={handleLocalModeStart}
      disabled={isPending}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100/50 to-teal-100/50 dark:from-emerald-600 dark:to-teal-500 border border-emerald-500/30 dark:border-emerald-400/50 hover:border-emerald-500/50 px-6 py-5 text-emerald-900 dark:text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/40 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-800 dark:text-emerald-50">
          <MonitorSmartphone className="w-6 h-6" />
          <span>お試し体験(入口)</span>
        </div>
        <span className="text-lg text-emerald-700/80 dark:text-emerald-100 font-medium tracking-wider">
          {isPending ? "開始中..." : "ユーザー登録不要"}
        </span>
      </div>
    </button>
  );
};
