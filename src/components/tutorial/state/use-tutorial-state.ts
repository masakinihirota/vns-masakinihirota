/**
 * チュートリアル状態管理用 React Hooks
 */

import { useEffect, useState } from "react";
import type {
  DialogState,
  TutorialGameState,
  TutorialPhase,
} from "./game-state-manager";
import { getGameStateManager } from "./game-state-manager";

/**
 * 統合状態を購読するフック
 */
export function useTutorialState() {
  const manager = getGameStateManager();
  const [state, setState] = useState<TutorialGameState>(
    () => manager.getState() as TutorialGameState
  );

  useEffect(() => {
    const unsubscribe = manager.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, [manager]);

  return state;
}

/**
 * プレイヤー位置のみを購読するフック
 */
export function usePlayerPosition() {
  const state = useTutorialState();
  return state.playerPosition;
}

/**
 * 現在のフェーズと行インデックスを購読するフック
 */
export function useTutorialPhase() {
  const state = useTutorialState();
  return { phase: state.currentPhase, lineIndex: state.lineIndex };
}

/**
 * マップ取得状態を購読するフック
 */
export function useHasMap() {
  const state = useTutorialState();
  return state.hasMap;
}

/**
 * ダイアログ状態を購読するフック
 */
export function useDialog() {
  const state = useTutorialState();
  return state.dialog;
}

/**
 * ユーティリティ関数 - フェーズ遷移
 */
export function usePhaseTransition() {
  const manager = getGameStateManager();

  return {
    goToPhase: (phase: TutorialPhase, lineIndex?: number) =>
      manager.goToPhase(phase, lineIndex),
    advanceLine: () => manager.advanceLine(),
    regressLine: () => manager.regressLine(),
  };
}

/**
 * ユーティリティ関数 - ダイアログ制御
 */
export function useDialogControl() {
  const manager = getGameStateManager();

  return {
    showDialog: (dialog: DialogState) => manager.showDialog(dialog),
    closeDialog: () => manager.closeDialog(),
  };
}

/**
 * ユーティリティ関数 - ゲーム制御
 */
export function useGameControl() {
  const manager = getGameStateManager();

  return {
    setPaused: (isPaused: boolean) => manager.setPaused(isPaused),
    setSpeed: (speed: "instant" | "fast" | "normal") => manager.setSpeed(speed),
    setHasMap: (hasMap: boolean) => manager.setHasMap(hasMap),
    updatePlayerPosition: (x: number, y: number) =>
      manager.updatePlayerPosition(x, y),
    discoverEntity: (entityId: string) => manager.discoverEntity(entityId),
    logError: (code: string, message: string, context?: Record<string, any>) =>
      manager.logError(code, message, context),
  };
}

/**
 * ユーティリティ関数 - キーワード管理
 */
export function useKeywordManagement() {
  const state = useTutorialState();
  const manager = getGameStateManager();

  return {
    unlockedKeywordIds: state.unlockedKeywordIds,
    learnedKeywordIds: state.learnedKeywordIds,
    unlockKeyword: (keywordId: string) => manager.unlockKeyword(keywordId),
    learnKeyword: (keywordId: string) => manager.learnKeyword(keywordId),
  };
}
