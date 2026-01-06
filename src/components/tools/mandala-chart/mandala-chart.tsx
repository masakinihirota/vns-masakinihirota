"use client";

import {
  ZoomIn,
  Grid,
  Maximize2,
  Download,
  ChevronLeft,
  ChevronRight,
  Info,
  Settings2,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";

const MODELS = {
  BUDDHIST: {
    id: "buddhist",
    name: "公式モデル",
    description:
      "仏教の曼荼羅に由来。下から左へ展開し、最後に四隅を埋める伝統的な思考順序です。",
    // インデックス: [0:TL, 1:TC, 2:TR, 3:ML, 4:MC, 5:MR, 6:BL, 7:BC, 8:BR]
    order: [6, 3, 7, 2, "★", 4, 5, 1, 8],
  },
  OHTANI: {
    id: "ohtani",
    name: "大谷モデル",
    description:
      "左上から時計回りに展開。優先順位を整理しやすく、現代の目標達成で最も一般的な形式です。",
    order: [1, 2, 3, 8, "★", 4, 7, 6, 5],
  },
  STANDARD: {
    id: "standard",
    name: "標準モデル",
    description: "左上から右下へ、一般的な読み書きの順序に従った配置です。",
    order: [1, 2, 3, 4, "★", 5, 6, 7, 8],
  },
} as const;

export const MandalaChart: React.FC = () => {
  const [blocks, setBlocks] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(""))
  );
  const [focusedBlock, setFocusedBlock] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<{
    blockIdx: number;
    cellIdx: number;
  } | null>(null);
  const [activeModel, setActiveModel] =
    useState<keyof typeof MODELS>("BUDDHIST");

  const updateCell = (blockIdx: number, cellIdx: number, value: string) => {
    const newBlocks = [...blocks.map((b) => [...b])];
    newBlocks[blockIdx][cellIdx] = value;

    if (blockIdx === 4 && cellIdx !== 4) {
      const mapping = [0, 1, 2, 3, null, 5, 6, 7, 8];
      const targetBlockIdx = mapping[cellIdx];
      if (targetBlockIdx !== null) {
        newBlocks[targetBlockIdx][4] = value;
      }
    } else if (blockIdx !== 4 && cellIdx === 4) {
      const reverseMapping = [0, 1, 2, 3, null, 5, 6, 7, 8];
      const targetCellIdx = reverseMapping.indexOf(blockIdx);
      if (targetCellIdx !== -1) {
        newBlocks[4][targetCellIdx] = value;
      }
    }
    setBlocks(newBlocks);
  };

  const getCellStyles = (bIdx: number, cIdx: number) => {
    const isMainCenter = bIdx === 4 && cIdx === 4;
    const isSubCenter =
      (bIdx === 4 && cIdx !== 4) || (bIdx !== 4 && cIdx === 4);
    if (isMainCenter) return "bg-indigo-600 text-white font-bold z-10";
    if (isSubCenter)
      return "bg-indigo-50 text-indigo-700 font-semibold border-indigo-100";
    return "bg-white text-slate-600 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800";
  };

  const Block = ({
    blockIdx,
    isFocused,
  }: {
    blockIdx: number;
    isFocused: boolean;
  }) => (
    <div
      className={`
      grid grid-cols-3 gap-[1px] bg-slate-300 dark:bg-zinc-700 p-[1px] transition-all duration-300
      ${isFocused ? "rounded-xl overflow-hidden max-w-2xl mx-auto shadow-2xl" : "h-full"}
    `}
    >
      {blocks[blockIdx].map((content, cellIdx) => (
        <div
          key={cellIdx}
          onClick={() => {
            if (focusedBlock === null && blockIdx !== 4)
              setFocusedBlock(blockIdx);
            setActiveCell({ blockIdx, cellIdx });
          }}
          className={`
            relative aspect-square flex items-center justify-center p-1 text-[9px] sm:text-[11px] md:text-xs text-center cursor-pointer transition-colors
            ${getCellStyles(blockIdx, cellIdx)}
            ${activeCell?.blockIdx === blockIdx && activeCell?.cellIdx === cellIdx ? "ring-2 ring-inset ring-indigo-400 z-20" : ""}
          `}
        >
          {activeCell?.blockIdx === blockIdx &&
          activeCell?.cellIdx === cellIdx ? (
            <textarea
              autoFocus
              className="absolute inset-0 w-full h-full p-1 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none resize-none z-30 text-center flex items-center justify-center font-medium"
              value={content}
              onChange={(e) => updateCell(blockIdx, cellIdx, e.target.value)}
              onBlur={() => setActiveCell(null)}
              placeholder={blockIdx === 4 && cellIdx === 4 ? "メイン目標" : ""}
            />
          ) : (
            <span className="line-clamp-3 px-0.5 leading-tight">
              {content || (blockIdx === 4 && cellIdx === 4 ? "テーマ" : "")}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 p-2 md:p-6 font-sans transition-colors duration-500">
      <header className="max-w-4xl mx-auto mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            <Grid className="text-indigo-600" size={24} />
            Mandala Goal Chart
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {focusedBlock !== null && (
            <button
              onClick={() => setFocusedBlock(null)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-white dark:bg-zinc-900 text-indigo-600 border border-indigo-100 dark:border-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-800 shadow-sm flex items-center gap-2 transition-all"
            >
              <Maximize2 size={16} /> 全体表示
            </button>
          )}
          <button className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Model Selection Tabs */}
      <nav className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-2 text-slate-600 dark:text-zinc-400 font-bold text-sm">
          <Settings2 size={16} /> 書き順ガイドの選択
        </div>
        <div className="bg-slate-200 dark:bg-zinc-900 p-1 rounded-xl flex gap-1 shadow-inner">
          {Object.keys(MODELS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveModel(key as keyof typeof MODELS)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all ${activeModel === key ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800"}`}
            >
              {MODELS[key as keyof typeof MODELS].name}
            </button>
          ))}
        </div>

        {/* 重要：注意書きの明示 */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
            <RefreshCw size={12} className="shrink-0" />
            <span>
              ※タブを切り替えると、数字の表示順序（書き順のガイド）のみが切り替わります。入力内容は保持されます。
            </span>
          </div>
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-900/50 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-start gap-2 shadow-sm">
            <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
            {MODELS[activeModel].description}
          </p>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto">
        {focusedBlock === null ? (
          /* 9x9 Overview Mode */
          <div className="grid grid-cols-3 gap-1 md:gap-3 bg-slate-300 dark:bg-zinc-700 p-1 rounded-xl shadow-2xl overflow-hidden border border-slate-300 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div
                key={idx}
                className="relative group bg-white dark:bg-zinc-900"
              >
                {/* Dynamic Order Badge */}
                <div
                  className={`
                  absolute top-0 left-0 px-3 py-1 text-sm sm:text-base font-black z-20 rounded-br-lg shadow-md pointer-events-none
                  ${
                    idx === 4
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-700 dark:bg-zinc-800 text-white"
                  }
                `}
                >
                  {MODELS[activeModel].order[idx]}
                </div>

                <Block blockIdx={idx} isFocused={false} />

                {idx !== 4 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedBlock(idx);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 z-10 border border-indigo-100 dark:border-zinc-800"
                  >
                    <ZoomIn size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Focus Mode */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => setFocusedBlock(null)}
                className="flex items-center gap-2 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 font-bold transition-colors"
              >
                <ChevronLeft size={24} /> 一覧へ戻る
              </button>
              <div className="flex gap-2">
                <button
                  disabled={focusedBlock === 0}
                  onClick={() => setFocusedBlock(Math.max(0, focusedBlock - 1))}
                  className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full shadow-sm disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  disabled={focusedBlock === 8}
                  onClick={() => setFocusedBlock(Math.min(8, focusedBlock + 1))}
                  className="p-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full shadow-sm disabled:opacity-20 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800">
              <div className="mb-6 text-center">
                <div className="inline-flex flex-col items-center">
                  <span className="text-sm font-black text-white px-5 py-2 bg-slate-700 dark:bg-zinc-800 rounded-full mb-3 shadow-md tracking-widest uppercase">
                    SECTION {MODELS[activeModel].order[focusedBlock]}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-200">
                    {blocks[4][focusedBlock] ||
                      `サブテーマ ${MODELS[activeModel].order[focusedBlock]}`}
                  </h2>
                </div>
              </div>
              <Block blockIdx={focusedBlock} isFocused={true} />
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-500 dark:text-zinc-500">
        <div className="bg-white/60 dark:bg-zinc-900/60 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 dark:text-zinc-600 mb-2 uppercase tracking-tighter flex items-center gap-1">
            <Info size={12} /> マンダラチャートの書き方
          </h4>
          <p className="text-[10px] md:text-xs leading-relaxed">
            まずは中央の「テーマ」を決め、そこから派生する8つのサブテーマを「1」から順に埋めていきましょう。型にこだわりすぎず、思いつく場所から自由に埋めていくことが最も重要です。
          </p>
        </div>
        <div className="flex flex-col justify-center items-center md:items-end text-[10px] space-y-1 opacity-70">
          <p>曼荼羅（マンダラ）思考 - 仏教由来の目標達成フレームワーク</p>
          <p>定期的に見直し、具体的な行動へと繋げましょう</p>
        </div>
      </footer>
    </div>
  );
};
