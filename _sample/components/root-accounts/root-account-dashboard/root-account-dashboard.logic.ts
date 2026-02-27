import { AREA_DEFINITIONS } from "../../../lib/root-account-utils";

import { RootAccount } from "./root-account-dashboard.types";

/**
 * 生誕世代の履歴エントリ
 */
export interface GenerationHistoryEntry {
  readonly from: string;
  readonly to: string;
  readonly at: string;
}

/**
 * エリア設定の履歴エントリ
 */
export interface AreaHistoryEntry {
  readonly from: string;
  readonly to: string;
  readonly at: string;
}

/**
 * ルートアカウント情報の保存（疑似API呼び出し）
 * @param _data
 */
export const saveRootAccount = async (_data: RootAccount): Promise<void> => {
  // TODO: 実際のAPI呼び出しを実装
  return new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * エリア設定の保存（疑似API呼び出し）
 * @param _areaId
 * @param _start
 * @param _end
 */
export const saveAreaSetting = async (
  _areaId: number,
  _start?: string,
  _end?: string
): Promise<void> => {
  // TODO: 実際のAPI呼び出しを実装
  return new Promise((resolve) => setTimeout(resolve, 500));
};

/**
 * 生誕世代の履歴を計算
 * @param prevHistory
 * @param previousHistory
 * @param currentGeneration
 * @param newGeneration
 */
export const calculateGenerationHistory = (
  previousHistory: readonly GenerationHistoryEntry[],
  currentGeneration: string,
  newGeneration: string
): GenerationHistoryEntry[] => {
  if (currentGeneration === newGeneration) return [...previousHistory];

  return [
    ...previousHistory,
    {
      from: currentGeneration || "未設定",
      to: newGeneration || "未設定",
      at: new Date().toISOString(),
    },
  ];
};

/**
 * エリア設定の履歴を計算
 * @param prevHistory
 * @param previousHistory
 * @param originalAreaId
 * @param targetAreaId
 */
export const calculateAreaHistory = (
  previousHistory: readonly AreaHistoryEntry[],
  originalAreaId: number | null | undefined,
  targetAreaId: number
): AreaHistoryEntry[] => {
  const fromName =
    originalAreaId && (AREA_DEFINITIONS as Record<number, { name: string }>)[originalAreaId]
      ? (AREA_DEFINITIONS as Record<number, { name: string }>)[originalAreaId].name
      : "未設定";
  const toName =
    targetAreaId && (AREA_DEFINITIONS as Record<number, { name: string }>)[targetAreaId]
      ? (AREA_DEFINITIONS as Record<number, { name: string }>)[targetAreaId].name
      : "未設定";

  const newHistory = [
    ...previousHistory,
    {
      from: fromName,
      to: toName,
      at: new Date().toISOString(),
    },
  ];

  return newHistory.slice(-1000);
};
