'use client';

import React, { useEffect, useState } from 'react';
import type { ConfettiStyle } from './kusudama.logic';

interface ConfettiPieceProps {
  readonly color: string;
  readonly delay: number;
}

/**
 * 紙吹雪（Confetti）の個別のパーツコンポーネント
 * 3D回転を追加し、立体的にひらひら舞う動きを再現
 */
export const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ color, delay }) => {
  const [style, setStyle] = useState<Partial<ConfettiStyle>>({});

  useEffect(() => {
    // 発生位置
    const randomLeft = Math.random() * 100;
    // 落下時間 (6秒〜14秒)
    const randomDuration = 6 + Math.random() * 8;
    const randomDelay = delay + Math.random() * 2;

    // 左右の揺れ幅
    const swayAmount = 80 + Math.random() * 150;
    const swayDuration = 2 + Math.random() * 4;

    // 3D回転のパラメータ
    // X軸（横）とY軸（縦）の回転を大きくすることで「ひっくり返る」動きを作る
    const rotateX = 720 + Math.random() * 1440;
    const rotateY = 720 + Math.random() * 1440;
    const rotateZ = 360 + Math.random() * 720;
    const scale = 0.4 + Math.random() * 0.8;

    setStyle({
      left: `${randomLeft}vw`,
      backgroundColor: color,
      '--sway-amount': `${swayAmount}px`,
      '--sway-duration': `${swayDuration}s`,
      '--rotate-x': `${rotateX}deg`,
      '--rotate-y': `${rotateY}deg`,
      '--rotate-z': `${rotateZ}deg`,
      '--piece-scale': scale,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
    } as any); // CSS変数を型安全に扱うための暫定的なキャスト
  }, [color, delay]);

  return (
    <div
      className="fixed top-[-5%] w-3 h-4 opacity-0 animate-confetti-fall pointer-events-none"
      style={{
        ...style,
        perspective: '500px', // 3D効果を強調
        transformStyle: 'preserve-3d'
      } as React.CSSProperties}
    >
      <div
        className="w-full h-full animate-confetti-sway rounded-sm shadow-sm"
        style={{
          animationDuration: (style as any)['--sway-duration'],
          animationDelay: style.animationDelay,
          backgroundColor: style.backgroundColor,
        }}
      />
    </div>
  );
};
