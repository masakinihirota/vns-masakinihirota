"use client";

import {
  MonitorSmartphone,
  UserCircle2,
  Sparkles,
  ArrowRight,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTrialEntry } from "./trial-entry.logic";

export const TrialEntrySection = () => {
  const { isPending, handleLocalModeStart } = useTrialEntry();

  return (
    <section className="font-sans w-full animate-fade-in-up delay-400">
      <div className="max-w-4xl mx-auto w-full px-4">
        {/* Title for Context */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-bold dark:text-white">
            さあ、あなたの「感動」を登録しましょう
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            スタイルに合わせた2つの入り口を用意しています。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trial Experience Card */}
          <div className="group relative p-[1px] bg-gradient-to-br from-emerald-400/50 to-teal-600/50 rounded-[2rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[1.9rem] p-8 md:p-10 h-full flex flex-col justify-between overflow-hidden relative">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                  <MonitorSmartphone size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  お試し体験
                  <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded text-emerald-600">
                    No Login
                  </span>
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  ユーザー登録不要。ブラウザ（Cookie）にのみデータを保存し、VNSの基本機能をすぐに体験できます。
                </p>
              </div>

              <button
                onClick={handleLocalModeStart}
                disabled={isPending}
                className="relative z-10 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg hover:shadow-emerald-500/30"
              >
                {isPending ? "準備中..." : "ゲートを開く"}
                <ArrowRight
                  size={18}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Official Member Card */}
          <div className="group relative p-[1px] bg-gradient-to-br from-indigo-500/50 to-blue-700/50 rounded-[2rem] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-[1.9rem] p-8 md:p-10 h-full flex flex-col justify-between overflow-hidden relative border border-transparent">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <UserCircle2 size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  正式メンバー
                  <Sparkles size={16} className="text-indigo-400" />
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  データをクラウドに安全に永続化。価値観マッチングやコミュニティへの参加、国づくりが可能です。
                </p>
              </div>

              <Link
                href="/login"
                className="relative z-10 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group/btn"
              >
                メンバー登録 / ログイン
                <ArrowRight
                  size={18}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info text */}
        <p className="text-center mt-12 text-sm text-slate-400 font-serif italic">
          「あなたの感動を、一生ものにするために。」
        </p>
      </div>
    </section>
  );
};
