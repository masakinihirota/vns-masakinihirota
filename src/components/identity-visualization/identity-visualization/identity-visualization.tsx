"use client";

/**
 * @file identity-visualization.tsx
 * @description アイデンティティ可視化機能のプレゼンテーション層
 * ガラスモーフィズムとエレガントなダークモードに対応したUI
 */

import { Ghost, Plus, User, X } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui";
import type {
  Account,
  Profile,
  ProfileId,
} from "./identity-visualization.logic";
import { IDENTITY_CONFIG } from "./identity-visualization.logic";

/**
 * IdentityVisualization コンポーネントのプロパティ
 */
interface IdentityVisualizationProps {
  /** 現在アクティブなプロフィールのID */
  readonly activeProfile: ProfileId;
  /** 現在表示中のプロフィールデータ */
  readonly currentProfile: Profile;
  /** ルートアカウント（ユーザー本人）のデータ */
  readonly account: Account;
  /** 利用可能な仮面（プロフィール）のリスト */
  readonly masks: readonly Profile[];
  /** アカウントとプロフィールを繋ぐベジェ曲線のパス */
  readonly linePath: string;
  /** アカウント表示要素への参照 */
  readonly accountRef: React.RefObject<HTMLDivElement | null>;
  /** 各プロフィールボタン要素への参照 */
  readonly profileRefs: React.MutableRefObject<
    Record<string, HTMLButtonElement | null>
  >;
  /** プロフィール選択時のコールバック関数 */
  readonly onProfileSelect: (id: ProfileId) => void;
  /** 仮面新規作成ボタン押下時のコールバック関数 */
  readonly onCreateMask?: () => void;
}

/**
 * IdentityVisualization
 * アカウントとプロフィールの関係を視覚化するプレゼンテーションコンポーネント
 *
 * @param props - IdentityVisualizationProps
 * @returns JSX.Element
 */
