"use client";

import { memo } from "react";

import { ConceptExplanationContainer } from "@/components/concept-explanation";

export const HeroSection = memo(function HeroSection() {
    return (
        <header className="flex flex-col items-center space-y-8 py-12 text-center">
            <div className="space-y-2">
                <p className="text-lg font-medium uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400">
                    Value Network Service
                </p>
                <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-7xl">
                    VNS
                    <br className="block" />
                    masakinihirota
                </h1>
            </div>

            <div className="h-px w-24 bg-linear-to-r from-transparent via-slate-300 to-transparent dark:via-neutral-400" />

            <div className="w-full">
                <ConceptExplanationContainer />
            </div>

            <h2 className="max-w-3xl bg-linear-to-br from-indigo-900 to-blue-700 bg-clip-text font-serif text-2xl font-light leading-relaxed text-transparent drop-shadow-sm dark:from-white dark:to-indigo-200 md:text-4xl">
                「昨日僕が感動した作品を、
                <br className="md:hidden" />
                今日の君はまだ知らない。」
            </h2>

            <div className="space-y-4 font-serif">
                <p className="text-lg font-medium text-slate-700 dark:text-muted-foreground md:text-xl">
                    まっさきにひろった の名前の由来
                </p>
                <p className="max-w-2xl text-lg text-slate-600 dark:text-muted-foreground md:text-xl">
                    インターネットという情報の洪水の中から真っ先に価値のあるものを拾い上げる
                </p>
            </div>
        </header>
    );
});
