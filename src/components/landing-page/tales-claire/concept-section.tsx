"use client";

import React from "react";

export const ConceptSection = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-2xl space-y-8 animate-fade-in-up delay-200">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
          価値観でつながるネットワーク
        </h3>
        <p className="text-lg text-slate-700 dark:text-muted-foreground leading-relaxed">
          SNSが「社会的なつながり（Social）」を作る場所なら、
          <br className="hidden md:inline" />
          VNSは
          <strong className="text-blue-600 dark:text-blue-400 font-bold mx-1">
            「価値観（Value）」
          </strong>
          でつながる場所です。
        </p>
        <p className="text-lg text-slate-700 dark:text-muted-foreground leading-relaxed text-left max-w-2xl mx-auto">
          個人情報を晒すことなく、あなたの「好きな作品」「大切にしている価値観」だけを頼りに、
          本当に話が合う仲間や、心地よい居場所（組織・国）を見つけることができます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>🎭</span> 千の仮面
          </h4>
          <p className="text-sm text-slate-600 dark:text-neutral-400">
            仕事の顔、趣味の顔、家族との顔。人には複数の顔があります。
            VNSでは複数のプロフィール（仮面）を使い分け、それぞれのコミュニティで最適な自分を表現できます。
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>🐱</span> シュレディンガーの猫主義
          </h4>
          <p className="text-sm text-slate-600 dark:text-neutral-400">
            世界には相容れない価値観が存在します。それらを無理に統合して争うのではなく、
            観測する世界を分ける（住み分け）ことで、矛盾する正義を平和に共存させます。
          </p>
        </div>
      </div>
    </div>
  );
};
