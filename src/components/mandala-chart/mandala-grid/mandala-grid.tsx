"use client";

import { MandalaCell } from "../mandala-cell/mandala-cell";
import { MandalaGridData } from "../mandala-chart.logic";

interface MandalaGridProps {
  /** グリッドのデータ (9つのセル) */
  data: MandalaGridData;
  /** マンダラ全体のグリッドインデックス (0-8) */
  gridIdx: number;
  /** セルクリック時のハンドラ */
  onCellClick: (cellIdx: number) => void;
  /** 集中モードかどうか */
  isFocused?: boolean;
}

/**
 * 3x3のサブグリッドを表示するコンポーネント
 */
export const MandalaGrid = ({
  data,
  gridIdx,
  onCellClick,
  isFocused = false,
}: MandalaGridProps) => {
  return (
    <div
      className={`
        grid grid-cols-3 gap-1 p-1
        backdrop-blur-md bg-white/5 border border-white/10 rounded-lg shadow-inner
        ${isFocused ? "w-full max-w-2xl mx-auto" : "w-full"}
      `}
    >
      {data.map((value, cellIdx) => (
        <MandalaCell
          key={`${gridIdx}-${cellIdx}`}
          value={value}
          cellIdx={cellIdx}
          gridIdx={gridIdx}
          onClick={() => onCellClick(cellIdx)}
          isFocused={isFocused}
        />
      ))}
    </div>
  );
};
