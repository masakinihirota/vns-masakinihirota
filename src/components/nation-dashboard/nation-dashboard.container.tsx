"use client";

import { useEffect, useState } from "react";
import { NationDashboard } from "./nation-dashboard";
import { TabId } from "./nation-dashboard.types";

export const NationDashboardContainer = () => {
  const [activeTab, setActiveTab] = useState<TabId>("plaza");
  const [isScrolled, setIsScrolled] = useState(false);

  // スクロール検知（ヘッダー縮小等の演出用）
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // 初期チェック
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NationDashboard
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isScrolled={isScrolled}
    />
  );
};
