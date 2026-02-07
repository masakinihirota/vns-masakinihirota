"use client";

import { Trash2 } from "lucide-react";
import React from "react";
import {
  MandalaBlock as MandalaBlockType,
  GRID_POSITIONS,
} from "../mandala-editor.types";
import { MandalaCell } from "./mandala-cell";

interface MandalaBlockProps {
  block: MandalaBlockType;
  index: number;
  isCenterBlock: boolean;
  onClear: (label: string) => void;
  onCellClick?: (label: string, cellIndex: number | "title") => void;
}

export const MandalaBlock: React.FC<MandalaBlockProps> = ({
  block,
  isCenterBlock,
  onClear,
  onCellClick,
}) => {
  return (
    <div
      className={`grid grid-cols-3 grid-rows-3 gap-1 md:gap-1.5 rounded-lg p-1 h-full w-full transition-all duration-300 relative group/block shadow-sm ring-1 ${
        isCenterBlock
          ? "bg-indigo-50 dark:bg-zinc-900 ring-indigo-300 dark:ring-indigo-700 z-10 scale-105"
          : "bg-white dark:bg-zinc-900 ring-slate-200 dark:ring-zinc-800 hover:ring-indigo-200 dark:hover:ring-indigo-900 hover:bg-slate-50/50 dark:hover:bg-zinc-800/40"
      }`}
      role="group"
      aria-labelledby={`block-label-${block.label}`}
    >
      <div id={`block-label-${block.label}`} className="sr-only">
        {isCenterBlock
          ? "メイン目標ブロック"
          : `サブ目標ブロック ${block.label}`}
      </div>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellIdx) => {
        const isCellCenter = cellIdx === 4;
        const cellPeripheralIdx = GRID_POSITIONS.indexOf(cellIdx as any);
        const text = isCellCenter
          ? block.title
          : block.items[cellPeripheralIdx];
        const label = isCellCenter
          ? block.label
          : `${block.label}-${cellPeripheralIdx + 1}`;

        return (
          <MandalaCell
            key={cellIdx}
            text={text}
            label={label as string}
            isCenter={isCellCenter}
            isBlockCenter={isCenterBlock}
            onClick={() =>
              onCellClick?.(
                block.label as string,
                isCellCenter ? "title" : cellPeripheralIdx
              )
            }
          />
        );
      })}

      {/* Clear Block Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClear(isCenterBlock ? "C_GLOBAL" : (block.label as string));
        }}
        className="absolute -top-1.5 -right-1.5 bg-white dark:bg-zinc-800 text-slate-400 hover:text-red-500 rounded-full p-1 shadow-md border border-slate-200 dark:border-zinc-700 opacity-0 group-hover/block:opacity-100 transition-all hover:scale-110 z-20"
        title={
          isCenterBlock
            ? "中心目標と全サブ目標をクリア"
            : "このブロックをクリア"
        }
        aria-label={`Clear block ${block.label}`}
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
};
