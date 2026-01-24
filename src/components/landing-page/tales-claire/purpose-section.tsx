"use client";

import React from "react";

export const PurposeSection = () => {
  const purposes = [
    {
      title: "安心で安全な場所を提供する",
      description: "(オアシス宣言 / No BAN Just Drift / 検索避け・パージ機能)",
    },
    {
      title: "目的ごとに使い分ける「複数の自分」を言葉にする",
      description: "(千の仮面 / プロフィール / ティア評価)",
    },
    {
      title: "自分に近い価値観を持った人を探す",
      description: "(価値観マッチング / 自動・手動マッチング)",
    },
    {
      title:
        "ボトムアップで気が合う仲間とグループを作り、話し相手や趣味仲間、相談相手を見つける",
      description: "(組織 / グループ / 調停者による自治)",
    },
    {
      title: "トップダウンで国を興し、仕事の受発注やイベントを行う",
      description: "(国 / マーケット / 銀行 / イベント)",
    },
    {
      title: "スキルを登録して仕事を獲得したり、他者に教えたりする",
      description:
        "(スキル登録 / マンダラチャート / ティーチングは国や組織の活動として実施)",
    },
  ];

  return (
    <section className="space-y-12 animate-fade-in-up delay-400">
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-blue-200">
          masakinihirotaの主な機能
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {purposes.map((item, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <h3 className="text-lg font-bold text-blue-100 mb-2 group-hover:text-white transition-colors">
              {item.title}
            </h3>
            <p className="text-indigo-200/80 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
