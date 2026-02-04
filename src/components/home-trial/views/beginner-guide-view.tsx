"use client";

/**
 * 基本の使い方ビューコンポーネント (体験版)
 * 初心者向けの使い方ガイドを表示
 * 体験版ではアカウント関連の手順に取り消し線を適用
 */

import {
  ArrowRightLeft,
  Check,
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
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AccountCard } from "../../home/start-page/root-account-card";
import { ProfileListTree } from "./profile-list-tree";

// 星座の定義
const ZODIAC_SIGNS = [
  { value: "aries", label: "牡羊座 (3/21-4/19)" },
  { value: "taurus", label: "牡牛座 (4/20-5/20)" },
  { value: "gemini", label: "双子座 (5/21-6/21)" },
  { value: "cancer", label: "蟹座 (6/22-7/22)" },
  { value: "leo", label: "獅子座 (7/23-8/22)" },
  { value: "virgo", label: "乙女座 (8/23-9/22)" },
  { value: "libra", label: "天秤座 (9/23-10/23)" },
  { value: "scorpio", label: "蠍座 (10/24-11/22)" },
  { value: "sagittarius", label: "射手座 (11/23-12/21)" },
  { value: "capricorn", label: "山羊座 (12/22-1/19)" },
  { value: "aquarius", label: "水瓶座 (1/20-2/18)" },
  { value: "pisces", label: "魚座 (2/19-3/20)" },
] as const;

// 言語の定義
const LANGUAGES = [
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "en", label: "英語 (English)" },
  { value: "fr", label: "フランス語 (French)" },
  { value: "zh-tw", label: "中国語 (繁体字) (Chinese Traditional)" },
  { value: "zh-cn", label: "中国語 (簡体字) (Chinese Simplified)" },
  { value: "es", label: "スペイン語 (Spanish)" },
  { value: "pt", label: "ポルトガル語 (Portuguese)" },
  { value: "ko", label: "韓国語 (Korean)" },
  { value: "ru", label: "ロシア語 (Russian)" },
  { value: "it", label: "イタリア語 (Italian)" },
  { value: "de", label: "ドイツ語 (German)" },
] as const;

