"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrialStorage } from "@/lib/trial-storage";
import { logger } from "@/lib/logger";

/**
 * お試しモード時に /home へのアクセスを防ぐコンポーネント
 * お試しモードの場合は /home-trial にリダイレクトする
 */
export function TrialModeRedirect() {
    const router = useRouter();

    useEffect(() => {
        // クライアントサイドでお試しモードをチェック
        if (typeof window !== "undefined") {
            const isTrialMode = localStorage.getItem("vns_trial_mode") === "true";

            if (isTrialMode) {
                logger.warn("お試しモード中は /home にアクセスできません。/home-trial にリダイレクトします。");
                router.replace("/home-trial");
            }
        }
    }, [router]);

    return null; // UI を表示しない
}
