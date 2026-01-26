"use client";

import { Fingerprint, Eye, BookOpen, ChevronRight, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function BeginningCountry(_props?: any) {
  const router = useRouter();

  const handleChoice = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020204] text-slate-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 sm:p-12 font-sans transition-colors duration-500">
      <div className="max-w-4xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="text-center space-y-6">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/20 mb-4 rotate-3 hover:rotate-0 transition-transform duration-500">
            <User size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight italic uppercase">
            はじまりの国{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Portal</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            ようこそ。あなたは今、この世界に降り立ったばかりの「幽霊」です。
            <br />
            これからどのようにこの世界を歩み始めるか、選んでください。
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* 1. プロフィールを作る */}
          <button
            onClick={() => handleChoice("/user-profiles/new")}
            className="group p-10 rounded-[2.5rem] bg-indigo-600 border-2 border-indigo-400 hover:scale-[1.02] transition-all shadow-2xl text-left flex items-center space-x-10"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shadow-lg shrink-0 group-hover:rotate-6 transition-transform">
              <Fingerprint className="text-white" size={40} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-white leading-none mb-3 italic uppercase tracking-tight">
                仮面の作成（プロフィール作成）
              </p>
              <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                あなたを定義する「仮面（プロフィール）」を作成し、この世界に実体として現れます。
              </p>
            </div>
            <ChevronRight
              size={40}
              className="text-white/50 group-hover:translate-x-2 transition-transform"
            />
          </button>

          {/* 2. 幽霊のまま見て回る */}
          <button
            onClick={() => handleChoice("/user-profiles/prototypes/complex")}
            className="group p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:scale-[1.02] transition-all shadow-xl text-left flex items-center space-x-10"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Eye className="text-slate-500 dark:text-zinc-400" size={40} />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-slate-800 dark:text-zinc-100 leading-none mb-3 italic uppercase tracking-tight">
                幽霊として彷徨う
              </p>
              <p className="text-slate-500 dark:text-zinc-500 text-lg leading-relaxed font-medium">
                プロフィールを作らず、閲覧者（幽霊）として2Dマップを探索します。
              </p>
            </div>
            <ChevronRight
              size={40}
              className="text-slate-400 group-hover:translate-x-2 transition-transform"
            />
          </button>

          {/* 3. チュートリアル */}
          <button
            onClick={() => handleChoice("/tutorial")}
            className="group p-10 rounded-[2.5rem] bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-100 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:scale-[1.02] transition-all shadow-xl text-left flex items-center space-x-10"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
              <BookOpen
                className="text-emerald-600 dark:text-emerald-400"
                size={40}
              />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black text-emerald-800 dark:text-emerald-100 leading-none mb-3 italic uppercase tracking-tight">
                導きの儀式（チュートリアル）
              </p>
              <p className="text-emerald-600 dark:text-emerald-400/60 text-lg leading-relaxed font-medium">
                導き手と共に、この世界のルールと歩き方を一から学びます。
              </p>
            </div>
            <ChevronRight
              size={40}
              className="text-emerald-500/50 group-hover:translate-x-2 transition-transform"
            />
          </button>
        </div>

        <footer className="text-center pt-8 border-t border-slate-200 dark:border-zinc-900">
          <p className="text-lg text-slate-400 dark:text-zinc-600 font-bold italic leading-snug">
            "不確かな存在を、愛おしく想います。"
          </p>
        </footer>
      </div>
    </div>
  );
}
