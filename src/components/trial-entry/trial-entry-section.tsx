"use client";

import { ArrowRight, UserCircle2 } from "lucide-react";
import Link from "next/link";

export function TrialEntrySection() {
    return (
        <section className="w-full font-sans">
            <div className="mx-auto w-full max-w-4xl px-4">
                <div className="mb-12 space-y-4 text-center">
                    <h3 className="bg-linear-to-r from-emerald-700 to-indigo-700 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-indigo-400">
                        VNS <br />
                        masakinihirotaの世界に入る
                    </h3>
                </div>

                <div className="mx-auto max-w-2xl">
                    <div className="group relative rounded-[2rem] bg-linear-to-br from-indigo-500/50 to-blue-700/50 p-px transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
                        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.9rem] border border-transparent bg-white p-8 dark:bg-[#0a0a0a] md:p-10">
                            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl transition-colors group-hover:bg-indigo-500/10" />

                            <div className="relative z-10">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <UserCircle2 size={28} />
                                </div>
                                <h4 className="mb-4 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                                    ユーザー登録
                                </h4>
                                <p className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">
                                    データをクラウドに安全に永続化。価値観マッチングやコミュニティへの参加、国づくりが可能です。
                                </p>
                            </div>

                            <Link
                                href="/login"
                                className="group/btn relative z-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-700"
                            >
                                メンバー登録 / ログイン
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover/btn:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