export const IdentityVisualization: React.FC<IdentityVisualizationProps> = ({
  activeProfile,
  currentProfile,
  account,
  masks,
  linePath,
  accountRef,
  profileRefs,
  onProfileSelect,
  onCreateMask,
}) => {
  const isGhost = activeProfile === "ghost";

  return (
    <div className="flex flex-col h-full w-full bg-white/10 dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-8 overflow-visible md:overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800/50 backdrop-blur-md dark:backdrop-blur-sm shadow-2xl transition-colors duration-500">
      {/* Header */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Identity Visualization{" "}
            <span className="text-slate-500 dark:text-slate-500 font-normal">
              | 千の仮面
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            {account.name}{" "}
            が様々な仮面を被り、幽霊状態から各アイデンティティへ実体化する過程を可視化します。
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative viz-container bg-white/20 dark:bg-slate-900/30 rounded-3xl border border-white/30 dark:border-slate-800/40 overflow-visible flex items-center justify-center transition-colors">
        {/* Connection Line Layer (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop
                offset="100%"
                stopColor={
                  isGhost ? "#64748b" : (currentProfile.color ?? "#6366f1")
                }
                stopOpacity="0.5"
              />
            </linearGradient>
          </defs>
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
          <path
            d={linePath}
            fill="none"
            stroke={isGhost ? "#475569" : (currentProfile.color ?? "#6366f1")}
            strokeWidth="2"
            strokeDasharray="12,16"
            className="transition-all duration-1000 ease-in-out opacity-60"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="0"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        <div className="flex w-full max-w-6xl justify-around items-center relative z-10 px-6 md:px-12">
          {/* Left: Root Account (M君) */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative group">
              {/* Outer Glow Ring */}
              <div
                className={`absolute -inset-8 rounded-full opacity-40 blur-3xl transition-all duration-1000 ${
                  isGhost
                    ? "bg-slate-200 dark:bg-slate-700"
                    : "bg-indigo-400 dark:bg-indigo-600 animate-pulse"
                }`}
              />

              {/* Account Frame */}
              <div
                ref={accountRef}
                className={`w-48 h-48 rounded-full border-4 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative transition-all duration-700 bg-white dark:bg-slate-900 overflow-hidden ${
                  isGhost
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-indigo-500 scale-110"
                }`}
              >
                {/* Account Background (Subtle) */}
                <img
                  src={account.img}
                  alt={account.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale"
                />

                {/* Mask Overlay */}
                <div
                  className={`relative z-10 transition-all duration-700 flex flex-col items-center justify-center w-full h-full ${
                    isGhost ? "opacity-60" : "opacity-100"
                  }`}
                >
                  <img
                    src={currentProfile.img}
                    alt={currentProfile.name}
                    className={`w-full h-full object-cover transform transition-transform duration-1000 ${
                      isGhost ? "scale-85" : "scale-100"
                    }`}
                  />
                </div>
              </div>

              {/* Account Name & Status */}
              <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-64">
                <p className="font-black text-slate-800 dark:text-slate-100 text-2xl tracking-tight">
                  {account.name}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${isGhost ? "bg-slate-300 dark:bg-slate-600" : "bg-green-500 animate-pulse"}`}
                  ></span>
                  <p className="text-lg text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] font-black">
                    {isGhost ? "Observer" : "Materialized"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Identity Selector Tree */}
          <div className="flex flex-col gap-6 w-96">
            {/* Ghost Selector (Default State) */}
            <div className="relative">
              <div className="absolute left-[-3.5rem] top-1/2 w-14 h-px bg-slate-200 dark:bg-slate-800/60"></div>
              <button
                ref={(el) => {
                  profileRefs.current["ghost"] = el;
                }}
                onClick={() => onProfileSelect("ghost")}
                className={`w-full p-4 rounded-3xl border-2 flex items-center gap-5 transition-all duration-500 group shadow-xl ${
                  isGhost
                    ? "bg-indigo-600 border-indigo-600 scale-105"
                    : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/50"
                }`}
                aria-pressed={isGhost}
                aria-label={
                  isGhost
                    ? "現在の状態：幽霊状態"
                    : "幽霊状態（デフォルト）に切り替える"
                }
              >
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 ${
                    isGhost
                      ? "ring-4 ring-indigo-500/20"
                      : "opacity-40 grayscale group-hover:grayscale-0"
                  }`}
                >
                  <img
                    src={IDENTITY_CONFIG.ghost.img}
                    alt="Ghost state"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left flex-1">
                  <p
                    className={`text-lg font-black ${isGhost ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
                  >
                    {IDENTITY_CONFIG.ghost.name}
                  </p>
                  <p
                    className={`text-lg font-bold mt-0.5 ${isGhost ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}
                  >
                    幽霊状態（デフォルト）
                  </p>
                </div>
                {isGhost && (
                  <div className="mr-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
                  </div>
                )}
              </button>
            </div>

            {/* Tree Connection Line */}
            <div className="ml-10 h-8 border-l-2 border-dashed border-slate-200 dark:border-slate-800/60"></div>

            {/* Masks List */}
            <div className="flex flex-col gap-4 pl-10 border-l-2 border-slate-200 dark:border-slate-800/40">
              <h2 className="text-lg font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-2 ml-2">
                千の仮面 (Available Identities)
              </h2>

              {masks.map((mask) => {
                const isActive = activeProfile === mask.id;
                return (
                  <div key={mask.id} className="relative">
                    <div className="absolute left-[-2.5rem] top-1/2 w-10 h-px bg-slate-200 dark:bg-slate-800/60"></div>
                    <button
                      ref={(el) => {
                        profileRefs.current[mask.id] = el;
                      }}
                      onClick={() =>
                        onProfileSelect(isActive ? "ghost" : mask.id)
                      }
                      className={`w-full p-3.5 rounded-2xl border-2 flex items-center gap-5 transition-all duration-500 group shadow-lg ${
                        isActive
                          ? "bg-white border-white scale-105 z-20"
                          : "bg-slate-900/50 border-slate-800/60 hover:bg-slate-800/80 hover:border-slate-600"
                      }`}
                      aria-pressed={isActive}
                      aria-label={
                        isActive
                          ? `仮面 ${mask.name} を着用中。クリックで幽霊状態に戻る`
                          : `仮面 ${mask.name} を着用する`
                      }
                    >
                      <div
                        className={`w-14 h-14 rounded-xl overflow-hidden shadow-inner transition-all duration-500 ${
                          isActive
                            ? "ring-4 ring-indigo-400/20"
                            : "opacity-60 group-hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? mask.color
                            : "transparent",
                        }}
                      >
                        <img
                          src={mask.img}
                          alt={mask.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p
                          className={`text-lg font-black truncate ${isActive ? "text-slate-950 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {mask.name}
                        </p>
                        <p
                          className={`text-lg font-bold tracking-tight ${isActive ? "text-slate-500 dark:text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}
                        >
                          {mask.label}
                        </p>
                      </div>
                      {isActive && (
                        <div
                          className="bg-slate-100 dark:bg-slate-950/50 p-2 rounded-lg text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
                          title="仮面を脱ぐ"
                          aria-label="仮面を脱ぐ"
                        >
                          <X size={16} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}

              <button
                onClick={onCreateMask}
                className="flex items-center gap-3 p-4 mt-2 text-lg font-black text-slate-400 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:translate-x-1 duration-300 uppercase tracking-widest"
              >
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <Plus size={20} strokeWidth={3} />
                </div>
                仮面を新規作成
              </button>
            </div>
          </div>
        </div>

        {/* Global Status Indicators */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-3">
          <Card className="bg-white/80 dark:bg-slate-950/90 px-5 py-2.5 rounded-xl border border-white/40 dark:border-slate-800/60 backdrop-blur-xl flex items-center gap-4 transition-colors">
            <div className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
            <span className="text-lg font-black text-slate-600 dark:text-slate-300 tracking-wide uppercase">
              Current ID:{" "}
              <span className="text-slate-900 dark:text-white ml-2">
                {currentProfile.name}
              </span>
            </span>
          </Card>
          <Card className="bg-white/80 dark:bg-slate-950/90 px-5 py-2.5 rounded-xl border border-white/40 dark:border-slate-800/60 backdrop-blur-xl flex items-center gap-4 transition-colors">
            <div
              className={`w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)] ${
                isGhost ? "bg-slate-300 dark:bg-slate-600" : "bg-indigo-500"
              }`}
            ></div>
            <span className="text-lg font-black text-slate-600 dark:text-slate-300 tracking-wide uppercase">
              Mode:{" "}
              <span className="text-slate-900 dark:text-white ml-2">
                {isGhost ? "Observing" : "Materialized"}
              </span>
            </span>
          </Card>
        </div>
      </main>

      {/* Footer System Info */}
      <footer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-end opacity-80 hover:opacity-100 transition-opacity">
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-600 dark:text-slate-300 flex items-center gap-2 uppercase tracking-tighter">
            <User size={14} className="text-indigo-600 dark:text-indigo-500" />{" "}
            Root Authentication
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-500 font-medium leading-relaxed">
            {account.name}{" "}
            は不変の存在です。状況に応じて異なる属性の仮面を投影することで、多層的な存在を確立します。
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-600 dark:text-slate-300 flex items-center gap-2 uppercase tracking-tighter">
            <Ghost size={14} className="text-slate-500 dark:text-slate-400" />{" "}
            Ground State
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-500 font-medium leading-relaxed">
            {IDENTITY_CONFIG.ghost.name}{" "}
            は、すべての属性が未定義である状態。観測されるまで何者でもない自分自身。
          </p>
        </div>
        <div className="text-right pb-1">
          <p className="text-lg text-slate-400 dark:text-slate-600 font-mono font-bold tracking-tight flex items-center justify-end gap-2">
            SYSTEM_VER 2.1{" "}
            <span className="text-slate-200 dark:text-slate-800">//</span>{" "}
            VNS_PROTOCOL_V4
          </p>
          <p className="text-lg text-slate-300 dark:text-slate-700 font-black uppercase tracking-widest mt-1">
            © 2026 Value Network Service
          </p>
        </div>
      </footer>
    </div>
  );
};
