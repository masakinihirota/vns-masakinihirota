"use client";

import { IdentityVisualizationContainer } from "@/components/identity-visualization";

export function IdentitySection() {
    return (
        <section className="space-y-12">
            <div className="space-y-4 text-center">
                <h2 className="font-serif text-2xl font-bold text-slate-800 dark:bg-linear-to-r dark:from-indigo-200 dark:to-blue-200 dark:bg-clip-text dark:text-transparent md:text-3xl">
                    あなたの「千の仮面」を視覚化する
                </h2>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-indigo-200/80">
                    幽霊状態のあなた（Root）から、さまざまな価値観に基づいた仮面（プロフィール）が生まれる仕組みを体験してください。
                </p>
            </div>

            <div className="relative h-200 w-full overflow-y-auto md:h-225 lg:h-250 lg:overflow-visible">
                <IdentityVisualizationContainer />
            </div>
        </section>
    );
}
