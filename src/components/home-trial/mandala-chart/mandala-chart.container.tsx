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
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, newState];
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  const currentState = history[currentIndex];

  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));
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
  // Load initial data
  const loadInitialData = (): MandalaChartType[] => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [createNewChart("メイン目標")];
      } catch (e) {
        console.error("Failed to load data", e);
        return [createNewChart("メイン目標")];
      }
    }
    return [createNewChart("メイン目標")];
  };

  const {
    state: charts,
    pushState: setCharts,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(loadInitialData());

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"full" | "focus">("full");
  const [focusIndex, setFocusIndex] = useState(4); // 0-8: sub-grid index
  const [editingCell, setEditingCell] = useState<{
    gridIdx: number;
    cellIdx: number;
  } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Handle Resize for initial view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("focus");
      } else {
        setViewMode("full");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-save to LocalStorage
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
      setSaveStatus("saved");
    }, 1000);
    return () => clearTimeout(timer);
  }, [charts]);

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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Handlers
  const handleUpdateTitle = (title: string) => {
    const newCharts = JSON.parse(JSON.stringify(charts));
    if (newCharts[activeIndex]) {
      newCharts[activeIndex].title = title;
      newCharts[activeIndex].updatedAt = new Date().toISOString();
      setCharts(newCharts);
    }
  };

  const handleAddChart = () => {
    const newChart = createNewChart(`目標 ${charts.length + 1}`);
    setCharts([...charts, newChart]);
    setActiveIndex(charts.length);
    setIsSidebarOpen(false);
    setViewMode("focus");
    setFocusIndex(4);
  };

  const handleDeleteChart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (charts.length <= 1) {
      alert("最後のチャートは削除できません。");
      return;
    }
    if (
      confirm(
        "このチャートを削除してもよろしいですか？この操作は取り消せません。"
      )
    ) {
      const newCharts = charts.filter((c) => c.id !== id);
      setCharts(newCharts);
      setActiveIndex(0);
    }
  };

  const handleUpdateCell = (
    gridIdx: number,
    cellIdx: number,
    value: string
  ) => {
    const currentChart = charts[activeIndex];
    if (!currentChart) return;

    const newChart = updateCell(currentChart, gridIdx, cellIdx, value);

    const newCharts = [...charts];
    newCharts[activeIndex] = newChart;
    setCharts(newCharts);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(charts, null, 2)], {
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
