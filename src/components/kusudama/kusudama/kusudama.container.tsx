'use client';

import React, { useCallback, useState } from 'react';
import { Kusudama } from './kusudama';
import { generateConfettiData, type ConfettiData } from './kusudama.logic';

/**
 * お祝いくす玉（Celebration Kusudama）コンテナコンポーネント
 * 状態管理とアニメーション発火の制御を行う
 */
export const KusudamaContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confetti, setConfetti] = useState<readonly ConfettiData[]>([]);

  /**
     * くす玉を開く
     */
  const handleOpen = useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    setConfetti(generateConfettiData(300));
  }, [isOpen]);

  /**
     * くす玉をリセットして閉じる
     */
  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setConfetti([]);
  }, []);

  return (
    <Kusudama
      isOpen={isOpen}
      confetti={confetti}
      onOpen={handleOpen}
      onReset={handleReset}
    />
  );
};
