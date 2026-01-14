"use client";

import {
  ArrowLeft,
  Search,
  ChevronDown,
  MessageCircle,
  Zap,
  Info,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { CATEGORIES, FAQ_ITEMS } from "./faq-data";

const StructuralAnswer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:border-teal-500/50">
    <h4 className="text-teal-600 dark:text-teal-400 font-bold mb-3 flex items-center gap-2">
      <Zap className="w-4 h-4" />
      {title}
    </h4>
    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    const newOpenIds = new Set(openIds);
    if (newOpenIds.has(id)) {
      newOpenIds.delete(id);
    } else {
      newOpenIds.add(id);
    }
    setOpenIds(newOpenIds);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOpenIds(new Set());
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            ヘルプセンターに戻る
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1
                onClick={handleReset}
                className="text-3xl font-black text-slate-900 dark:text-white tracking-tight cursor-pointer hover:text-teal-600 transition-colors inline-block"
              >
                FAQ
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                VNS masakinihirotaの思想とシステムに関する疑問と回答
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="sticky top-6 z-10 space-y-4 mb-12">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col gap-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="質問内容を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500 dark:text-white transition-all shadow-inner"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === cat.id
                        ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-20">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <span className="text-teal-600 dark:text-teal-400 font-black text-xl leading-none pt-1">
                      Q.
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 transition-colors">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 mt-1 ${
                      openIds.has(item.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    openIds.has(item.id)
                      ? "max-h-[800px] pb-6 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                    <span className="text-rose-500 dark:text-rose-400 font-black text-xl leading-none pt-4">
                      A.
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed py-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                見つかりませんでした
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                検索ワードを変えてお試しください
              </p>
            </div>
          )}
        </div>

        {/* Structural Answers Section */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <Info className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              VNSの構造的回答
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <StructuralAnswer title="自浄作用：流動性による淘汰">
              不適切な組織からは立ち去り（Drift）、自分に合う場所へ移動する自由が保障されています。魅力のないコミュニティは「過疎化」という市場原理によって自然淘汰されます。
            </StructuralAnswer>
            <StructuralAnswer title="調停制度：解決のスピード優先">
              裁判所のような厳密さより、ピア（仲間）による「解決の速さ」を優先。持ち回り制（ローテーション）により特定の個人への負担と権力の固定化を防ぎます。
            </StructuralAnswer>
            <StructuralAnswer title="拍手のコスト：インフレ抑制">
              全ての反応に「1pt」のコストを設けることで、称賛の価値が薄れるのを防ぎます。ポイントは毎日自動回復するため、通常の使用において制限にはなりません。
            </StructuralAnswer>
            <StructuralAnswer title="多重構造：ゲーミフィケーション">
              複雑な階層構造は、段階的な解放（Progressive
              Disclosure）と演出によって「物語体験」として学習できるよう設計されています。
            </StructuralAnswer>
          </div>

          <div className="mt-12 p-8 bg-teal-500/5 border border-teal-500/20 rounded-3xl">
            <h3 className="text-xl font-black text-teal-700 dark:text-teal-400 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              結論
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
              VNS
              masakinihirotaは「完璧な正義」ではなく、「人間関係の不完全さ」を前提とした動的なエコシステムです。
              嫌なら逃げる（Drift）、合わないものは観測しない（シュレディンガーの猫主義）。生物的なアプローチによって全体の調和を保ちます。
            </p>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <AlertCircle className="w-10 h-10 text-teal-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            それでも解決しない場合は
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            運営チーム、またはお近くの「メディエーター」までご相談ください。
          </p>
        </div>
      </footer>
    </div>
  );
}
