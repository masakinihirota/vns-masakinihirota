"use client";

import React from "react";

import { Profile, SkillTemplate, ViewMode } from "../types";

import { MandalaCell } from "./mandala-cell";
import { getCellStatus } from "./mandala-chart.logic";

interface MandalaChartProperties {
  readonly skillTemplate: SkillTemplate;
  readonly me?: Profile;
  readonly target?: Profile;
  readonly viewMode: ViewMode;
}

/**
 * 3x3 マンダラチャートコンポーネント
 * 中央にスキル名を配置し、周囲に具体項目を配置する
 * @param root0
 * @param root0.skillTemplate
 * @param root0.me
 * @param root0.target
 * @param root0.viewMode
 */
export const MandalaChart: React.FC<MandalaChartProperties> = ({
  skillTemplate,
  me,
  target,
  viewMode,
}) => {
  const { items } = skillTemplate;

  // 3x3グリッドの配置（0-3 が上半分〜中央左、4-7 が中央右〜下半分）
  // 仕様書の「暗黙の仕様」に基づき、中央にタイトルを配置する順序でレンダリング
  const gridPositions = [0, 1, 2, 3, "center", 4, 5, 6, 7] as const;

  return (
    <section
      className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
      aria-labelledby="mandala-title"
    >
      <h2 id="mandala-title" className="sr-only">
        {skillTemplate.id} のマンダラチャート比較
      </h2>
      {gridPositions.map((item, index) => {
        if (item === "center") {
          return (
            <MandalaCell
              key="center"
              label={skillTemplate.id}
              status="NONE"
              isCenter
              viewMode={viewMode}
            />
          );
        }

        const itemLabel = items[item] ?? "";
        const status = getCellStatus(item, skillTemplate.id, me, target);

        return (
          <MandalaCell
            key={item}
            label={itemLabel}
            status={status}
            viewMode={viewMode}
          />
        );
      })}
    </section>
  );
};
