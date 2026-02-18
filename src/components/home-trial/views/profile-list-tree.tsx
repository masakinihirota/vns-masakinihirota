"use client";

/**
 * プロフィール構造のリスト形式ツリーコンポーネント (体験版)
 * アカウントと目的別プロフィールの階層構造を視覚化
 * 体験版ではアカウントに取り消し線を適用
 */

import { Briefcase, Gamepad2, Heart, Plus } from "lucide-react";
import { AccountCard } from "../../home/start-page/root-account-card";

export function ProfileListTree() {
  return (
    <div className="mt-8 p-6 md:p-10 bg-slate-50 dark:bg-neutral-900/50 rounded-3xl border border-slate-100 dark:border-neutral-800 backdrop-blur-sm">
      <div className="flex flex-col gap-0">
        {/* アカウントエリア - 体験版のため取り消し線適用 */}
        <AccountCard isSimple={true} isTrial={true} />

        {/* 縦セパレーター */}
        <div className="ml-10 h-10 border-l-4 border-slate-300 dark:border-neutral-700" />

        {/* 目的別プロフィールコンテナ */}
        <div className="ml-10 border-l-4 border-blue-200 dark:border-blue-900 pl-8 flex flex-col gap-6 pb-4">
          <div className="mb-2">
            <span className="text-[18px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-900">
              目的別プロフィール
            </span>
          </div>

          {/* 仕事プロフィール */}
          <div className="relative flex items-center">
            <div className="absolute -left-[36px] w-8 h-1 bg-blue-200 dark:bg-blue-900" />
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-4 p-4 border-2 border-blue-100 dark:border-blue-900 rounded-xl bg-white dark:bg-neutral-900 shadow-sm w-full md:w-auto hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Briefcase size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 dark:text-neutral-300">
                    仕事が目的のプロフィール(未作成)
                  </span>
                  <span className="text-xs text-slate-400">
                    仕事用・クリエイター
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 遊びプロフィール */}
          <div className="relative flex items-center">
            <div className="absolute -left-[36px] w-8 h-1 bg-blue-200 dark:bg-blue-900" />
            <div className="flex items-center gap-4 p-4 border-2 border-emerald-100 dark:border-emerald-900 rounded-xl bg-white dark:bg-neutral-900 shadow-sm w-full md:w-auto hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Gamepad2 size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 dark:text-neutral-300">
                  遊びが目的のプロフィール(未作成)
                </span>
                <span className="text-xs text-slate-400">趣味・エンタメ</span>
              </div>
            </div>
          </div>

          {/* パートナー探しプロフィール */}
          <div className="relative flex items-center">
            <div className="absolute -left-[36px] w-8 h-1 bg-blue-200 dark:bg-blue-900" />
            <div className="flex items-center gap-4 p-4 border-2 border-rose-100 dark:border-rose-900 rounded-xl bg-white dark:bg-neutral-900 shadow-sm w-full md:w-auto hover:border-rose-400 dark:hover:border-rose-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Heart size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-700 dark:text-neutral-300">
                  パートナー探しが目的のプロフィール(未作成)
                </span>
                <span className="text-xs text-slate-400">出会い・交流</span>
              </div>
            </div>
          </div>

          {/* 上限インジケーター */}
          <div className="relative flex items-center gap-4 italic text-slate-400 dark:text-neutral-400 pt-2">
            <div className="absolute -left-[36px] w-8 h-1 bg-blue-200 dark:bg-blue-900" />
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
              <Plus size={22} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-500 dark:text-neutral-300">
                ...その他、最大1000個まで自由に作成可能
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-slate-600 dark:text-neutral-200 leading-relaxed bg-white/60 dark:bg-neutral-900/60 p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 font-medium backdrop-blur-sm">
        プロフィールはあなたの「仮面」です。目的ごとに使い分けます。
      </p>
    </div>
  );
}
