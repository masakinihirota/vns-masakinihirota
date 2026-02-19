"use client";

import React from 'react';
import { MandalaCell } from './mandala-cell';
import { calculateMandalaStatus, Profile } from './skill-comparison.logic';
import { MANDALA_TEMPLATES } from './skill-comparison.sample-data';

interface MandalaGridProps {
  readonly focusedSkill: string;
  readonly currentMe: Profile | undefined;
  readonly currentTarget: Profile | undefined;
}

/**
 * 3x3 のマンダラチャート・グリッド
 * 仕様書の「固定スロット制（8項目）」に基づき、中央にフォーカススキル、周辺に詳細項目を配置します。
 */
export const MandalaGrid: React.FC<MandalaGridProps> = ({
  focusedSkill,
  currentMe,
  currentTarget
}) => {
  const template = MANDALA_TEMPLATES[focusedSkill];
  const items = template?.items ?? [];

  return (
    <div className="grid grid-cols-3 gap-4" data-testid="mandala-grid">
      {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((item, idx) => {
        if (item === 'center') {
          return <MandalaCell key="center" label={focusedSkill} isCenter />;
        }

        const itemIdx = item as number;
        const hasMe = !!currentMe?.mastery?.[focusedSkill]?.includes(itemIdx);
        const hasThem = !!currentTarget?.mastery?.[focusedSkill]?.includes(itemIdx);
        const status = calculateMandalaStatus(hasMe, hasThem);

        return (
          <MandalaCell
            key={idx}
            label={items[itemIdx] ?? `Item ${itemIdx + 1}`}
            status={status}
          />
        );
      })}
    </div>
  );
};
