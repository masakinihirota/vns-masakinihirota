"use client";

/**
 * 基本の使い方ビューコンポーネント (体験版)
 * 初心者向けの使い方ガイドを表示
 * 体験版ではルートアカウント関連の手順に取り消し線を適用
 */

import {
  ArrowRightLeft,
  Globe,
  Layers,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileListTree } from "./profile-list-tree";

export function BeginnerGuideView() {
  const steps = [
    {
      title: "1. ルートアカウントの役割",
      desc: "ルートアカウントはあなたの本拠地です。プロフィールの全体管理、現実の情報（母語・居住地）、ポイント、そして非常時に必要な重要情報を司ります。",
      icon: <ShieldCheck size={28} />,
      color: "text-slate-800 dark:text-slate-200",
      isRoot: true,
    },
    {
      title: "2. プロフィールの作成（千の仮面）",
      desc: "プロフィールはあなたの価値観です。サイト内での目的（仕事、遊び、パートナー探しなど）毎に最大1000個まで作成でき、目的毎にマッチングが可能です。",
      icon: <User size={28} />,
      color: "text-blue-500",
      hasProfileTree: true,
    },
    {
      title: "3. 作品・価値観・スキルの登録",
      desc: "プロフィールに、自らの作品や「今・未来・人生」で好きな作品リスト、価値観、スキルを登録します。この情報を利用してマッチングを行います。",
      icon: <Sparkles size={28} />,
      color: "text-amber-500",
    },
    {
      title: "4. 目的別マッチング",
      desc: "作成したプロフィールの情報を基に、目的ごとに似た価値観を持つ人を探します。複数の目的を1つのプロフィールで利用することも可能です。例えば、「仕事」と「パートナー探し」の両方の目的を1つのプロフィールからマッチングすることも可能です。",
      icon: <Target size={28} />,
      color: "text-red-500",
    },
    {
      title: "5. 組織の作成",
      desc: "組織とはボトムアップ型の人の集まりです。組織のメンバーは、マッチングして似たような価値観を持つ相手を見つけて、共通の目的を持つ組織へメンバーとして誘ったり、その組織に入ったりします。組織では、メンバー共通のTier表が表示されます。作品の評価の比較だったり、価値観の比較をしたりして、相手のことを理解して会話のきっかけなどにします。",
      icon: <Layers size={28} />,
      color: "text-blue-400",
    },
    {
      title: "6. コミュニティと自治",
      desc: "価値観の合った人をフォローしたり組織のメンバーになったり。ルールの策定などの自治に参画し、平和な世界（オアシス）を共に広げていきます。",
      icon: <Users size={28} />,
      color: "text-indigo-500",
    },
    {
      title: "7. 国を興す",
      desc: "国とはトップダウン型の人の集まりです。国は組織とは違い、プロフィールのマッチングでメンバーを集めません。国は少数の条件を掲げ同じ目的を持った人達を集めます。そうやって国に人を集めていきます。国を興すと、国独自のルールを策定したりできます。",
      icon: <Globe size={28} />,
      color: "text-emerald-500",
    },
    {
      title: "8. マーケット＆イベント",
      desc: "国でものをつくる人や、イベントを開催します。人と一緒に何かをします。",
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
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col md:flex-row gap-8 items-start relative transition-all duration-300",
              step.isRoot && "grayscale-[0.8]"
            )}
          >
            {/* ルートアカウント用のオーバーレイ的な取り消し線（コンテンツ全体ではなくテキスト付近に限定するため、ここでは背景的な扱いにしない） */}
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
                    ユーザー登録しないのでルートアカウントの作成はスキップします。
                  </p>
                </div>
              )}

              {/* プロフィールツリー（step 2のみ） */}
              {step.hasProfileTree && (
                <div className="mt-8">
                  <ProfileListTree />
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
