"use client";

import { useEffect, useState } from 'react';
import { TrustDashboard } from './trust-dashboard';
import { createTrustData, TrustData } from './trust-dashboard.logic';

/**
 * サンクチュアリ ダッシュボード コンテナ
 * 状態管理とデータのフェッチ（シミュレーション）を担当
 */
export function TrustDashboardContainer() {
  // デモ用に初期データ生成（120日継続、活動指数0.85）
  const [data, setData] = useState<TrustData>(createTrustData(120, 0.85));

  useEffect(() => {
    // 将来的にはここでAPIからデータを取得する
  }, []);

  return (
    <TrustDashboard trustData={data} />
  );
}
