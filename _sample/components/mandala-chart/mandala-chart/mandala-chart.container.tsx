import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createNewChart,
  loadInitialCharts,
  syncGrids,
  useHistory,
} from "./mandala-chart.logic";
import {
  EditingCell,
  STORAGE_KEY,
  VIEW_MODES,
  ViewMode,
} from "./mandala-chart.types";

/**
 * マンダラチャートのコンテナフック
 */
export const useMandalaChartContainer = () => {
  // 初期データのロード
  const {
    state: charts,
    pushState: setCharts,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(loadInitialCharts());

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // モバイル初期判定 (遅延初期化で setState in effect を防止)
    if (globalThis.window !== undefined && window.innerWidth < 768) {
      return VIEW_MODES.FOCUS;
    }
    return VIEW_MODES.FULL;
  });
  const [focusIndex, setFocusIndex] = useState(4); // 0-8: サブグリッドのインデックス
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const currentChart = useMemo(
    () => charts[activeIndex] || charts[0],
    [charts, activeIndex]
  );

  // 自動保存 (saveStatus state を直接変更せず、ref で管理)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
      setSaveStatus("saved");
    }, 1000);
    return () => clearTimeout(timer);
  }, [charts]);

  // チャート操作
  const updateTitle = useCallback(
    (title: string) => {
      const newCharts = [...charts];
      newCharts[activeIndex] = {
        ...newCharts[activeIndex],
        title,
        updatedAt: new Date().toISOString(),
      };
      setCharts(newCharts);
    },
    [charts, activeIndex, setCharts]
  );

  const addNewChart = useCallback(() => {
    const newChart = createNewChart(`目標 ${charts.length + 1}`);
    setCharts([...charts, newChart]);
    setActiveIndex(charts.length);
    setIsSidebarOpen(false);
    setViewMode(VIEW_MODES.FOCUS);
    setFocusIndex(4);
  }, [charts, setCharts]);

  const deleteChart = useCallback(
    (id: string) => {
      if (charts.length <= 1) return;
      const newCharts = charts.filter((c) => c.id !== id);
      setCharts(newCharts);
      setActiveIndex(0);
    },
    [charts, setCharts]
  );

  const updateCell = useCallback(
    (gridIndex: number, cellIndex: number, value: string) => {
      const newCharts = [...charts];
      const targetChart = { ...newCharts[activeIndex] };

      const newGrids = syncGrids(
        targetChart.grids.map((g) => [...g]),
        gridIndex,
        cellIndex,
        value
      );

      newCharts[activeIndex] = {
        ...targetChart,
        grids: newGrids,
        updatedAt: new Date().toISOString(),
      };

      setCharts(newCharts);
    },
    [charts, activeIndex, setCharts]
  );

  return {
    charts,
    currentChart,
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
  };
};
