"use client";

import { logger } from "@/lib/logger";
import { TrialStorage } from "@/lib/trial-storage";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function resolveTrialDisplayName(): string | null {
    const trialData = TrialStorage.load();
    const displayName = trialData?.rootAccount?.display_name?.trim();
    if (!displayName) {
        return null;
    }
    return displayName;
}

export function TrialModeBadge() {
    const pathname = usePathname();
    const [labelName, setLabelName] = useState<string | null>(null);

    useEffect(() => {
        const sync = () => {
            const isTrialMode = localStorage.getItem("vns_trial_mode") === "true";
            if (!isTrialMode) {
                setLabelName(null);
                return;
            }

            try {
                setLabelName(resolveTrialDisplayName());
            } catch (error) {
                logger.warn("Failed to resolve trial display name for header badge", {
                    operation: "TrialModeBadge.sync",
                    pathname,
                    error: error instanceof Error ? error.message : String(error),
                });
                setLabelName(null);
            }
        };

        sync();
        window.addEventListener("storage", sync);
        window.addEventListener("trialModeChanged", sync);

        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("trialModeChanged", sync);
        };
    }, [pathname]);

    const isHomeTrial = pathname === "/home-trial";

    if (!isHomeTrial || !labelName) {
        return null;
    }

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
            <span aria-hidden="true">🎭</span>
            <span className="max-w-45 truncate">{labelName} (お試し中)</span>
        </div>
    );
}
