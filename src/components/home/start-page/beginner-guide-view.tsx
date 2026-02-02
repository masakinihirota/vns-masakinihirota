"use client";

/**
 * 基本の使い方ビューコンポーネント
 * 初心者向けの使い方ガイドを表示
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
import Link from "next/link";
import { ProfileListTree } from "./profile-list-tree";
import { BEGINNER_STEPS } from "./start-page.logic";

/**
 * アイコンタイプからReactコンポーネントに変換
 */
function getIcon(iconType: string) {
  switch (iconType) {
    case "shield-check":
      return <ShieldCheck size={28} />;
    case "user":
      return <User size={28} />;
    case "sparkles":
      return <Sparkles size={28} />;
    case "target":
      return <Target size={28} />;
    case "layers":
      return <Layers size={28} />;
    case "users":
      return <Users size={28} />;
    case "globe":
      return <Globe size={28} />;
    case "store":
      return <Store size={28} />;
    default:
      return <ShieldCheck size={28} />;
  }
}

export function BeginnerGuideView() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* ヘッダーセクション */}
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-[36px] font-black text-slate-800 dark:text-neutral-100">
          基本の使い方
        </h2>
        <p className="text-slate-500 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto font-bold">
          このサービスは、あなたの価値観を尊重し、
          <br />
          情報の洪水から「感動」を真っ先に拾い上げる場所です。
        </p>
      </div>

      {/* ステップリスト */}
      <div className="space-y-20">
        {BEGINNER_STEPS.map((step, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* アイコン */}
            <div
              className={`mt-2 flex-shrink-0 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 ${step.color}`}
            >
              {getIcon(step.iconType)}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 pb-12 border-b-4 border-slate-50 dark:border-neutral-800 last:border-0 w-full">
              <h4 className="text-[26px] font-black text-slate-800 dark:text-neutral-100 mb-4">
                {step.title}
              </h4>
              <p className="text-slate-600 dark:text-neutral-400 leading-relaxed font-bold">
                {step.desc}
              </p>

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
        <Link
          href="/profile/create"
          className="px-12 py-6 bg-blue-600 dark:bg-indigo-600 text-white font-black rounded-3xl hover:bg-blue-700 dark:hover:bg-indigo-700 hover:shadow-2xl transition-all flex items-center gap-4 active:scale-95 shadow-xl text-[20px]"
        >
          プロフィールを作成して始める <ArrowRightLeft size={28} />
        </Link>
      </div>
    </div>
  );
}
