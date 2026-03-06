"use client";

import { logger } from "@/lib/logger";
import { Download, Maximize2, Minimize2, Redo2, Save, Undo2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MandalaChart } from "./mandala-chart";
import {
  HistoryState,
  MandalaChart as MandalaChartType,
  createDefaultChart,
  pushHistory,
  redoHistory,
  undoHistory,
  updateCellWithSync,
  updateChartTitle
} from "./mandala-chart.logic";
import { MandalaEditModal } from "./mandala-edit-modal/mandala-edit-modal";

const STORAGE_KEY = "mandala_charts_v2";

/**
 * マンダラチャート機能。ステート管理、同期、履歴、永続化を担当
 */
export const MandalaChartContainer = () => {
  // 1. 基本ステート
  const [history, setHistory] = useState<HistoryState<MandalaChartType[]>>(() => {
    // 初期ロード (SSR考慮)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as MandalaChartType[];
          if (parsed.length > 0) {
            return { past: [], present: parsed, future: [] };
          }
        } catch (e) {
          logger.error("Failed to parse saved data", e instanceof Error ? e : new Error(String(e)));
        }
      }
    }
    return { past: [], present: [createDefaultChart()], future: [] };
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"full" | "focus">("full");
  const [focusIndex, setFocusIndex] = useState(4); // デフォルトは中央
  const [editingCell, setEditingCell] = useState<{ gridIdx: number; cellIdx: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const charts = history.present;
  const currentChart = charts[activeIndex];

  // 2. 永続化 (1000ms デバウンス)
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [charts]);

  // 3. ブラウザ幅による自動モード切替
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("focus");
      }
    };
    handleResize(); // 初期実行
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 4. 操作ハンドラ
  const handleUpdateCell = useCallback((value: string) => {
    if (!editingCell) return;
    const nextCharts = updateCellWithSync(
      charts,
      activeIndex,
      editingCell.gridIdx,
      editingCell.cellIdx,
      value
    );
    setHistory(prev => pushHistory(prev, nextCharts));
    setEditingCell(null);
  }, [charts, activeIndex, editingCell]);

  const handleUndo = useCallback(() => {
    setHistory(prev => undoHistory(prev));
  }, []);

  const handleRedo = useCallback(() => {
    setHistory(prev => redoHistory(prev));
  }, []);

  const handleExport = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentChart));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `mandala-${currentChart.title}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [currentChart]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  if (!currentChart) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* ツールバー */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={currentChart.title}
            onChange={(e) => {
              const nextCharts = updateChartTitle(charts, activeIndex, e.target.value);
              setHistory(prev => pushHistory(prev, nextCharts));
            }}
            className="text-2xl font-black bg-transparent border-none focus:ring-0 text-neutral-800 dark:text-neutral-100"
            aria-label="チャートタイトル"
          />
          {isSaving && (
            <span className="flex items-center gap-1 text-xs text-blue-500 animate-pulse">
              <Save className="w-3 h-3" /> 保存中...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg p-1">
            <button
              onClick={handleUndo}
              disabled={history.past.length === 0}
              className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-neutral-700 disabled:opacity-30 transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={history.future.length === 0}
              className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-neutral-700 disabled:opacity-30 transition-all"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-white/20" />

          <button
            onClick={() => setViewMode(v => v === "full" ? "focus" : "full")}
            className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-all"
          >
            {viewMode === "full" ? (
              <><Minimize2 className="w-4 h-4" /> 集中モード</>
            ) : (
              <><Maximize2 className="w-4 h-4" /> 俯瞰モード</>
            )}
          </button>

          <button
            onClick={handleExport}
            className="p-2 bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg shadow hover:opacity-90 transition-all"
            title="JSON形式でエクスポート"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 集中モード時のグリッド選択 */}
      {viewMode === "focus" && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <button
              key={idx}
              onClick={() => setFocusIndex(idx)}
              className={`
                min-w-[40px] h-[40px] rounded-lg border-2 transition-all font-bold
                ${focusIndex === idx
                  ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-110"
                  : "border-transparent bg-white/10 hover:bg-white/20 text-neutral-600 dark:text-neutral-400"}
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* メインチャート */}
      <MandalaChart
        chart={currentChart}
        viewMode={viewMode}
        focusIndex={focusIndex}
        onCellClick={(gridIdx, cellIdx) => setEditingCell({ gridIdx, cellIdx })}
      />

      {/* 編集モーダル */}
      <MandalaEditModal
        isOpen={!!editingCell}
        initialValue={editingCell ? currentChart.grids[editingCell.gridIdx][editingCell.cellIdx] : ""}
        onSave={handleUpdateCell}
        onClose={() => setEditingCell(null)}
      />
    </div>
  );
};
