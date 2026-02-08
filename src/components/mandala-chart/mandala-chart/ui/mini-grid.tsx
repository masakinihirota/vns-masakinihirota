import { Edit3 } from "lucide-react";
import React from "react";

interface MiniGridProps {
  gridIdx: number;
  grids: readonly (readonly string[])[];
  isFocusView: boolean;
  focusIndex: number;
  onCellClick: (gridIdx: number, cellIdx: number) => void;
  onFocusGrid: (gridIdx: number) => void;
}

const GRID_POSITIONS = [
  "左上",
  "上",
  "右上",
  "左",
  "中央",
  "右",
  "左下",
  "下",
  "右下",
];

/**
 * 3x3のサブグリッド描画コンポーネント
 */
export const MiniGrid: React.FC<MiniGridProps> = ({
  gridIdx,
  grids,
  isFocusView,
  focusIndex,
  onCellClick,
  onFocusGrid,
}) => {
  const isCenterGrid = gridIdx === 4;
  const isActive = !isFocusView && focusIndex === gridIdx;

  const getCellStyles = (gIdx: number, cIdx: number) => {
    let base =
      "relative group flex items-center justify-center w-full h-full p-1 cursor-pointer transition-all duration-200 border rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ";

    if (isFocusView) {
      base += "text-[18px] md:text-xl font-medium leading-tight h-24 md:h-32 ";
    } else {
      base +=
        "text-[9px] md:text-[10px] lg:text-xs leading-none tracking-tight ";
    }

    if (gIdx === 4 && cIdx === 4) {
      return (
        base + "bg-blue-600 text-white font-bold border-blue-700 shadow-md"
      );
    }
    if (cIdx === 4) {
      return (
        base +
        "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-bold border-blue-200 dark:border-blue-800"
      );
    }
    if (gIdx === 4) {
      return (
        base +
        "bg-blue-50 dark:bg-blue-950/30 text-slate-800 dark:text-slate-200 border-blue-100 dark:border-blue-900"
      );
    }
    return (
      base +
      "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
    );
  };

  return (
    <div
      className={`
        grid grid-cols-3 gap-0.5 p-0.5 rounded-lg border-2 transition-all h-full
        ${isCenterGrid ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800" : "bg-slate-50/50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-700"}
        ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-[1.01] z-10" : ""}
      `}
    >
      {grids[gridIdx].map((cellText, cellIdx) => (
        <button
          key={`${gridIdx}-${cellIdx}`}
          type="button"
          className={getCellStyles(gridIdx, cellIdx)}
          onClick={() => {
            if (!isFocusView && !isActive) {
              onFocusGrid(gridIdx);
            } else {
              onCellClick(gridIdx, cellIdx);
            }
          }}
          aria-label={`${GRID_POSITIONS[gridIdx]}のグリッド、セル${cellIdx + 1}: ${cellText || "空"}`}
        >
          <span className="w-full text-center break-words overflow-hidden line-clamp-3 pointer-events-none">
            {cellText}
          </span>

          <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 size={isFocusView ? 14 : 8} className="text-slate-400" />
          </div>

          {((gridIdx === 4 && cellIdx !== 4) ||
            (gridIdx !== 4 && cellIdx === 4)) && (
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-blue-400/60" />
          )}
        </button>
      ))}
    </div>
  );
};