export function BeginnerGuideView() {
  const [oasisAgreed, setOasisAgreed] = useState(false);
  const [zodiac, setZodiac] = useState("");
  const [language, setLanguage] = useState("");

  // ブラウザの言語設定を自動取得
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    const supportedLang = LANGUAGES.find((l) => l.value === browserLang);
    if (supportedLang) {
      setLanguage(supportedLang.value);
    } else {
      setLanguage("ja"); // デフォルト
    }
  }, []);

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
      desc: "一言で言うと「目的別の名刺」です。このプロフィールにはあなたの価値観を入力します。目的（創る・働く、遊び、パートナー探しなど）毎に作成して、他のユーザーとのマッチングに使用します。",
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
      <div className="space-y-20 relative">
        {/* バーティカルライン (Stepper Line) */}
        <div className="absolute left-[23px] top-10 bottom-10 w-1 bg-slate-100 dark:bg-neutral-800 rounded-full z-0 hidden md:block" />

        {steps.map((step, stepIndex) => (
          <div
            key={step.title}
            className={cn(
              "flex flex-col md:flex-row gap-8 items-start relative transition-all duration-300 z-10"
            )}
          >
            {/* ステップドット (Stepper Node) */}
            <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border-4 border-slate-100 dark:border-neutral-800 items-center justify-center font-black text-slate-400 dark:text-neutral-500 shadow-sm relative z-20">
              {stepIndex + 1}
            </div>
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
              {step.isRoot && (
                <div className="mb-6 p-5 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <ShieldCheck size={28} />
                  </div>
                  <p className="text-amber-700 dark:text-amber-300 font-bold text-[18px]">
                    お試し体験中：アカウントの作成はスキップします。
                  </p>
                </div>
              )}
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
                  "text-slate-600 dark:text-neutral-100 leading-relaxed font-bold transition-all",
                  step.isRoot &&
                    "line-through text-slate-900 dark:text-neutral-100"
                )}
              >
                {step.desc}
              </p>
              {step.isRoot && (
                <div className="mt-8 space-y-6">
                  {/* アカウントカード（Step 1用） */}
                  <div className="mt-8">
                    <AccountCard isTrial={true} />
                  </div>

                  {/* 3つの質問フォーム */}
                  <div className="p-8 bg-slate-50/50 dark:bg-neutral-900/30 border border-slate-200 dark:border-neutral-800 rounded-3xl space-y-8 backdrop-blur-sm">
                    <h5 className="text-[20px] font-bold text-slate-800 dark:text-neutral-100 flex items-center gap-2">
                      <Check className="text-blue-600" />
                      お試し版の基本設定
                    </h5>

                    {/* 1. オアシス宣言 */}
                    <div className="space-y-4">
                      <label
                        className={cn(
                          "group flex items-start gap-4 p-5 bg-white dark:bg-neutral-800 rounded-2xl border-2 transition-all cursor-pointer shadow-sm",
                          oasisAgreed
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-4 ring-blue-500/10 dark:ring-blue-500/5"
                            : "border-slate-100 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600"
                        )}
                      >
                        <div className="relative flex items-center mt-1">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={oasisAgreed}
                            onChange={(e) => setOasisAgreed(e.target.checked)}
                          />
                          <div className="w-7 h-7 border-2 border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-500 transition-colors flex items-center justify-center">
                            <Check
                              size={18}
                              className="text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <div className="font-black text-[20px] text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              オアシス宣言を守る
                            </div>
                            <Link
                              href="/oasis"
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                              詳細を見る
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                          <p className="text-[16px] text-slate-500 dark:text-neutral-200 mt-1 leading-relaxed">
                            ヘイト発言や誹謗中傷を行わず、安心・安全なコミュニティを作ります。
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 2. 星座 */}
                      <div className="space-y-3">
                        <label className="block text-[16px] font-bold text-slate-700 dark:text-neutral-100 ml-1">
                          あなたの星座
                        </label>
                        <select
                          className={cn(
                            "w-full p-4 rounded-xl border-2 outline-none transition-all font-bold text-[18px] shadow-sm",
                            "text-slate-900 dark:text-white",
                            zodiac
                              ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 ring-4 ring-blue-500/10"
                              : "border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                          )}
                          value={zodiac}
                          onChange={(e) => setZodiac(e.target.value)}
                        >
                          <option value="">選択してください</option>
                          {ZODIAC_SIGNS.map((s) => (
                            <option
                              key={s.value}
                              value={s.value}
                              className="text-slate-900 bg-white dark:text-white dark:bg-neutral-800"
                            >
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. 使用言語 */}
                      <div className="space-y-3">
                        <label className="block text-[16px] font-bold text-slate-700 dark:text-neutral-100 ml-1">
                          使用言語
                        </label>
                        <select
                          className={cn(
                            "w-full p-4 rounded-xl border-2 outline-none transition-all font-bold text-[18px] shadow-sm",
                            "text-slate-900 dark:text-white",
                            language
                              ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 ring-4 ring-blue-500/10"
                              : "border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500"
                          )}
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          {LANGUAGES.map((l) => (
                            <option
                              key={l.value}
                              value={l.value}
                              className="text-slate-900 bg-white dark:text-white dark:bg-neutral-800"
                            >
                              {l.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-[12px] text-slate-500 dark:text-neutral-300 mt-1 ml-1 font-medium">
                          ※ブラウザ設定から自動取得しました。後で変更可能です。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* プロフィールツリー（step 2のみ） */}
              {step.hasProfileTree && (
                <div className="mt-8 space-y-8">
                  <ProfileListTree />

                  {/* アクションボタン */}
                  <div className="flex justify-center md:justify-start">
                    <Link
                      href="/user-profiles/new"
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
