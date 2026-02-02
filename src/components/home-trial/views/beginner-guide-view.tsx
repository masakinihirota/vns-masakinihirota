"use client";

/**
 * 基本の使い方ビューコンポーネント (体験版)
 * 初心者向けの使い方ガイドを表示
 * 体験版ではアカウント関連の手順に取り消し線を適用
 */

import {
  ArrowRightLeft,
  ExternalLink,
  Globe,
  Layers,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AccountCard } from "../../home/start-page/root-account-card";
import { ProfileListTree } from "./profile-list-tree";

export function BeginnerGuideView() {
  type Step = {
    title: string;
    desc: string;
    icon: ReactNode;
    color: string;
    isRoot?: boolean;
    hasProfileTree?: boolean;
    hasMatchingLink?: boolean;
  };

  const steps: Step[] = [
    {
      title: "1. アカウントの作成",
      desc: "リアルな情報を入力(本人確認等)して作成します。主な目的は複数のプロフィールの管理です。",
      icon: <ShieldCheck size={28} />,
      color: "text-slate-800 dark:text-slate-200",
      isRoot: true,
    },
    {
      title: "2. プロフィールの作成",
      desc: "一言で言うと「目的別の名刺」です。このプロフィールにはあなたの価値観を入力します。目的（仕事、遊び、パートナー探しなど）毎に作成して、他のユーザーとのマッチングに使用します。",
      icon: <User size={28} />,
      color: "text-blue-500",
      hasProfileTree: true,
    },
    {
      title: "3. 作品・価値観・スキルの登録",
      desc: "今、追っかけている作品(「今」)、これから発売される作品(「未来」)、今まで生きてきた中で最高の作品(「人生」)を登録します。自分が持っている価値観、スキルを登録します。",
      icon: <Sparkles size={28} />,
      color: "text-amber-500",
    },
    {
      title: "4. 目的別マッチング",
      desc: "作成したプロフィールの情報を基に、目的ごとに似た価値観を持つ人を探します。複数の目的を1つのプロフィールで兼ねることができます。例えば、「仕事」と「パートナー探し」の両方の目的を1つのプロフィールでマッチングできます。",
      icon: <Target size={28} />,
      color: "text-red-500",
      hasMatchingLink: true,
    },
    {
      title: "5. グループの作成",
      desc: "グループはボトムアップ型の人の集まりです。マッチングで集めた人達で作ります。似たような価値観の人達と一緒に何かしたり、会話相手を探します。必ずリーダーになります。",
      icon: <Layers size={28} />,
      color: "text-blue-400",
    },
    {
      title: "6. 国を興す",
      desc: "国とはトップダウン型の人の集まりです。少数の条件で人を集めます。例えば「ものづくりの国」を興し、ものづくりに興味がある人達を集めます。",
      icon: <Globe size={28} />,
      color: "text-emerald-500",
    },
    {
      title: "7. コミュニティと自治",
      desc: "グループや国で問題が起こったときは（グループや国の）リーダーや調停者(メディエーター)が自治を行います。調停者は持ち回りで全員が行います。",
      icon: <Users size={28} />,
      color: "text-indigo-500",
    },
    {
      title: "8. マーケット＆イベント",
      desc: "モノ作りやイベントを開催します。国やグループで集めた人達と一緒に何かをします。",
      icon: <Store size={28} />,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* ヘッダーセクション */}
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-[36px] font-black text-slate-800 dark:text-neutral-100">
          基本の使い方
        </h2>
      </div>

      {/* ステップリスト */}
      <div className="space-y-20">
        {steps.map((step) => (
          <div
            key={step.title}
            className={cn(
              "flex flex-col md:flex-row gap-8 items-start relative transition-all duration-300",
              step.isRoot && "grayscale-[0.8]"
            )}
          >
            {/* アカウント用のオーバーレイ的な取り消し線（コンテンツ全体ではなくテキスト付近に限定するため、ここでは背景的な扱いにしない） */}
            {/* アイコン */}
            <div
              className={cn(
                `mt-2 flex-shrink-0 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800`,
                step.color
              )}
            >
              {step.icon}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 pb-12 border-b-4 border-slate-50 dark:border-neutral-800 last:border-0 w-full relative">
              <h4
                className={cn(
                  "text-[26px] font-black text-slate-800 dark:text-neutral-100 mb-4",
                  step.isRoot && "line-through"
                )}
              >
                {step.title}
              </h4>
              <p
                className={cn(
                  "text-slate-600 dark:text-neutral-400 leading-relaxed font-bold transition-all",
                  step.isRoot && "line-through text-slate-400 opacity-40"
                )}
              >
                {step.desc}
              </p>
              {step.isRoot && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl shadow-lg relative z-20">
                  <p className="text-red-600 dark:text-red-400 font-black text-[22px]">
                    ユーザー登録しないのでアカウントの作成はスキップします。
                  </p>
                </div>
              )}

              {/* アカウントカード（Step 1用） */}
              {step.isRoot && (
                <div className="mt-8">
                  <AccountCard isTrial={true} />
                </div>
              )}

              {/* プロフィールツリー（step 2のみ） */}
              {step.hasProfileTree && (
                <div className="mt-8 space-y-8">
                  <ProfileListTree />

                  {/* アクションボタン */}
                  <div className="flex justify-center md:justify-start">
                    <Link
                      href="/home-trial/profile-create"
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 dark:bg-indigo-600 text-white rounded-2xl font-black text-[18px] shadow-lg hover:shadow-blue-500/20 hover:bg-blue-700 dark:hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      <span>プロフィール作成ページへ</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}

              {/* マッチングページへのリンク（step 4用） */}
              {step.hasMatchingLink && (
                <div className="mt-8">
                  <div className="flex justify-center md:justify-start">
                    <Link
                      href="/home-trial/matching"
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-red-600 dark:bg-red-700 text-white rounded-2xl font-black text-[18px] shadow-lg hover:shadow-red-500/20 hover:bg-red-700 dark:hover:bg-red-800 transition-all active:scale-95"
                    >
                      <span>マッチングページへ</span>
                      <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTAボタン */}
      <div className="flex justify-center py-12">
        <button className="px-12 py-6 bg-blue-600 dark:bg-indigo-600 text-white font-black rounded-3xl hover:bg-blue-700 dark:hover:bg-indigo-700 hover:shadow-2xl transition-all flex items-center gap-4 active:scale-95 shadow-xl text-[20px]">
          プロフィールを作成して始める <ArrowRightLeft size={28} />
        </button>
      </div>
    </div>
  );
}
