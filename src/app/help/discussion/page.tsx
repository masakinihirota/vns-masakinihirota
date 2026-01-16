"use client";

import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  AlertTriangle,
  Zap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { DISCUSSION_ITEMS, DiscussionItem } from "./discussion-data";

const DiscussionCard = ({ item }: { item: DiscussionItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border rounded-3xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl ${
        isExpanded
          ? "border-teal-500/50 ring-1 ring-teal-500/20"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4"
      >
        <div className="flex-1 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-1">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-teal-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
              批判者からの懸念：{item.critique}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-6 h-6 text-slate-400 transition-transform duration-500 ${
            isExpanded ? "rotate-90 text-teal-500" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-8 md:px-8 md:pb-10 space-y-8">
          {/* Critique Section */}
          <div className="relative p-6 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/50">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-rose-500 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
              Critique
            </div>
            <div className="flex gap-4">
              <span className="text-rose-500 font-black text-2xl mt-1 select-none">
                “
              </span>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.critique}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-12 w-px bg-gradient-to-b from-rose-200 to-teal-200 dark:from-rose-800 dark:to-teal-800" />
          </div>

          {/* Rebuttal Section */}
          <div className="relative p-6 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/50 shadow-inner">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-teal-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full">
              Rebuttal / VNS Philosophy
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-teal-600/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                {item.rebuttal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DiscussionPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-teal-500/30">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-6">
          <Link
            href="/help"
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ヘルプセンターに戻る
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-6 border border-slate-200 dark:border-slate-700">
              <Zap className="w-3 h-3 text-teal-500" />
              Core Discussion
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-8">
              議論: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                批判と、その先の対話。
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              VNS masakinihirotaの思想は、既存のSNSとは決定的に異なります。
              <br />
              寄せられる代表的な批判に対し、私たちは誠実に、そして論理的に回答します。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid gap-6">
          {DISCUSSION_ITEMS.map((item) => (
            <DiscussionCard key={item.id} item={item} />
          ))}
        </div>

        {/* Footer Concept */}
        <div className="mt-32 p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] text-center shadow-xl shadow-slate-200/50 dark:shadow-none">
          <ShieldAlert className="w-16 h-16 text-teal-600 mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
            対立ではなく、選択を。
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            私たちは、既存のSNSが持つ「自由」を否定しません。
            <br />
            しかし、その自由の影で傷つく人々がいることも無視しません。
            <br />
            VNSは「正しい世界」ではなく、あなたが選べる「もうひとつの世界」です。
          </p>
          <div className="flex justify-center gap-4">
            <div className="h-[2px] w-12 bg-teal-500/30 rounded-full mt-4" />
            <div className="h-[2px] w-4 bg-teal-500/50 rounded-full mt-4" />
            <div className="h-[2px] w-12 bg-teal-500/30 rounded-full mt-4" />
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="sticky bottom-8 flex justify-center pb-8 pointer-events-none">
        <Link
          href="/help/faq"
          className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95 border border-white/10 dark:border-slate-200"
        >
          <MessageSquare className="w-5 h-5" />
          一般的なお問い合わせ（FAQ）はこちら
        </Link>
      </div>
    </div>
  );
}
