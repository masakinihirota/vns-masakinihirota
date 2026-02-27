"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";

import { TrialStorage, VNSTrialData } from "@/lib/trial-storage";

export type ViewMode = "beginner" | "latest";

export type PublicUser = {
  id: string;
  display_name: string;
  purpose: string | null;
  role_type: string;
};

const STORAGE_KEY = "homeTrialConfig";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useHomeTrialLogic = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (globalThis.window === undefined) return "beginner";
    // eslint-disable-next-line no-restricted-syntax
    try {
      const stored = globalThis.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.viewMode === "beginner" || parsed.viewMode === "latest") {
          return parsed.viewMode;
        }
      }
    } catch {
      // 読み込み失敗時はデフォルト値を返す
    }
    return "beginner";
  });

  // Trial Data の初期化 (遅延初期化で setState in effect を防止)
  const [trialData, setTrialData] = useState<VNSTrialData | null>(() =>
    TrialStorage.init()
  );

  // Fetch Public Works
  const { data: publicWorks } = useSWR("/api/public/works?limit=5", fetcher);

  // Fetch Public Users (Matching Candidates)
  const { data: publicUsers } = useSWR<PublicUser[]>(
    "/api/public/users?limit=8",
    fetcher
  );

  const refreshTrialData = useCallback(() => {
    const data = TrialStorage.init();
    setTrialData(data);
  }, []);

  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      globalThis.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ viewMode: mode })
      );
    } catch {
      // 保存失敗時はサイレントに終了
    }
  };

  return {
    viewMode,
    handleToggleView,
    trialData,
    publicWorks,
    publicUsers,
    refreshTrialData,
  };
};
