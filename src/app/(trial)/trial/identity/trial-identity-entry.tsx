"use client";

import { OnboardingIdentityContainer } from "@/components/trial/onboarding-flow";
import { useEffect, useState } from "react";

function TrialIdentitySkeleton() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
                <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
                    <div className="mb-6 h-6 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="h-56 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                        </div>

                        <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                            <div className="h-5 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                            <div className="space-y-2">
                                <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                                <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={`skeleton-${i}`}
                                        className="h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TrialIdentityEntry() {
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = globalThis.setTimeout(() => {
            setShowSkeleton(false);
        }, 700);

        return () => {
            globalThis.clearTimeout(timer);
        };
    }, []);

    if (showSkeleton) {
        return <TrialIdentitySkeleton />;
    }

    return <OnboardingIdentityContainer />;
}
