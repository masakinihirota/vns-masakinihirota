"use client";

import { Ghost, Plus, User, X } from "lucide-react";
import Image from "next/image";
import type React from "react";

import { Card } from "@/components/ui";

import type {
    Account,
    Profile,
    ProfileId,
} from "./identity-visualization.logic";
import { IDENTITY_CONFIG } from "./identity-visualization.logic";

interface IdentityVisualizationProperties {
    readonly activeProfile: ProfileId;
    readonly currentProfile: Profile;
    readonly account: Account;
    readonly masks: readonly Profile[];
    readonly linePath: string;
    readonly accountRef: React.RefObject<HTMLDivElement | null>;
    readonly profileRefs: React.MutableRefObject<
        Record<string, HTMLButtonElement | null>
    >;
    readonly onProfileSelect: (id: ProfileId) => void;
    readonly onCreateMask?: () => void;
}

export const IdentityVisualization: React.FC<IdentityVisualizationProperties> = ({
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
        <div className="flex h-full w-full flex-col overflow-visible rounded-[2.5rem] border border-white/20 bg-white/5 p-4 font-sans text-slate-900 shadow-2xl backdrop-blur-2xl transition-all duration-500 dark:border-white/5 dark:bg-slate-950/40 dark:text-slate-100 md:overflow-hidden md:p-8">
            <header className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Identity Visualization{" "}
                        <span className="font-normal text-slate-500 dark:text-slate-500">
                            | 千の仮面
                        </span>
                    </h1>
                    <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                        {account.name}{" "}
                        が様々な仮面を被り、幽霊状態から各アイデンティティへ実体化する過程を可視化します。
                    </p>
                </div>
            </header>

            <main className="viz-container relative flex flex-1 items-center justify-center overflow-visible rounded-[3rem] border border-white/20 bg-white/10 transition-all dark:border-white/5 dark:bg-white/5">
                <svg
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
                            <stop
                                offset="100%"
                                stopColor={isGhost ? "#64748b" : (currentProfile.color ?? "#6366f1")}
                                stopOpacity="0.4"
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
                        className="opacity-60 transition-all duration-1000 ease-in-out"
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

                <div className="relative z-10 flex w-full max-w-6xl items-center justify-around px-6 md:px-12">
                    <div className="flex flex-col items-center gap-8">
                        <div className="group relative">
                            <div
                                className={`absolute -inset-8 rounded-full opacity-40 blur-3xl transition-all duration-1000 ${isGhost
                                    ? "bg-slate-200 dark:bg-slate-700"
                                    : "animate-pulse bg-indigo-400 dark:bg-indigo-600"
                                    }`}
                            />

                            <div
                                ref={accountRef}
                                className={`relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 bg-white/80 shadow-2xl backdrop-blur-xl transition-all duration-700 dark:bg-slate-900/80 ${isGhost
                                    ? "border-slate-200/50 dark:border-white/10"
                                    : "scale-110 border-indigo-500/80 shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)] shadow-indigo-500/20"
                                    }`}
                            >
                                <Image
                                    src={account.img}
                                    alt={account.name}
                                    fill
                                    className="absolute inset-0 h-full w-full object-cover opacity-10 grayscale"
                                />

                                <div
                                    className={`relative z-10 flex h-full w-full flex-col items-center justify-center transition-all duration-700 ${isGhost ? "opacity-60" : "opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={currentProfile.img}
                                        alt={currentProfile.name}
                                        fill
                                        className={`h-full w-full object-cover object-[center_20%] transition-transform duration-1000 ${isGhost ? "scale-85" : "scale-100"
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="absolute -bottom-24 left-1/2 w-64 -translate-x-1/2 text-center">
                                <p className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                                    {account.name}
                                </p>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${isGhost ? "bg-slate-300 dark:bg-slate-600" : "animate-pulse bg-green-500"}`}
                                    />
                                    <p className="text-lg font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                                        {isGhost ? "Observer" : "Materialized"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-96 flex-col gap-6">
                        <div className="relative">
                            <div className="absolute -left-14 top-1/2 h-px w-14 bg-slate-200 dark:bg-slate-800/60" />
                            <button
                                ref={(element) => {
                                    if (element) {
                                        (profileRefs.current as Record<string, HTMLButtonElement | null>)["ghost"] =
                                            element;
                                    }
                                }}
                                onClick={() => onProfileSelect("ghost")}
                                className={`group flex w-full items-center gap-5 rounded-[2rem] border-2 p-4 shadow-xl transition-all duration-500 ${isGhost
                                    ? "scale-105 border-indigo-400 bg-indigo-600 text-white"
                                    : "border-white/20 bg-white/40 backdrop-blur-md hover:border-indigo-300 hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:hover:border-indigo-500/50 dark:hover:bg-white/10"
                                    }`}
                                aria-pressed={isGhost}
                                aria-label={
                                    isGhost
                                        ? "現在の状態：幽霊状態"
                                        : "幽霊状態（デフォルト）に切り替える"
                                }
                            >
                                <div
                                    className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full transition-all duration-500 ${isGhost
                                        ? "ring-4 ring-indigo-500/20"
                                        : "opacity-40 grayscale group-hover:grayscale-0"
                                        }`}
                                >
                                    <Image
                                        src={IDENTITY_CONFIG.ghost.img}
                                        alt="Ghost state"
                                        fill
                                        className="h-full w-full object-cover object-[center_20%]"
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <p
                                        className={`text-lg font-black ${isGhost ? "text-white" : "text-slate-700 dark:text-slate-200"}`}
                                    >
                                        {IDENTITY_CONFIG.ghost.name}
                                    </p>
                                    <p
                                        className={`mt-0.5 text-lg font-bold ${isGhost ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}
                                    >
                                        幽霊状態（デフォルト）
                                    </p>
                                </div>
                                {isGhost && (
                                    <div className="mr-2">
                                        <div className="h-3 w-3 animate-ping rounded-full bg-indigo-600" />
                                    </div>
                                )}
                            </button>
                        </div>

                        <div className="ml-10 h-8 border-l-2 border-dashed border-slate-200 dark:border-slate-800/60" />

                        <div className="flex flex-col gap-4 border-l-2 border-slate-200 pl-10 dark:border-slate-800/40">
                            <h2 className="mb-2 ml-2 text-lg font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                                千の仮面 (Available Identities)
                            </h2>

                            {masks.map((mask) => {
                                const isActive = activeProfile === mask.id;
                                return (
                                    <div key={mask.id} className="relative">
                                        <div className="absolute -left-10 top-1/2 h-px w-10 bg-slate-200 dark:bg-slate-800/60" />
                                        <button
                                            ref={(element) => {
                                                if (element) {
                                                    (profileRefs.current as Record<string, HTMLButtonElement | null>)[
                                                        mask.id
                                                    ] = element;
                                                }
                                            }}
                                            onClick={() => onProfileSelect(isActive ? "ghost" : mask.id)}
                                            className={`group flex w-full items-center gap-5 rounded-2xl border-2 p-3.5 shadow-lg backdrop-blur-md transition-all duration-500 ${isActive
                                                ? "z-20 scale-105 border-white bg-white dark:border-white/20 dark:bg-white/10"
                                                : "border-white/10 bg-white/10 hover:border-white/30 hover:bg-white/30 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                                                }`}
                                            aria-pressed={isActive}
                                            aria-label={
                                                isActive
                                                    ? `仮面 ${mask.name} を着用中。クリックで幽霊状態に戻る`
                                                    : `仮面 ${mask.name} を着用する`
                                            }
                                        >
                                            <div
                                                className={`h-14 w-14 overflow-hidden rounded-xl shadow-inner transition-all duration-500 ${isActive
                                                    ? "ring-4 ring-indigo-400/20"
                                                    : "opacity-60 group-hover:opacity-100"
                                                    }`}
                                                style={{
                                                    backgroundColor: isActive ? mask.color : "transparent",
                                                }}
                                            >
                                                <Image
                                                    src={mask.img}
                                                    alt={mask.name}
                                                    fill
                                                    className="h-full w-full object-cover object-[center_20%]"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 text-left">
                                                <p
                                                    className={`truncate text-lg font-black ${isActive ? "text-slate-950 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}
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
                                                    className="rounded-lg bg-slate-100 p-2 text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-900"
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
                                className="mt-2 flex items-center gap-3 p-4 text-lg font-black uppercase tracking-widest text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-indigo-400"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                                仮面を新規作成
                            </button>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 flex flex-col gap-3">
                    <Card className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/40 px-5 py-2.5 shadow-lg backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/5">
                        <div className="h-3.5 w-3.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                        <span className="text-lg font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
                            Current ID:{" "}
                            <span className="ml-2 text-slate-900 dark:text-white">
                                {currentProfile.name}
                            </span>
                        </span>
                    </Card>
                    <Card className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/40 px-5 py-2.5 shadow-lg backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/5">
                        <div
                            className={`h-3.5 w-3.5 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)] ${isGhost ? "bg-slate-300 dark:bg-slate-600" : "bg-indigo-500"}`}
                        />
                        <span className="text-lg font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
                            Mode:{" "}
                            <span className="ml-2 text-slate-900 dark:text-white">
                                {isGhost ? "Observing" : "Materialized"}
                            </span>
                        </span>
                    </Card>
                </div>
            </main>

            <footer className="mt-10 grid grid-cols-1 items-end gap-8 opacity-80 transition-opacity hover:opacity-100 md:grid-cols-3">
                <div className="space-y-2">
                    <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">
                        <User size={14} className="text-indigo-600 dark:text-indigo-500" /> Root
                        Authentication
                    </h2>
                    <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-500">
                        {account.name}{" "}
                        は不変の存在です。状況に応じて異なる属性の仮面を投影することで、多層的な存在を確立します。
                    </p>
                </div>
                <div className="space-y-2">
                    <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300">
                        <Ghost size={14} className="text-slate-500 dark:text-slate-400" /> Ground
                        State
                    </h2>
                    <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-500">
                        {IDENTITY_CONFIG.ghost.name}{" "}
                        は、すべての属性が未定義である状態。観測されるまで何者でもない自分自身。
                    </p>
                </div>
                <div className="pb-1 text-right">
                    <p className="flex items-center justify-end gap-2 text-lg font-bold tracking-tight text-slate-400 dark:text-slate-600">
                        SYSTEM_VER 2.1{" "}
                        <span className="text-slate-200 dark:text-slate-800">{"//"}</span>
                        VNS_PROTOCOL_V4
                    </p>
                    <p className="mt-1 text-lg font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
                        © 2026 Value Network Service
                    </p>
                </div>
            </footer>
        </div>
    );
};
