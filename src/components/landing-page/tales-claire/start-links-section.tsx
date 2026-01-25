"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

export const StartLinksSection = () => {
  const handleStart = () => {
    // In a real app, this would use router.push()
    alert("プロフィール作成画面へ移動します...");
  };

  return (
    <section id="start" className="py-12 animate-fade-in-up delay-400">
      <div className="flex justify-center max-w-4xl mx-auto px-4">
        <button
          onClick={handleStart}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-12 py-4 text-white text-lg font-bold transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30 ring-1 ring-white/20"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <span>普通に始める</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
};
