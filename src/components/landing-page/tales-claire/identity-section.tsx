"use client";

/**
 * @file identity-section.tsx
 * @description LP 用の Identity Visualization セクション
 */

import { IdentityVisualizationContainer } from "@/components/identity-visualization";

/**
 * IdentitySection
 * 「サイトの目的」と「宣言」の間に配置される、アイデンティティの可視化セクション
 */
export const IdentitySection = () => {
  return (
    <section className="space-y-12 animate-fade-in-up delay-300">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-indigo-200 dark:to-blue-200">
          あなたの「千の仮面」を視覚化する
        </h2>
        <p className="text-lg text-slate-600 dark:text-indigo-200/80 max-w-2xl mx-auto leading-relaxed">
          幽霊状態のあなた（Root）から、さまざまな価値観に基づいた仮面（プロフィール）が生まれる仕組みを体験してください。
        </p>
      </div>

      <div className="w-full h-[800px] md:h-[900px] lg:h-[1000px] relative overflow-y-auto lg:overflow-visible">
        <IdentityVisualizationContainer />
      </div>
    </section>
  );
};
