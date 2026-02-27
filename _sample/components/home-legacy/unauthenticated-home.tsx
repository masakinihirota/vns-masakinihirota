"use client";

import { ArrowRight, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

export const UnauthenticatedHome = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020204] text-slate-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-4">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 mb-4 animate-bounce">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            VNS{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Portal</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-zinc-500 font-medium">
            昨日僕が感動した作品を、
            <br className="sm:hidden" />
            今日の君はまだ知らない。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/landing-page"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-lg"
          >
            <span>ランディングページを見る</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <LogIn className="w-5 h-5" />
            <span>ログインする</span>
          </Link>
        </div>

        <p className="text-sm text-slate-400 dark:text-zinc-600 font-medium pt-8">
          ※このサービスを利用するには、アカウント作成とログインが必要です。
        </p>
      </div>
    </div>
  );
};
