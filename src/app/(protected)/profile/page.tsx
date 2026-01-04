"use client";

import React, { useState } from "react";
import {
  ProfileHeader,
  ProfileBasicInfo,
  ProfileWorksList,
  ProfileEvaluations,
  ProfileValues,
  Evaluation,
  ValueItem,
} from "@/components/profile";

export default function ProfilePage() {
  // 基本プロフィール
  const [profile] = useState({
    name: "マサキ・ニヒロタ",
    stats: { works: 12, evals: 145, trustDays: 420, points: 12500 },
  });

  // 自分自身が作った作品 (My Creations)
  const [myWorks] = useState([
    { id: 1, title: "オアシス宣言：第1章", category: "漫画", date: "2025-10" },
    { id: 2, title: "VNSの夜明け", category: "アニメ", date: "2025-12" },
    { id: 3, title: "境界のアルゴリズム", category: "漫画", date: "2026-01" },
  ]);

  // 作品評価 (Evaluations)
  const [evaluations] = useState<Evaluation[]>([
    {
      id: 1,
      title: "カウボーイビバップ",
      category: "アニメ",
      status: "life",
      tier: "tier1",
    },
    { id: 2, title: "寄生獣", category: "漫画", status: "life", tier: "tier1" },
    {
      id: 3,
      title: "攻殻機動隊 S.A.C.",
      category: "アニメ",
      status: "life",
      tier: "tier1",
    },
    {
      id: 4,
      title: "最新のSFアニメX",
      category: "アニメ",
      status: "now",
      tier: "tier2",
    },
    {
      id: 5,
      title: "日常の断片",
      category: "漫画",
      status: "now",
      tier: "tier3",
    },
    {
      id: 6,
      title: "2026年期待作α",
      category: "アニメ",
      status: "future",
      tier: "tier1",
    },
    {
      id: 7,
      title: "SF新連載：βの夜",
      category: "漫画",
      status: "future",
      tier: "tier2",
    },
    {
      id: 8,
      title: "プラネテス",
      category: "アニメ",
      status: "life",
      tier: "tier1",
    },
    {
      id: 9,
      title: "あまり合わなかった作品A",
      category: "アニメ",
      status: "life",
      tier: "normal",
    },
    {
      id: 10,
      title: "サイバーパンク エッジランナーズ",
      category: "アニメ",
      status: "now",
      tier: "tier1",
    },
  ]);

  // 価値観データ
  const [values] = useState<ValueItem[]>([
    {
      id: 1,
      category: "基礎の基礎",
      topic: "インターネットへの接続",
      answers: [
        "義務です",
        "権利です",
        "人権です",
        "人と切っては切り離せないものです。",
      ],
      level: "重要",
    },
    {
      id: 2,
      category: "生き方",
      topic: "生活習慣",
      answers: ["朝型", "健康志向"],
      level: "通常",
    },
    {
      id: 3,
      category: "仕事",
      topic: "コミュニケーション様式",
      answers: ["非同期中心", "ドキュメント重視", "テキストベース"],
      level: "重要",
    },
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* ヘッダー */}
      <ProfileHeader userName={profile.name} points={profile.stats.points} />

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-8 pb-20 pt-4">
        {/* プロフィール基本情報 */}
        <ProfileBasicInfo name={profile.name} stats={profile.stats} />

        {/* リストセクション */}
        <div className="py-10 space-y-16">
          {/* 1. 自分自身が作った作品 */}
          <ProfileWorksList
            works={myWorks}
            onAdd={() => {
              /* Add work */
            }}
          />

          {/* 2. 作品評価 */}
          <ProfileEvaluations
            evaluations={evaluations}
            onAdd={() => {
              /* Add evaluation */
            }}
          />

          {/* 3. 価値観 */}
          <ProfileValues
            values={values}
            onAdd={() => {
              /* Add value */
            }}
          />
        </div>

        {/* フッター */}
        <footer className="pt-16 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center font-mono">
          <div className="flex items-center gap-6">
            <span className="text-slate-300 font-black">VNS CORE ENGINE</span>
            <span>BUILD 2026.01.03</span>
            <span>MASAKINIHIROTA</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
