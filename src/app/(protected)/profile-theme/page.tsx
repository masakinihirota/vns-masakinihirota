"use client";

import { Palette } from "lucide-react";
import React, { useState } from "react";
import {
  ProfileHeader,
  ProfileBasicInfo,
  ProfileWorksList,
  ProfileEvaluations,
  ProfileValues,
  Evaluation,
  ValueItem,
  ProfileVariant,
} from "@/components/profile";

export default function ProfilePage() {
  const [variant, setVariant] = useState<ProfileVariant>("default");

  // Theme definitions for page background/layout
  const getPageStyles = () => {
    switch (variant) {
      case "cyber":
        return "min-h-screen bg-black text-cyan-400 font-mono selection:bg-cyan-500 selection:text-black";
      case "pop":
        return "min-h-screen bg-yellow-50 text-black font-sans selection:bg-black selection:text-white";
      case "elegant":
        return "min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-serif relative";
      case "glass":
        return "min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-sans selection:bg-white selection:text-purple-600";
      default:
        return "min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans";
    }
  };

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
    <div className={getPageStyles()}>
      {/* Theme Overlay for Glass Effect */}
      {variant === "glass" && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-[-1]" />
      )}

      {/* Theme Switcher (Generic overlay for demo) */}
      <div
        className={`fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-lg ${
          variant === "default"
            ? "bg-white border border-slate-200 text-slate-900"
            : variant === "cyber"
              ? "bg-black border border-cyan-500 text-cyan-400"
              : variant === "pop"
                ? "bg-white border-4 border-black text-black"
                : variant === "elegant"
                  ? "bg-white border border-slate-200 text-slate-800"
                  : "bg-white/20 backdrop-blur-md border border-white/40 text-white"
        }`}
      >
        <div className="flex items-center gap-2 px-2">
          <Palette size={20} />
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as ProfileVariant)}
            className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer p-1"
          >
            <option value="default">Default (Modern)</option>
            <option value="cyber">Cyberpunk (Neon)</option>
            <option value="pop">Pop (Brutalist)</option>
            <option value="elegant">Elegant (Serif)</option>
            <option value="glass">Glassmorphism</option>
          </select>
        </div>
      </div>

      {/* ヘッダー */}
      <ProfileHeader
        userName={profile.name}
        points={profile.stats.points}
        variant={variant}
      />

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-8 pb-20 pt-4">
        {/* プロフィール基本情報 */}
        <ProfileBasicInfo
          name={profile.name}
          stats={profile.stats}
          variant={variant}
        />

        {/* リストセクション */}
        <div className="py-10 space-y-16">
          {/* 1. 自分自身が作った作品 */}
          <ProfileWorksList
            works={myWorks}
            onAdd={() => {
              /* Add work */
            }}
            variant={variant}
          />

          {/* 2. 作品評価 */}
          <ProfileEvaluations
            evaluations={evaluations}
            onAdd={() => {
              /* Add evaluation */
            }}
            variant={variant}
          />

          {/* 3. 価値観 */}
          <ProfileValues
            values={values}
            onAdd={() => {
              /* Add value */
            }}
            variant={variant}
          />
        </div>

        {/* フッター */}
        <footer
          className={`pt-16 border-t text-[10px] font-bold uppercase tracking-[0.2em] flex justify-between items-center font-mono ${
            variant === "cyber"
              ? "border-cyan-900 text-cyan-700"
              : variant === "pop"
                ? "border-black text-black"
                : variant === "elegant"
                  ? "border-slate-200 dark:border-slate-800 text-slate-400"
                  : variant === "glass"
                    ? "border-white/20 text-white/50"
                    : "border-slate-200 dark:border-slate-800 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-6">
            <span
              className={
                variant === "cyber"
                  ? "text-cyan-500 font-black"
                  : variant === "glass"
                    ? "text-white"
                    : "text-slate-300 font-black"
              }
            >
              VNS CORE ENGINE
            </span>
            <span>BUILD 2026.01.03</span>
            <span>MASAKINIHIROTA</span>
          </div>
          <div className="flex gap-8">
            <a
              href="#"
              className="hover:underline underline-offset-4 text-[9px]"
            >
              利用規約
            </a>
            <a
              href="#"
              className="hover:underline underline-offset-4 text-[9px]"
            >
              人間宣言
            </a>
            <a
              href="#"
              className="hover:underline underline-offset-4 text-[9px]"
            >
              オアシス宣言
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
