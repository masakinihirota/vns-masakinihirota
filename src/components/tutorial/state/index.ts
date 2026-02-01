/**
 * 状態管理システムのエクスポート
 */

export {
  GameStateManager,
  getGameStateManager,
  resetGameStateManager,
  type DialogState,
  type TutorialError,
  type TutorialGameState,
  type TutorialPhase,
} from "./game-state-manager";

export {
  useDialogControl,
  useDialog,
  useGameControl,
  useHasMap,
  useKeywordManagement,
  usePhaseTransition,
  usePlayerPosition,
  useTutorialPhase,
  useTutorialState,
} from "./use-tutorial-state";
