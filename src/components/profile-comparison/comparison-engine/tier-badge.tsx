"use client";

import React from "react";
import { TIERS, TierKey } from "./comparison.logic";

interface TierBadgeProps {
  readonly tierKey: TierKey;
}

/**
 * 作品のティア（評価レベル）を表示するバッジコンポーネント
 * 最小フォントサイズ 1rem (text-base) を確保。
 */
export const TierBadge: React.FC<TierBadgeProps> = ({ tierKey }) => {
  const tier = TIERS[tierKey] || TIERS.UNRATED;

  return (
    <div
      className={`px-4 py-1.5 rounded-lg text-base font-black ${tier.color} ${tier.text} flex items-center justify-center w-24 tracking-tighter shrink-0 shadow-sm`}
      aria-label={`Tier: ${tier.label}`}
    >
      {tier.label}
    </div>
  );
};
