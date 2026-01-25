"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

export const StartLinksSection = () => {
  const handleStart = (type: "gamification" | "normal") => {
    const message =
      type === "gamification"
        ? "【幽霊モード】\nはじまりの国へ転送します...\n(チュートリアル開始)"
        : "【ノーマルモード】\nプロフィール作成画面へ移動します...";

    // In a real app, this would use router.push()
    alert(message);
  };

  return (
    <section id="start" className="py-12 animate-fade-in-up delay-400">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-2">旅立ちの選択</h3>
        <p className="text-neutral-400">
          あなたのスタイルに合わせて、この世界への入り方を選んでください。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Gamification Start */}
        <button
          onClick={() => handleStart("gamification")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-8 text-left transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 border border-indigo-500/30 w-full"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/30">
                推奨
              </span>
              <h4 className="text-2xl font-bold text-white mb-2">
                ゲーミフィケーションでスタート
              </h4>
              <p className="text-indigo-200 text-sm mb-4">
                あなたは「幽霊」としてこの世界に降り立ちます。
                <br />
                女王様との対話や探索を通じて、少しずつVNS
                masakinihirotaの仕組みを学んでいきます。
              </p>
            </div>
            <div className="flex items-center text-indigo-300 font-bold group-hover:translate-x-2 transition-transform">
              <span>物語を始める</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </button>

        {/* Normal Start */}
        <button
          onClick={() => handleStart("normal")}
          className="group relative overflow-hidden rounded-2xl bg-zinc-900 p-8 text-left transition-all hover:scale-[1.02] hover:shadow-xl border border-zinc-800 hover:border-zinc-600 w-full"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-700/50 text-zinc-400 text-xs font-bold mb-4">
                Quick
              </span>
              <h4 className="text-2xl font-bold text-white mb-2">
                ノーマルスタート
              </h4>
              <p className="text-zinc-400 text-sm mb-4">
                すぐに活動を始められます。
                <br />
                既に目的が決まっている方や、システムに慣れている方向けの最短ルートです。
              </p>
            </div>
            <div className="flex items-center text-zinc-300 font-bold group-hover:translate-x-2 transition-transform">
              <span>登録へ進む</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
