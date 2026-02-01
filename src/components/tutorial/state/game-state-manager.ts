/**
 * チュートリアル統合状態管理システム
 * React, Phaser, イベントシステムの状態を一元化
 */

type StateListener = (state: TutorialGameState) => void;

export interface TutorialGameState {
  playerPosition: { x: number; y: number };
  hasMap: boolean;
  currentPhase: TutorialPhase;
  lineIndex: number;
  discoveredEntities: Set<string>;
  isPaused: boolean;
  speed: "instant" | "fast" | "normal";
  unlockedKeywordIds: string[];
  learnedKeywordIds: string[];
  dialog: DialogState | null;
  errors: TutorialError[];
}

export type TutorialPhase =
  | "scene1"
  | "scene2"
  | "quest"
  | "map_found"
  | "explore"
  | "return_to_queen"
  | "guide_intro"
  | "account_creation"
  | "mask_intro"
  | "end";

export interface DialogState {
  show: boolean;
  title: string;
  message: string;
  speaker?: "Queen" | "Guide" | "System";
}

export interface TutorialError {
  id: string;
  code: string;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
}

export class GameStateManager {
  private state: TutorialGameState;
  private listeners: Set<StateListener> = new Set();
  private errorHandlers: Map<string, (error: TutorialError) => void> = new Map();

  constructor(initialState?: Partial<TutorialGameState>) {
    this.state = {
      playerPosition: { x: 0, y: 0 },
      hasMap: false,
      currentPhase: "scene1",
      lineIndex: 0,
      discoveredEntities: new Set(),
      isPaused: false,
      speed: "normal",
      unlockedKeywordIds: [],
      learnedKeywordIds: [],
      dialog: null,
      errors: [],
      ...initialState,
    };
  }

  /**
   * 状態変更をリッスン
   */
  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // アンサブスクライブ関数を返す
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * エラーハンドラを登録
   */
  onError(code: string, handler: (error: TutorialError) => void): void {
    this.errorHandlers.set(code, handler);
  }

  /**
   * 状態を通知
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  /**
   * プレイヤー位置を更新
   */
  updatePlayerPosition(x: number, y: number): void {
    if (
      Math.abs(this.state.playerPosition.x - x) > 0.1 ||
      Math.abs(this.state.playerPosition.y - y) > 0.1
    ) {
      this.state.playerPosition = { x, y };
      this.notify();
    }
  }

  /**
   * マップ取得状態を更新
   */
  setHasMap(hasMap: boolean): void {
    if (this.state.hasMap !== hasMap) {
      this.state.hasMap = hasMap;
      this.notify();
    }
  }

  /**
   * フェーズ遷移
   */
  goToPhase(phase: TutorialPhase, lineIndex: number = 0): void {
    this.state.currentPhase = phase;
    this.state.lineIndex = lineIndex;
    this.notify();
  }

  /**
   * 次の行に進む
   */
  advanceLine(): void {
    this.state.lineIndex += 1;
    this.notify();
  }

  /**
   * 前の行に戻る
   */
  regressLine(): void {
    if (this.state.lineIndex > 0) {
      this.state.lineIndex -= 1;
      this.notify();
    }
  }

  /**
   * 一時停止/再開
   */
  setPaused(isPaused: boolean): void {
    this.state.isPaused = isPaused;
    this.notify();
  }

  /**
   * 文字表示速度を変更
   */
  setSpeed(speed: "instant" | "fast" | "normal"): void {
    this.state.speed = speed;
    this.notify();
  }

  /**
   * キーワードをアンロック
   */
  unlockKeyword(keywordId: string): void {
    if (!this.state.unlockedKeywordIds.includes(keywordId)) {
      this.state.unlockedKeywordIds.push(keywordId);
      this.notify();
    }
  }

  /**
   * キーワードを習得
   */
  learnKeyword(keywordId: string): void {
    if (!this.state.learnedKeywordIds.includes(keywordId)) {
      this.state.learnedKeywordIds.push(keywordId);
      this.notify();
    }
  }

  /**
   * エンティティを発見済みにする
   */
  discoverEntity(entityId: string): void {
    this.state.discoveredEntities.add(entityId);
    this.notify();
  }

  /**
   * ダイアログを表示
   */
  showDialog(dialog: DialogState): void {
    this.state.dialog = dialog;
    this.notify();
  }

  /**
   * ダイアログを閉じる
   */
  closeDialog(): void {
    this.state.dialog = null;
    this.notify();
  }

  /**
   * エラーを記録
   */
  logError(code: string, message: string, context?: Record<string, any>): void {
    const error: TutorialError = {
      id: `${code}-${Date.now()}`,
      code,
      message,
      timestamp: Date.now(),
      context,
    };

    this.state.errors.push(error);

    // 最新10個のエラーだけ保持
    if (this.state.errors.length > 10) {
      this.state.errors = this.state.errors.slice(-10);
    }

    // エラーハンドラがあれば実行
    const handler = this.errorHandlers.get(code);
    if (handler) {
      handler(error);
    }

    this.notify();
  }

  /**
   * 現在の状態を取得
   */
  getState(): Readonly<TutorialGameState> {
    return Object.freeze({ ...this.state });
  }

  /**
   * 状態をリセット
   */
  reset(): void {
    this.state = {
      playerPosition: { x: 0, y: 0 },
      hasMap: false,
      currentPhase: "scene1",
      lineIndex: 0,
      discoveredEntities: new Set(),
      isPaused: false,
      speed: "normal",
      unlockedKeywordIds: [],
      learnedKeywordIds: [],
      dialog: null,
      errors: [],
    };
    this.notify();
  }

  /**
   * 状態をシリアライズ（保存用）
   */
  serialize() {
    return {
      phase: this.state.currentPhase,
      lineIndex: this.state.lineIndex,
      hasMap: this.state.hasMap,
      discoveredEntities: Array.from(this.state.discoveredEntities),
      unlockedKeywordIds: this.state.unlockedKeywordIds,
      learnedKeywordIds: this.state.learnedKeywordIds,
    };
  }

  /**
   * 状態をデシリアライズ（復元用）
   */
  deserialize(data: any): void {
    if (data.phase) this.state.currentPhase = data.phase;
    if (data.lineIndex !== undefined) this.state.lineIndex = data.lineIndex;
    if (data.hasMap !== undefined) this.state.hasMap = data.hasMap;
    if (data.discoveredEntities) {
      this.state.discoveredEntities = new Set(data.discoveredEntities);
    }
    if (data.unlockedKeywordIds)
      this.state.unlockedKeywordIds = data.unlockedKeywordIds;
    if (data.learnedKeywordIds)
      this.state.learnedKeywordIds = data.learnedKeywordIds;
    this.notify();
  }
}

/**
 * グローバル状態マネージャーのシングルトンインスタンス
 */
let gameStateManagerInstance: GameStateManager | null = null;

export function getGameStateManager(): GameStateManager {
  if (!gameStateManagerInstance) {
    gameStateManagerInstance = new GameStateManager();
  }
  return gameStateManagerInstance;
}

/**
 * 状態マネージャーをリセット（テスト用）
 */
export function resetGameStateManager(): void {
  gameStateManagerInstance = null;
}
