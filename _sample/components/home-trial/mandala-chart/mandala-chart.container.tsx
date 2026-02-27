"use client";

import React, { useCallback, useEffect, useState } from "react";

import { MandalaChart } from "./mandala-chart";
import {
  createNewChart,
  MandalaChart as MandalaChartType,
  updateCell,
} from "./mandala-chart.logic";

const STORAGE_KEY = "mandala_charts_v2";

// --- Custom Hook for History Management ---
const useHistory = (initialState: MandalaChartType[]) => {
  const [history, setHistory] = useState<MandalaChartType[][]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback(
    (newState: MandalaChartType[]) => {
      setHistory((previous) => {
        const newHistory = previous.slice(0, currentIndex + 1);
        return [...newHistory, newState];
      });
      setCurrentIndex((previous) => previous + 1);
    },
    [currentIndex]
  );

  const currentState = history[currentIndex];

  const undo = useCallback(() => {
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((previous) => Math.min(history.length - 1, previous + 1));
  }, [history.length]);

  return {
    state: currentState,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};

export const MandalaChartContainer = () => {
  const [charts, setChartsState] = useState<MandalaChartType[]>(() => {
    if (globalThis.window === undefined) return [createNewChart("メイン目標")];
    // eslint-disable-next-line no-restricted-syntax
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [createNewChart("メイン目標")];
    } catch {
      return [createNewChart("メイン目標")];
    }
  });

  const {
    state: currentCharts,
    pushState: pushChartState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(charts);

  // useHistoryを使用しているため、chartsは表示用・保存用として管理
  // 実際には history state が Single Source of Truth になる
  const activeCharts = currentCharts;

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"full" | "focus">(() => {
    if (globalThis.window !== undefined && window.innerWidth < 768) {
      return "focus";
    }
    return "full";
  });
  const [focusIndex, setFocusIndex] = useState(4); // 0-8: sub-grid index
  const [editingCell, setEditingCell] = useState<{
    gridIdx: number;
    cellIdx: number;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "focus" : "full");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-save to LocalStorage
  useEffect(() => {
    // 初回マウント時（chartsが初期値）は保存をスキップするか、または saved のままにする
    // ここでは charts (activeCharts) が変更されたら saving にする
    const timer = setTimeout(() => {
      // eslint-disable-next-line no-restricted-syntax
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeCharts));
        setSaveStatus("saved");
      } catch {
        // 保存失敗
      }
    }, 1000);

    // activeCharts が変わった瞬間に saving にしたいが、useEffect 内だと警告が出る場合がある
    // その場合は、更新ハンドラ内で setSaveStatus("saving") を呼ぶのが定石
    return () => clearTimeout(timer);
  }, [activeCharts]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Handlers
  const handleUpdateTitle = (title: string) => {
    const newCharts = JSON.parse(JSON.stringify(activeCharts));
    if (newCharts[activeIndex]) {
      newCharts[activeIndex].title = title;
      newCharts[activeIndex].updatedAt = new Date().toISOString();
      setSaveStatus("saving");
      pushChartState(newCharts);
    }
  };

  const handleAddChart = () => {
    const newChart = createNewChart(`目標 ${activeCharts.length + 1}`);
    setSaveStatus("saving");
    pushChartState([...activeCharts, newChart]);
    setActiveIndex(activeCharts.length);
    setIsSidebarOpen(false);
    setViewMode("focus");
    setFocusIndex(4);
  };

  const handleDeleteChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCharts.length <= 1) {
      alert("最後のチャートは削除できません。");
      return;
    }
    if (
      confirm(
        "このチャートを削除してもよろしいですか？この操作は取り消せません。"
      )
    ) {
      const newCharts = activeCharts.filter((c: MandalaChartType) => c.id !== id);
      setSaveStatus("saving");
      pushChartState(newCharts);
      setActiveIndex(0);
    }
  };

  const handleUpdateCell = (
    gridIndex: number,
    cellIndex: number,
    value: string
  ) => {
    const currentChart = activeCharts[activeIndex];
    if (!currentChart) return;

    const newChart = updateCell(currentChart, gridIndex, cellIndex, value);

    const newCharts = [...activeCharts];
    newCharts[activeIndex] = newChart;
    setSaveStatus("saving");
    pushChartState(newCharts);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(activeCharts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandala-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <MandalaChart
      charts={charts}
      activeIndex={activeIndex}
      viewMode={viewMode}
      focusIndex={focusIndex}
      editingCell={editingCell}
      isSidebarOpen={isSidebarOpen}
      saveStatus={saveStatus}
      canUndo={canUndo}
      canRedo={canRedo}
      onUpdateTitle={handleUpdateTitle}
      onAddChart={handleAddChart}
      onDeleteChart={handleDeleteChart}
      onUpdateCell={handleUpdateCell}
      onChangeActiveIndex={setActiveIndex}
      onChangeViewMode={setViewMode}
      onChangeFocusIndex={setFocusIndex}
      onSetEditingCell={setEditingCell}
      onToggleSidebar={setIsSidebarOpen}
      onUndo={undo}
      onRedo={redo}
      onExport={handleExport}
    />
  );
};
