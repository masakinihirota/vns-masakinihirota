"use client";

import {
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DISCUSSION_ITEMS, DiscussionItem } from "./discussion-data";

export const dynamic = "force-static";

const DiscussionCard = ({ item }: { item: DiscussionItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`group relative bg-card border rounded-3xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl ${
        isExpanded
          ? "border-primary/50 ring-1 ring-primary/20"
          : "border-border hover:border-border/80"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4"
      >
        <div className="flex-1 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-1">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-lg text-muted-foreground line-clamp-1">
              批判者からの懸念：{item.critique}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-6 h-6 text-muted-foreground transition-transform duration-500 ${
            isExpanded ? "rotate-90 text-primary" : ""
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
            <div className="absolute -top-3 left-6 px-3 py-1 bg-rose-500 text-white text-base font-black tracking-widest uppercase rounded-full">
              Critique
            </div>
            <div className="flex gap-4">
              <span className="text-rose-500 font-black text-2xl mt-1 select-none">
                “
              </span>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.critique}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="h-12 w-px bg-gradient-to-b from-rose-200 to-teal-200 dark:from-rose-800 dark:to-teal-800" />
          </div>

          {/* Rebuttal Section */}
          <div className="relative p-6 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-100 dark:border-teal-900/50 shadow-inner">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-teal-600 text-white text-base font-black tracking-widest uppercase rounded-full">
              Rebuttal / VNS Philosophy
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-teal-600/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
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
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-card border-b pt-12 pb-16">
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-base font-black tracking-widest uppercase text-muted-foreground mb-6 border">
              <Zap className="w-3 h-3 text-primary" />
              Core Discussion
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-tight mb-8">
              議論: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-primary to-teal-500">
                批判と、その先の対話。
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              VNS の思想は、既存のSNSとは決定的に異なります。
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
        <div className="mt-32 p-12 bg-card border rounded-[3rem] text-center shadow-xl">
          <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl font-black text-foreground mb-6">
            対立ではなく、選択を。
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            私たちは、既存のSNSが持つ「自由」を否定しません。
            <br />
            しかし、その自由の影で傷つく人々がいることも無視しません。
            <br />
            VNSは「正しい世界」ではなく、あなたが選べる「もうひとつの世界」です。
          </p>
          <div className="flex justify-center gap-4">
            <div className="h-[2px] w-12 bg-primary/30 rounded-full mt-4" />
            <div className="h-[2px] w-4 bg-primary/50 rounded-full mt-4" />
            <div className="h-[2px] w-12 bg-primary/30 rounded-full mt-4" />
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="sticky bottom-8 flex justify-center pb-8 pointer-events-none">
        <Link
          href="/help/faq"
          className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform active:scale-95 border"
        >
          <MessageSquare className="w-5 h-5" />
          一般的なお問い合わせ（FAQ）はこちら
        </Link>
      </div>
    </div>
  );
}
