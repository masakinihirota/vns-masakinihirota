/**
 * マンダラチャートのデータ型およびロジック
 */

/**
 * 3x3のグリッドデータを表す型
 * 0:左上, 1:上, 2:右上, 3:左, 4:中央, 5:右, 6:左下, 7:下, 8:右下
 */
export type MandalaGridData = string[];

/**
 * マンダラチャート全体のデータを表す型
 * grids[4] が中央のメイングリッド、それ以外が周辺のグリッド
 */
export interface MandalaChart {
  id: string;
  title: string;
  grids: MandalaGridData[]; // 9個の要素を持つ配列。各要素は9個のstringを持つ配列
  createdAt: string;
  updatedAt: string;
}

/**
 * 初期状態のデータを作成する
 */
export const createDefaultChart = (): MandalaChart => {
  const emptyGrid = (): MandalaGridData => Array(9).fill("");
  return {
    id: crypto.randomUUID(),
    title: "メイン目標",
    grids: Array(9).fill(null).map(() => emptyGrid()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * セル更新時の同期ロジックを適用した新しいチャートデータを返す
 * @param charts 現在のチャート配列
 * @param activeIndex 編集対象のチャートインデックス
 * @param gridIdx 編集対象のグリッドインデックス (0-8)
 * @param cellIdx 編集対象のセルインデックス (0-8)
 * @param value 新しい値
 */
export const updateCellWithSync = (
  charts: readonly MandalaChart[],
  activeIndex: number,
  gridIdx: number,
  cellIdx: number,
  value: string
): MandalaChart[] => {
  const newCharts = JSON.parse(JSON.stringify(charts)) as MandalaChart[];
  const chart = newCharts[activeIndex];
  if (!chart) return newCharts;

  // 1. 指定されたセルを更新
  chart.grids[gridIdx][cellIdx] = value;

  // 2. 同期ロジックの適用 (仕様書 3.2 準拠)
  if (gridIdx === 4) {
    // 中央グリッドの周辺セルを更新した場合 -> 対応する周辺グリッドの中心セルを更新
    if (cellIdx !== 4) {
      chart.grids[cellIdx][4] = value;
    }
  } else {
    // 周辺グリッドの中心セルを更新した場合 -> 中央グリッドの対応するセルを更新
    if (cellIdx === 4) {
      chart.grids[4][gridIdx] = value;
    }
  }

  chart.updatedAt = new Date().toISOString();
  return newCharts;
};

/**
 * タイトルを更新した新しいチャートデータを返す
 */
export const updateChartTitle = (
  charts: readonly MandalaChart[],
  activeIndex: number,
  title: string
): MandalaChart[] => {
  const newCharts = [...charts];
  newCharts[activeIndex] = {
    ...newCharts[activeIndex],
    title,
    updatedAt: new Date().toISOString(),
  };
  return newCharts;
};

/**
 * 履歴管理のためのユーティリティ (カスタムフックとして使用される想定)
 */
export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const pushHistory = <T>(state: HistoryState<T>, nextPresent: T): HistoryState<T> => {
  // 現在と同じなら何もしない (簡易チェック)
  if (JSON.stringify(state.present) === JSON.stringify(nextPresent)) {
    return state;
  }
  return {
    past: [...state.past, state.present],
    present: nextPresent,
    future: [], // ブランチができるため未来はクリア
  };
};

export const undoHistory = <T>(state: HistoryState<T>): HistoryState<T> => {
  if (state.past.length === 0) return state;
  const previous = state.past[state.past.length - 1];
  const newPast = state.past.slice(0, state.past.length - 1);
  return {
    past: newPast,
    present: previous,
    future: [state.present, ...state.future],
  };
};

export const redoHistory = <T>(state: HistoryState<T>): HistoryState<T> => {
  if (state.future.length === 0) return state;
  const next = state.future[0];
  const newFuture = state.future.slice(1);
  return {
    past: [...state.past, state.present],
    present: next,
    future: newFuture,
  };
};
