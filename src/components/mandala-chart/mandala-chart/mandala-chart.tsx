import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Grid3X3,
  Info,
  LayoutGrid,
  Redo2,
  Save,
  Undo2
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useMandalaChartContainer } from './mandala-chart.container';
import { VIEW_MODES } from './mandala-chart.types';
import { EditModal } from './ui/edit-modal';
import { MiniGrid } from './ui/mini-grid';
import { Sidebar } from './ui/sidebar';

const GRID_POSITIONS = ["左上", "上", "右上", "左", "中央", "右", "左下", "下", "右下"];

/**
 * マンダラチャートメインコンポーネント (View)
 */
export const MandalaChart: React.FC = () => {
  const {
    currentChart,
    charts,
    activeIndex,
    setActiveIndex,
    viewMode,
    setViewMode,
    focusIndex,
    setFocusIndex,
    editingCell,
    setEditingCell,
    isSidebarOpen,
    setIsSidebarOpen,
    saveStatus,
    undo,
    redo,
    canUndo,
    canRedo,
    updateTitle,
    addNewChart,
    deleteChart,
    updateCell,
  } = useMandalaChartContainer();

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(charts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mandala-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        charts={charts}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={addNewChart}
        onDelete={(id) => {
          if (confirm("このチャートを削除してもよろしいですか？この操作は取り消せません。")) {
            deleteChart(id);
          }
        }}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* ヘッダー */}
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500" aria-label="サイドバーを開く">
              <LayoutGrid size={24} />
            </button>
            <div className="flex-1 min-w-0">
              <input
                value={currentChart.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-lg md:text-2xl font-bold p-0 w-full text-slate-800 dark:text-slate-100 placeholder-slate-300 truncate"
                placeholder="チャートのタイトル..."
                aria-label="チャートのタイトル"
              />
              <div className="flex items-center gap-3 text-[10px] md:text-xs h-5">
                {saveStatus === 'saving' ? (
                  <span className="text-slate-400 flex items-center gap-1"><Save size={10} className="animate-spin" /> 保存中...</span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12} /> 自動保存済み</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                title="元に戻す (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                title="やり直す (Ctrl+Shift+Z)"
              >
                <Redo2 size={18} />
              </button>
            </div>

            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode(VIEW_MODES.FULL)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === VIEW_MODES.FULL ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutGrid size={16} />
                俯瞰
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.FOCUS)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === VIEW_MODES.FOCUS ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Grid3X3 size={16} />
                集中
              </button>
            </div>
          </div>
        </header>

        {/* ワークスペース */}
        <main role="main" className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950/50 p-2 md:p-6 lg:p-8 flex justify-center items-start md:items-center">
          {viewMode === VIEW_MODES.FULL && (
            <div className="w-full max-w-6xl animate-in fade-in zoom-in duration-300">
              <div className="grid grid-cols-3 gap-1 md:gap-3 lg:gap-4 aspect-square max-h-[85vh] mx-auto p-1">
                {currentChart.grids.map((_, idx) => (
                  <div key={`full-${idx}`} className="relative w-full h-full">
                    <MiniGrid
                      gridIdx={idx}
                      grids={currentChart.grids}
                      isFocusView={false}
                      focusIndex={focusIndex}
                      onCellClick={(gIdx, cIdx) => setEditingCell({ gridIdx: gIdx, cellIdx: cIdx })}
                      onFocusGrid={setFocusIndex}
                    />
                    <div className="absolute -top-1.5 -left-1.5 md:-top-3 md:-left-3 px-1.5 md:px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-[8px] md:text-[10px] font-bold text-slate-500 shadow-sm z-20 pointer-events-none">
                      {GRID_POSITIONS[idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === VIEW_MODES.FOCUS && (
            <div className="w-full max-w-xl flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 duration-300 min-h-full py-4">
              <div className="w-full flex justify-between items-center mb-4 md:mb-8 px-2">
                <button
                  onClick={() => setFocusIndex(p => (p > 0 ? p - 1 : 8))}
                  className="p-3 md:p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:scale-105 shadow-md transition-all text-slate-600 dark:text-slate-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block mb-1">
                    Grid {focusIndex + 1} / 9
                  </span>
                  <h2 className="text-xl md:text-3xl font-bold flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                    {GRID_POSITIONS[focusIndex]}
                    {focusIndex === 4 && <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm align-middle">MAIN</span>}
                  </h2>
                </div>
                <button
                  onClick={() => setFocusIndex(p => (p < 8 ? p + 1 : 0))}
                  className="p-3 md:p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:scale-105 shadow-md transition-all text-slate-600 dark:text-slate-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="w-full aspect-square shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 md:p-4 ring-1 ring-slate-900/5">
                <MiniGrid
                  gridIdx={focusIndex}
                  grids={currentChart.grids}
                  isFocusView={true}
                  focusIndex={focusIndex}
                  onCellClick={(gIdx, cIdx) => setEditingCell({ gridIdx: gIdx, cellIdx: cIdx })}
                  onFocusGrid={setFocusIndex}
                />
              </div>
              <div className="mt-8 text-slate-400 text-xs md:text-sm flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
                <Info size={16} className="text-blue-500" />
                <span>セルをタップして編集 (文字サイズ18px以上)</span>
              </div>
            </div>
          )}
        </main>

        <footer className="hidden md:flex p-3 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 justify-between items-center text-xs text-slate-400 shrink-0">
          <div>
            Last updated: {new Date(currentChart.updatedAt).toLocaleTimeString()}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Download size={14} /> JSONエクスポート
          </button>
        </footer>
      </div>

      {editingCell && (
        <EditModal
          editingCell={editingCell}
          value={currentChart.grids[editingCell.gridIdx][editingCell.cellIdx]}
          onUpdate={updateCell}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  );
};
