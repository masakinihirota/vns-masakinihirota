"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { LocalModeButton } from "./local-mode-button";

export const StartLinksSection = () => {
  return (
    <section id="start" className="py-12 animate-fade-in-up delay-400">
      <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto px-4">
        {/* 2つの選択肢 */}
        {/* Mobile View: Stacked (Default) */}
        <div className="flex flex-col gap-8 w-full max-w-2xl md:hidden">
          {/* 1. ローカルモード (お試し) */}
          <div className="flex flex-col gap-4">
            <LocalModeButton />

            <div className="px-2">
              <table className="w-full text-lg text-left text-slate-600 dark:text-neutral-300">
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      保存先
                    </td>
                    <td className="py-2">
                      あなたのブラウザ
                      <br />
                      <span className="text-lg text-slate-500 dark:text-neutral-400">
                        (Cookie)
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      データ
                    </td>
                    <td className="py-2">
                      履歴削除で
                      <span className="text-red-500 dark:text-red-400 font-bold">
                        消えます
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      登録
                    </td>
                    <td className="py-2 font-bold text-emerald-600 dark:text-emerald-400">
                      不要
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. ユーザー登録 (ログイン) */}
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              prefetch={true}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-500 dark:to-blue-600 px-6 py-5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/40 ring-1 ring-white/20"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <LogIn className="w-6 h-6" />
                  <span>ユーザー登録</span>
                </div>
                <span className="text-lg text-indigo-100 font-medium tracking-wider">
                  データを永続化して楽しむ
                </span>
              </div>
            </Link>

            <div className="px-2">
              <table className="w-full text-lg text-left text-slate-600 dark:text-neutral-300">
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      保存先
                    </td>
                    <td className="py-2">クラウドサーバー</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      データ
                    </td>
                    <td className="py-2">
                      安全に
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        永続化
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold whitespace-nowrap text-slate-500 dark:text-neutral-400">
                      登録
                    </td>
                    <td className="py-2">必要 (メール/Google)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Desktop View: Aligned Rows with Left Labels */}
        <div className="hidden md:grid grid-cols-[auto_1fr_1fr] gap-x-8 gap-y-6 w-full max-w-4xl items-center text-lg">
          {/* Header Row (Buttons) */}
          <div className="text-right font-bold text-slate-400 dark:text-neutral-500 px-4"></div>
          <div className="w-full">
            <LocalModeButton />
          </div>
          <div className="w-full">
            <Link
              href="/login"
              prefetch={true}
              className="block group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-500 dark:to-blue-600 px-6 py-5 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/40 ring-1 ring-white/20"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 font-bold text-xl">
                  <LogIn className="w-6 h-6" />
                  <span>ユーザー登録</span>
                </div>
                <span className="text-lg text-indigo-100 font-medium tracking-wider">
                  データを永続化して楽しむ
                </span>
              </div>
            </Link>
          </div>

          {/* Row: 保存先 */}
          <div className="text-right font-bold text-slate-500 dark:text-neutral-400 px-4 whitespace-nowrap">
            保存先
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            あなたのブラウザ{" "}
            <span className="text-lg text-slate-500 dark:text-neutral-400">
              (Cookie)
            </span>
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            クラウドサーバー
          </div>

          {/* Row: データ */}
          <div className="text-right font-bold text-slate-500 dark:text-neutral-400 px-4 whitespace-nowrap">
            データ
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            履歴削除で
            <span className="text-red-500 dark:text-red-400 font-bold ml-1">
              消えます
            </span>
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            安全に
            <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">
              永続化
            </span>
          </div>

          {/* Row: 登録 */}
          <div className="text-right font-bold text-slate-500 dark:text-neutral-400 px-4 whitespace-nowrap">
            登録
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              不要
            </span>{" "}
            (すぐに開始)
          </div>
          <div className="px-4 py-2 border-l border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-300">
            必要 (メール/Google)
          </div>
        </div>

        <p className="text-lg md:text-xl text-slate-600 dark:text-muted-foreground font-serif italic mt-4">
          あなたの「感動」を、一生ものにするために。
        </p>
      </div>
    </section>
  );
};
