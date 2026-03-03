"use client";

import { MandalaChart as MandalaChartType } from "./mandala-chart.logic";
import { MandalaGrid } from "./mandala-grid/mandala-grid";

interface MandalaChartProps {
  /** チャートデータ */
  chart: MandalaChartType;
  /** レイアウトモード ('full' | 'focus') */
  viewMode: "full" | "focus";
  /** 集中モード時に表示するサブグリッドのインデックス (0-8) */
  focusIndex: number;
  /** セルクリック時のハンドラ */
  onCellClick: (gridIdx: number, cellIdx: number) => void;
}

/**
 * マンダラチャート全体を表示するコンポーネント
 * 俯瞰モードと集中モードの切り替えに対応
 */
export const MandalaChart = ({
  chart,
  viewMode,
  focusIndex,
  onCellClick,
}: MandalaChartProps) => {
  if (viewMode === "focus") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {chart.grids[focusIndex][4] || `エリア ${focusIndex + 1}`}
        </h2>
        <MandalaGrid
          gridIdx={focusIndex}
          data={chart.grids[focusIndex]}
          onCellClick={(cellIdx) => onCellClick(focusIndex, cellIdx)}
          isFocused={true}
        />
      </div>
    );
  }

  // 俯瞰モード (9x9)
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 animate-in fade-in duration-500">
      {chart.grids.map((gridData, gridIdx) => (
        <MandalaGrid
          key={gridIdx}
          gridIdx={gridIdx}
          data={gridData}
          onCellClick={(cellIdx) => onCellClick(gridIdx, cellIdx)}
        />
      ))}
    </div>
  );
};
