'use client';

/**
 * @file identity-visualization.container.tsx
 * @description ステート管理とパス計算ロジックを統合するコンテナコンポーネント
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IdentityVisualization } from './identity-visualization';
import {
  IDENTITY_CONFIG,
  calculateBezierPath,
  getProfileById,
  type ProfileId,
} from './identity-visualization.logic';

export const IdentityVisualizationContainer: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<ProfileId>('ghost');
  const [linePath, setLinePath] = useState<string>('');

  const accountRef = useRef<HTMLDivElement | null>(null);
  const profileRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /**
   * 接続線のパスを計算する
   */
  const updateLinePath = useCallback(() => {
    const startEl = accountRef.current;
    const endEl = profileRefs.current[activeProfile];

    if (startEl && endEl) {
      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();

      // コンテナ（viz-container）の相対位置を取得
      const containerEl = startEl.closest('.viz-container');
      if (!containerEl) return;

      const containerRect = containerEl.getBoundingClientRect();

      // 始点: Rootアカウントの右端中央
      const x1 = startRect.right - containerRect.left;
      const y1 = startRect.top + startRect.height / 2 - containerRect.top;

      // 終点: プロフィールボタンの左端中央
      const x2 = endRect.left - containerRect.left;
      const y2 = endRect.top + endRect.height / 2 - containerRect.top;

      const path = calculateBezierPath(x1, y1, x2, y2);
      setLinePath(path);
    }
  }, [activeProfile]);

  // アクティブプロフィール変更時やリサイズ時にパスを更新
  useEffect(() => {
    updateLinePath();
    window.addEventListener('resize', updateLinePath);
    return () => window.removeEventListener('resize', updateLinePath);
  }, [updateLinePath]);

  const handleProfileSelect = (id: ProfileId) => {
    setActiveProfile(id);
  };

  const handleCreateMask = () => {
    // 将来的な拡張ポイント: 新規仮面作成モーダルなどを開く
  };

  const currentProfile = getProfileById(activeProfile);

  return (
    <IdentityVisualization
      activeProfile={activeProfile}
      currentProfile={currentProfile}
      account={IDENTITY_CONFIG.account}
      masks={IDENTITY_CONFIG.masks}
      linePath={linePath}
      accountRef={accountRef}
      profileRefs={profileRefs}
      onProfileSelect={handleProfileSelect}
      onCreateMask={handleCreateMask}
    />
  );
};
