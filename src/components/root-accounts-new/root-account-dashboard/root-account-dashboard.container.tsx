"use client";

import React, { useState, useEffect } from "react";
import { RootAccountDashboard } from "./root-account-dashboard";
import {
  RootAccount,
  UserProfile,
  PointsTransaction,
  MOCK_DB,
} from "./root-account-dashboard.logic";

export function RootAccountDashboardContainer() {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [account, setAccount] = useState<RootAccount | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate Supabase Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAccount(MOCK_DB.root_account);
      setProfiles(MOCK_DB.profiles);
      setTransactions(MOCK_DB.transactions);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">アカウント情報を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  if (!account) return null;

  return (
    <RootAccountDashboard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      account={account}
      profiles={profiles}
      transactions={transactions}
    />
  );
}
