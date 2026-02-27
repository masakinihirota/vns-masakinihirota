"use client";

import { HelpCircle, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { performLogout } from "@/hooks/use-validated-trial-data";

interface GlobalNavProperties {
  readonly isDarkMode: boolean;
  readonly toggleDarkMode: () => void;
}

/**
 * グローバルナビゲーションバー
 * アプリ全体の主要な機能へのアクセスと設定を提供します。
 * @param root0
 * @param root0.isDarkMode
 * @param root0.toggleDarkMode
 */
export const GlobalNav = ({
  isDarkMode,
  toggleDarkMode,
}: GlobalNavProperties) => {
  const router = useRouter();

  // ログアウト処理
  const handleLogout = async () => {
    const result = await performLogout();
    if (result.success) {
      // ログアウト成功時にログアウト画面へリダイレクト
      router.push("/logout");
    } else {
      console.error("Logout failed:", result.error);
      // エラーでもログアウト画面へリダイレクト
      router.push("/logout");
    }
  };
  return (
    <nav
      data-testid="global-nav"
      aria-label="メインナビゲーション"
      className="w-16 flex flex-col items-center py-6 bg-white dark:bg-[#0B0F1A] border-r border-slate-200 dark:border-white/10 z-20 transition-colors duration-200"
    >
      <div className="flex-1 flex flex-col items-center gap-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
          <User size={24} />
        </div>

        <div className="flex flex-col items-center gap-6 text-slate-400 dark:text-neutral-500">
          <button className="p-2 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            <Settings size={22} />
            <span className="sr-only">Settings</span>
          </button>
          <button className="p-2 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            <HelpCircle size={22} />
            <span className="sr-only">Help</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 dark:text-neutral-500 hover:text-red-500 transition-colors"
          aria-label="Logout"
        >
          <LogOut size={22} />
          <span className="sr-only">Logout</span>
        </button>
      </div>
    </nav>
  );
};
