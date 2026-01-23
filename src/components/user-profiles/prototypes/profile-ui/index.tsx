"use client";

import {
  Plus,
  Trash2,
  Heart,
  BookOpen,
  Bell,
  Settings,
  ChevronRight,
  Fingerprint,
} from "lucide-react";
import React, { useState } from "react";

interface MarkdownTableProps {
  headers: { label: string; className?: string }[];
  rows: { cells: { content: React.ReactNode; className?: string }[] }[];
  emptyMessage?: string;
  onAdd?: () => void;
}

const ProfileUI = () => {
  const [selectedCategory, setSelectedCategory] = useState("アニメ");

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
  const [evaluations] = useState([
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
  const [values] = useState([
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

  const getTierDisplay = (tier: string) => {
    switch (tier) {
      case "tier1":
        return "1";
      case "tier2":
        return "2";
      case "tier3":
        return "3";
      default:
        return "普";
    }
  };

  // Markdownスタイルの表コンポーネント
  const MarkdownTable = ({
    headers,
    rows,
    emptyMessage,
    onAdd,
  }: MarkdownTableProps) => (
    <div className="mb-6">
      <div className="overflow-x-auto border border-slate-300 dark:border-slate-700">
        <table className="w-full text-left border-collapse text-sm font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`border border-slate-300 dark:border-slate-700 px-4 py-2 font-bold text-slate-700 dark:text-slate-200 ${h.className || ""}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr
                  key={i}
                  className="bg-white dark:bg-slate-900 even:bg-slate-50/30"
                >
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className={`border border-slate-300 dark:border-slate-700 px-4 py-2 text-slate-600 dark:text-slate-300 align-top ${cell.className || ""}`}
                    >
                      {cell.content}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="border border-slate-300 dark:border-slate-700 px-4 py-8 text-center text-slate-400 italic"
                >
                  {emptyMessage || "データがありません"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-2 w-full py-2 flex items-center justify-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 transition-all group"
        >
          <Plus
            size={14}
            className="group-hover:scale-110 transition-transform"
          />
          <span>新規追加</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* HEADER */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-slate-900 dark:bg-slate-100 rounded px-2 py-1 text-white dark:text-slate-900 font-bold text-lg leading-none">
            <span className="tracking-tighter uppercase font-black">
              masakinihirota
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest">
            <span>DATA SHEET</span>
            <ChevronRight size={10} />
            <span className="text-slate-900 dark:text-white uppercase">
              {profile.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            {profile.stats.points.toLocaleString()} PT
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-8 pb-20">
        {/* PROFILE SUMMARY */}
        <section className="py-12 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {profile.name}
            </h1>
            <div className="flex gap-8">
              <StatBox label="信頼継続" value={`${profile.stats.trustDays}d`} />
              <StatBox label="制作作品数" value={profile.stats.works} />
              <StatBox label="総評価数" value={profile.stats.evals} />
            </div>
          </div>
        </section>

        {/* LISTS SECTION */}
        <div className="py-10 space-y-16">
          {/* 1. 自分自身が作った作品 */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
              <BookOpen size={14} className="text-blue-600" /> [
              自分自身が作った作品 ]
            </h2>
            <MarkdownTable
              headers={[
                { label: "作品タイトル" },
                { label: "カテゴリ", className: "w-32" },
                { label: "登録時期", className: "w-32 text-right" },
              ]}
              rows={myWorks.map((w) => ({
                cells: [
                  { content: <span className="font-bold">{w.title}</span> },
                  { content: w.category },
                  {
                    content: w.date,
                    className: "text-right font-mono text-xs",
                  },
                ],
              }))}
              onAdd={() => {}} // 自分自身が作った作品の追加
            />
          </section>

          {/* 2. 作品評価 */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Heart size={14} className="text-pink-500" /> [ 作品評価 ]
              </h2>

              {/* CATEGORY TABS */}
              <div className="flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden rounded">
                {["アニメ", "漫画"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-1.5 text-xs font-bold transition-colors border-r last:border-r-0 border-slate-300 dark:border-slate-700 ${
                      selectedCategory === cat
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {/* NOW - order: 今 -> 未来 -> 人生 */}
              <div>
                <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-0.5 rounded font-mono">
                  &gt; Now Watching (今の作品)
                </h3>
                <MarkdownTable
                  headers={[
                    { label: "Tier", className: "w-16 text-center font-mono" },
                    { label: "作品タイトル" },
                    { label: "", className: "w-10 text-right" },
                  ]}
                  rows={evaluations
                    .filter(
                      (e) =>
                        e.status === "now" && e.category === selectedCategory
                    )
                    .sort((a, b) => a.tier.localeCompare(b.tier))
                    .map((e) => ({
                      cells: [
                        {
                          content: getTierDisplay(e.tier),
                          className: "text-center font-bold",
                        },
                        {
                          content: <span className="font-bold">{e.title}</span>,
                        },
                        {
                          content: (
                            <button className="hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          ),
                          className: "text-right",
                        },
                      ],
                    }))}
                  emptyMessage="今の作品はありません"
                  onAdd={() => {}} // 「今」の作品追加
                />
              </div>

              {/* FUTURE */}
              <div>
                <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 w-fit px-2 py-0.5 rounded font-mono">
                  &gt; Future Expectations (未来の期待作)
                </h3>
                <MarkdownTable
                  headers={[
                    { label: "Tier", className: "w-16 text-center font-mono" },
                    { label: "作品タイトル" },
                    { label: "", className: "w-10 text-right" },
                  ]}
                  rows={evaluations
                    .filter(
                      (e) =>
                        e.status === "future" && e.category === selectedCategory
                    )
                    .sort((a, b) => a.tier.localeCompare(b.tier))
                    .map((e) => ({
                      cells: [
                        {
                          content: getTierDisplay(e.tier),
                          className: "text-center font-bold",
                        },
                        {
                          content: <span className="font-bold">{e.title}</span>,
                        },
                        {
                          content: (
                            <button className="hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          ),
                          className: "text-right",
                        },
                      ],
                    }))}
                  emptyMessage="未来の作品はありません"
                  onAdd={() => {}} // 「未来」の作品追加
                />
              </div>

              {/* LIFE */}
              <div>
                <h3 className="text-xs font-black mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/20 w-fit px-2 py-0.5 rounded font-mono">
                  &gt; Lifetime Best (人生の作品)
                </h3>
                <MarkdownTable
                  headers={[
                    { label: "Tier", className: "w-16 text-center font-mono" },
                    { label: "作品タイトル" },
                    { label: "", className: "w-10 text-right" },
                  ]}
                  rows={evaluations
                    .filter(
                      (e) =>
                        e.status === "life" && e.category === selectedCategory
                    )
                    .sort((a, b) => a.tier.localeCompare(b.tier))
                    .map((e) => ({
                      cells: [
                        {
                          content: getTierDisplay(e.tier),
                          className: "text-center font-bold",
                        },
                        {
                          content: <span className="font-bold">{e.title}</span>,
                        },
                        {
                          content: (
                            <button className="hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          ),
                          className: "text-right",
                        },
                      ],
                    }))}
                  emptyMessage="人生の作品はありません"
                  onAdd={() => {}} // 「人生」の作品追加
                />
              </div>
            </div>
          </section>

          {/* 3. 価値観 */}
          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
              <Fingerprint size={14} className="text-emerald-500" /> [ 価値観 ]
            </h2>
            <MarkdownTable
              headers={[
                { label: "カテゴリ", className: "w-32" },
                { label: "お題", className: "w-48" },
                { label: "選択した内容" },
                { label: "重要度", className: "w-20 text-center" },
              ]}
              rows={values.map((v) => ({
                cells: [
                  { content: v.category },
                  { content: <span className="font-bold">{v.topic}</span> },
                  {
                    content: (
                      <div className="flex flex-col space-y-1 py-1">
                        {v.answers.map((ans, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 leading-snug"
                          >
                            <span className="text-slate-400">•</span>
                            <span>{ans}</span>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    content: (
                      <span
                        className={
                          v.level === "重要"
                            ? "text-rose-500 font-bold"
                            : "text-slate-400"
                        }
                      >
                        {v.level}
                      </span>
                    ),
                    className: "text-center text-xs font-bold",
                  },
                ],
              }))}
              onAdd={() => {}} // 価値観の追加
            />
          </section>
        </div>

        {/* FOOTER */}
        <footer className="pt-16 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center font-mono">
          <div className="flex items-center gap-6">
            <span className="text-slate-300 font-black">VNS CORE ENGINE</span>
            <span>BUILD 2026.01.03</span>
            <span>MASAKINIHIROTA</span>
          </div>
          <div className="flex gap-8">
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 text-[9px]"
            >
              利用規約
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 text-[9px]"
            >
              人間宣言
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors underline underline-offset-4 text-[9px]"
            >
              オアシス宣言
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

// 統計表示用サブコンポーネント
const StatBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col gap-1">
    <div className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
      {value}
    </div>
    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none">
      {label}
    </div>
  </div>
);

export default ProfileUI;
