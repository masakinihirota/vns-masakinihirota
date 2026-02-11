"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Grid3X3,
  Info,
  LayoutGrid,
  List,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MandalaChart as MandalaChartType } from "./mandala-chart.logic";

const EditingModal = ({
  gridPositions,
  editingCell,
  initialValue,
  onClose,
  onSave,
}: {
  gridPositions: string[];
  editingCell: { gridIdx: number; cellIdx: number };
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
}) => {
  const [localValue, setLocalValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Cursor at end
      textareaRef.current.setSelectionRange(
        localValue.length,
        localValue.length
      );
    }
  }, []);

  const handleSave = () => {
    if (localValue !== initialValue) {
      onSave(localValue);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              {gridPositions[editingCell.gridIdx]} - Position{" "}
              {editingCell.cellIdx + 1}
            </div>
            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">
              {editingCell.gridIdx === 4 && editingCell.cellIdx === 4
                ? "大目標 (Main Goal)"
                : "項目の編集"}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          aria-label="項目の編集"
          className="w-full flex-1 min-h-[180px] p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[18px] md:text-[20px] leading-relaxed resize-none mb-6 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSave}
          placeholder="ここに目標やアイデアを入力..."
        />

        <button
          onClick={() => {
            handleSave();
            onClose();
          }}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 shrink-0"
        >
          完了
        </button>

        {((editingCell.gridIdx === 4 && editingCell.cellIdx !== 4) ||
          (editingCell.gridIdx !== 4 && editingCell.cellIdx === 4)) && (
            <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs md:text-sm text-blue-700 dark:text-blue-300 shrink-0 border border-blue-100 dark:border-blue-800">
              <Info size={18} className="shrink-0 mt-0.5" />
              <span>
                このセルは他のグリッドの中心と自動的に同期されます。ここを変更すると、関連するグリッドも更新されます。
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export type MandalaChartProps = {
  charts: MandalaChartType[];
  activeIndex: number;
  viewMode: "full" | "focus";
  focusIndex: number;
  editingCell: { gridIdx: number; cellIdx: number } | null;
  isSidebarOpen: boolean;
  saveStatus: "saved" | "saving";
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  onUpdateTitle: (title: string) => void;
  onAddChart: () => void;
  onDeleteChart: (id: string, e: React.MouseEvent) => void;
  onUpdateCell: (gridIdx: number, cellIdx: number, value: string) => void;
  onChangeActiveIndex: (index: number) => void;
  onChangeViewMode: (mode: "full" | "focus") => void;
  onChangeFocusIndex: (index: number) => void; // For focus mode navigation or clicking grid in full mode
  onSetEditingCell: (cell: { gridIdx: number; cellIdx: number } | null) => void;
  onToggleSidebar: (isOpen: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
};

export const MandalaChart: React.FC<MandalaChartProps> = ({
  charts,
  activeIndex,
  viewMode,
  focusIndex,
  editingCell,
  isSidebarOpen,
  saveStatus,
  canUndo,
  canRedo,
  onUpdateTitle,
  onAddChart,
  onDeleteChart,
  onUpdateCell,
  onChangeActiveIndex,
  onChangeViewMode,
  onChangeFocusIndex,
  onSetEditingCell,
  onToggleSidebar,
  onUndo,
  onRedo,
  onExport,
}) => {
  const currentChart = charts[activeIndex] || charts[0];
  const gridPositions = [
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

  // Styles helper
  const getCellStyles = (
    gridIdx: number,
    cellIdx: number,
    isFocusView: boolean
  ) => {
    let base =
      "relative group flex items-center justify-center w-full h-full p-1 cursor-pointer transition-all duration-200 border rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ";

    if (isFocusView) {
      base += "text-[18px] md:text-xl font-medium leading-tight ";
    } else {
      base +=
        "text-[9px] md:text-[10px] lg:text-xs leading-none tracking-tight ";
    }

    if (gridIdx === 4 && cellIdx === 4) {
      return (
        base + "bg-blue-600 text-white font-bold border-blue-700 shadow-md"
      );
    }
    if (cellIdx === 4) {
      return (
        base +
        "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-bold border-blue-200 dark:border-blue-800"
      );
    }
    if (gridIdx === 4) {
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

  const MiniGrid = ({
    gridIdx,
    isFocusView,
  }: {
    gridIdx: number;
    isFocusView: boolean;
  }) => {
    const isCenterGrid = gridIdx === 4;
    const isActive = !isFocusView && focusIndex === gridIdx;

    return (
      <div
        className={`
          grid grid-cols-3 gap-0.5 p-0.5 rounded-lg border-2 transition-all h-full
          ${isCenterGrid ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800" : "bg-slate-50/50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-700"}
          ${isActive ? "ring-2 ring-blue-500 shadow-lg scale-[1.01] z-10" : ""}
        `}
      >
        {currentChart.grids[gridIdx].map((cellText, cellIdx) => (
          <button
            key={`${gridIdx}-${cellIdx}`}
            type="button"
            className={getCellStyles(gridIdx, cellIdx, isFocusView)}
            onClick={() => {
              if (!isFocusView && !isActive) {
                onChangeFocusIndex(gridIdx);
              } else {
                onSetEditingCell({ gridIdx, cellIdx });
              }
            }}
            aria-label={`${gridPositions[gridIdx]}のグリッド、セル${cellIdx + 1}: ${cellText || "空"}`}
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

  if (!currentChart) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 flex flex-col
      `}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <List size={20} /> マイチャート
          </h2>
          <button
            onClick={() => onToggleSidebar(false)}
            aria-label="サイドバーを閉じる"
            className="md:hidden p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onAddChart}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} /> 新規作成
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {charts.map((chart, idx) => (
            <div
              key={chart.id}
              onClick={() => {
                onChangeActiveIndex(idx);
                onToggleSidebar(false);
              }}
              className={`
                 group relative p-3 rounded-xl cursor-pointer border transition-all select-none
                 ${activeIndex === idx
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 ring-1 ring-blue-400"
                  : "bg-white border-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800"
                }
               `}
            >
              <div className="font-bold text-sm truncate pr-8">
                {chart.title || "無題のチャート"}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between items-center">
                <span>{new Date(chart.createdAt).toLocaleDateString()}</span>
                {idx === activeIndex && (
                  <span className="text-blue-500 font-medium">表示中</span>
                )}
              </div>

              <button
                onClick={(e) => onDeleteChart(chart.id, e)}
                className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded transition-all"
                title="削除"
                aria-label="チャートを削除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggleSidebar(true)}
              aria-label="メニューを開く"
              className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            >
              <List size={24} />
            </button>
            <div className="flex-1 min-w-0">
              <input
                aria-label="チャートのタイトル"
                value={currentChart.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-lg md:text-2xl font-bold p-0 w-full text-slate-800 dark:text-slate-100 placeholder-slate-300 truncate"
                placeholder="チャートのタイトル..."
              />
              <div className="flex items-center gap-3 text-[10px] md:text-xs h-5">
                {saveStatus === "saving" ? (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Save size={10} className="animate-spin" /> 保存中...
                  </span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 size={12} /> 自動保存済み
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* History Controls */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                title="元に戻す (Ctrl+Z)"
                aria-label="元に戻す"
              >
                <Undo2 size={18} />
              </button>
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                title="やり直す (Ctrl+Shift+Z)"
                aria-label="やり直す"
              >
                <Redo2 size={18} />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onChangeViewMode("full")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "full" ? "bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700"}`}
              >
                <LayoutGrid size={16} />
                俯瞰
              </button>
              <button
                onClick={() => onChangeViewMode("focus")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "focus" ? "bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Grid3X3 size={16} />
                集中
              </button>
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 p-2 md:p-6 lg:p-8 flex justify-center items-start md:items-center">
          {viewMode === "full" && (
            <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-300">
              <div className="md:hidden mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3 shadow-sm">
                <Info size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-1">画面サイズが小さすぎます</p>
                  <p>
                    9x9の全体表示は文字が読みづらくなります。「集中モード」に切り替えての編集を推奨します。
                  </p>
                  <button
                    onClick={() => onChangeViewMode("focus")}
                    className="mt-2 text-xs bg-amber-200 dark:bg-amber-800 px-3 py-1 rounded-full font-bold hover:brightness-95"
                  >
                    集中モードへ切替
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 md:gap-3 lg:gap-4 aspect-square max-h-[85vh] mx-auto p-1">
                {currentChart.grids.map((_, idx) => (
                  <div key={`full-${idx}`} className="relative w-full h-full">
                    <MiniGrid gridIdx={idx} isFocusView={false} />
                    <div className="absolute -top-1.5 -left-1.5 md:-top-3 md:-left-3 px-1.5 md:px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] md:text-[10px] font-bold text-slate-500 shadow-sm z-20 pointer-events-none">
                      {gridPositions[idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === "focus" && (
            <div className="w-full max-w-xl flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 duration-300 min-h-full py-4">
              <div className="w-full flex justify-between items-center mb-4 md:mb-8 px-2">
                <button
                  onClick={() =>
                    onChangeFocusIndex(focusIndex > 0 ? focusIndex - 1 : 8)
                  }
                  className="p-3 md:p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:scale-105 shadow-md transition-all text-slate-600 dark:text-slate-300"
                  aria-label="前のセクションへ"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-1">
                    Grid {focusIndex + 1} / 9
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                    {gridPositions[focusIndex]}
                    {focusIndex === 4 && (
                      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm align-middle">
                        MAIN
                      </span>
                    )}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    onChangeFocusIndex(focusIndex < 8 ? focusIndex + 1 : 0)
                  }
                  className="p-3 md:p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:scale-105 shadow-md transition-all text-slate-600 dark:text-slate-300"
                  aria-label="次のセクションへ"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="w-full aspect-square shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 md:p-4 ring-1 ring-slate-900/5">
                <MiniGrid gridIdx={focusIndex} isFocusView={true} />
              </div>

              <div className="mt-8 text-slate-400 text-xs md:text-sm flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                <Info size={16} className="text-blue-500" />
                <span>セルをタップして編集 (文字サイズ18px以上)</span>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <div className="hidden md:flex p-3 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 justify-between items-center text-xs text-slate-400 shrink-0">
          <div>
            Last saved: {new Date(currentChart.updatedAt).toLocaleTimeString()}
          </div>
          <button
            onClick={onExport}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Download size={14} /> JSONエクスポート
          </button>
        </div>
      </div>

      {/* Editing Modal */}
      {editingCell && (
        <EditingModal
          gridPositions={gridPositions}
          editingCell={editingCell}
          initialValue={
            currentChart.grids[editingCell.gridIdx][editingCell.cellIdx]
          }
          onClose={() => onSetEditingCell(null)}
          onSave={(value) =>
            onUpdateCell(editingCell.gridIdx, editingCell.cellIdx, value)
          }
        />
      )}

    </div>
  );
};
