"use client";

import { useEffect, useState } from "react";
import { GeminiRootAccountView } from "./gemini-root-account";
import { DUMMY_DATA, IRootAccountData } from "./gemini-root-account.logic";

export const GeminiRootAccountContainer = () => {
  const [accountData, setAccountData] = useState<IRootAccountData | null>(null);
  const [isDummy, setIsDummy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // データ取得をシミュレート
    const fetchDummyData = async (): Promise<void> => {
      // ネットワークリクエストを模倣するためのタイムアウト
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAccountData(DUMMY_DATA);
      setIsDummy(true);
      setLoading(false);
    };

    fetchDummyData();
  }, []);

  const handleCopyId = (): void => {
    if (accountData) {
      navigator.clipboard.writeText(accountData.id);
      // alert('IDをクリップボードにコピーしました！');
    }
  };

  return (
    <GeminiRootAccountView
      accountData={accountData}
      isDummy={isDummy}
      loading={loading}
      onCopyId={handleCopyId}
    />
  );
};
