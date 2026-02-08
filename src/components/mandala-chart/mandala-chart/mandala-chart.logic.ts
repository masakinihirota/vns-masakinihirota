import { useCallback, useState } from 'react';
import { MandalaChartData, STORAGE_KEY } from './mandala-chart.types';

/**
 * 履歴管理用カスタムフック
 */
export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<readonly T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * 新しい状態を履歴に追加する
   */
  const pushState = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        return [...newHistory, newState];
      });
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex]
  );

  /**
   * 履歴を一つ戻す
   */
  const undo = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  /**
   * 履歴を一つ進める
   */
  const redo = useCallback(() => {
    setCurrentIndex((prev) => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  return {
    state: history[currentIndex],
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};

/**
 * 新しいチャートを生成する
 */
export const createNewChart = (title = '新しい目標'): MandalaChartData => ({
  id: crypto.randomUUID(),
  title,
  grids: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * マンダラチャートの同期ロジック
 * 中央グリッド(4)の周辺セル(0-3, 5-8) ⇔ 各サブグリッドの中心セル(4) を同期する
 */
export const syncGrids = (
  grids: string[][],
  gridIdx: number,
  cellIdx: number,
  value: string
): string[][] => {
  const newGrids = [...grids.map((grid) => [...grid])];

  // 現在の値を更新
  newGrids[gridIdx][cellIdx] = value;

  // 中央グリッドの周辺セル → 各サブグリッドの中心セル
  if (gridIdx === 4 && cellIdx !== 4) {
    newGrids[cellIdx][4] = value;
  }
  // 周辺サブグリッドの中心セル → 中央グリッドの対応セル
  else if (gridIdx !== 4 && cellIdx === 4) {
    newGrids[4][gridIdx] = value;
  }

  return newGrids;
};

/**
 * 初期データのロード
 */
export const loadInitialCharts = (): MandalaChartData[] => {
  if (typeof window === 'undefined') return [createNewChart('メイン目標')];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [createNewChart('メイン目標')];
  } catch (error) {
    console.error('Failed to load data from localStorage', error);
    return [createNewChart('メイン目標')];
  }
};
