"use client";

import { TrialStorage, VNSTrialData } from "@/lib/trial-storage";
import { useEffect, useState } from "react";
import useSWR from "swr";

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
  const [viewMode, setViewMode] = useState<ViewMode>("beginner");
  const [trialData, setTrialData] = useState<VNSTrialData | null>(null);

  // Fetch Public Works
  const { data: publicWorks } = useSWR(
    "/api/public/works?limit=5",
    fetcher
  );

  // Fetch Public Users (Matching Candidates)
  const { data: publicUsers } = useSWR<PublicUser[]>(
    "/api/public/users?limit=8",
    fetcher
  );

  // Sync Trial Data
  const refreshTrialData = () => {
    const data = TrialStorage.init();
    setTrialData(data);
  };

  useEffect(() => {
    // Initial load
    refreshTrialData();

    // Load config
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.viewMode === "beginner" || parsed.viewMode === "latest") {
          setViewMode(parsed.viewMode);
        }
      }
    } catch (error) {
      console.error("Failed to load config", error);
    }
  }, []);

  const handleToggleView = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ viewMode: mode })
      );
    } catch (error) {
      console.error("Failed to save config", error);
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
