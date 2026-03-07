"use client";

import { memo } from "react";

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
        </header>
    );
});
