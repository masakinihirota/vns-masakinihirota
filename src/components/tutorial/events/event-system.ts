/**
 * チュートリアルイベント実行エンジン
 * Phaser Scene から独立したイベント処理
 */

import type {
  EventAction,
  EventResult,
  GameContext,
  TutorialEvent,
} from "./types";

export class EventSystem {
  private executedEvents: Set<string> = new Set();
  private eventHandlers: Map<string, (context: GameContext) => Promise<void>> =
    new Map();
  private actionListeners: Map<string, (action: EventAction) => void> =
    new Map();

  /**
   * カスタムイベントハンドラーを登録
   */
  registerHandler(
    eventId: string,
    handler: (context: GameContext) => Promise<void>
  ) {
    this.eventHandlers.set(eventId, handler);
  }

  /**
   * アクション実行時のリスナーを登録
   */
  onAction(actionType: string, listener: (action: EventAction) => void) {
    this.actionListeners.set(actionType, listener);
  }

  /**
   * イベントの実行可能性をチェック
   */
  canExecute(event: TutorialEvent, context: GameContext): boolean {
    // ワンタイムイベントの場合、既に実行済みはスキップ
    if (event.oneTime && this.executedEvents.has(event.id)) {
      return false;
    }

    // 無効化されている場合
    if (event.enabled === false) {
      return false;
    }

    // 既に発見済みのエンティティは最初の1回だけトリガー
    if (
      event.type !== "trigger-zone" &&
      context.discoveredEntities.has(event.id)
    ) {
      return false;
    }

    return true;
  }

  /**
   * トリガー条件をチェック
   */
  checkTrigger(event: TutorialEvent, context: GameContext): boolean {
    if (!this.canExecute(event, context)) {
      return false;
    }

    switch (event.trigger) {
      case "proximity": {
        const distance = this.calculateDistance(
          context.playerPosition,
          event.position
        );
        return distance <= (event.triggerDistance ?? 1);
      }

      case "tile-enter": {
        const playerTile = {
          x: Math.floor(context.playerPosition.x),
          y: Math.floor(context.playerPosition.y),
        };
        return (
          playerTile.x === event.position.x && playerTile.y === event.position.y
        );
      }

      case "automatic": {
        // 自動トリガーは常に true（呼び出し側で制御）
        return true;
      }

      case "click": {
        // クリックイベント用（UI側で処理）
        return true;
      }

      default:
        return false;
    }
  }

  /**
   * イベント実行
   */
  async execute(
    event: TutorialEvent,
    context: GameContext
  ): Promise<EventResult> {
    const result: EventResult = {
      eventId: event.id,
      executed: false,
      results: [],
    };

    try {
      // ワンタイムイベントの場合、既に実行済みはスキップ
      if (event.oneTime && this.executedEvents.has(event.id)) {
        result.reason = "already_executed";
        return result;
      }

      // 無効化されている場合
      if (event.enabled === false) {
        result.reason = "disabled";
        return result;
      }

      // トリガー条件をチェック
      if (!this.checkTrigger(event, context)) {
        result.reason = "trigger_failed";
        return result;
      }

      // 各アクションを実行
      for (const action of event.actions) {
        try {
          await this.executeAction(action, context);
          result.results!.push({
            action: action.type,
            success: true,
          });
        } catch (error) {
          console.error(
            `Failed to execute action ${action.type} for event ${event.id}:`,
            error
          );
          result.results!.push({
            action: action.type,
            success: false,
            error,
          });
        }
      }

      // ワンタイムイベントの場合、実行済みとしてマーク
      if (event.oneTime) {
        this.executedEvents.add(event.id);
      }

      result.executed = true;
    } catch (error) {
      result.error = error as Error;
    }

    return result;
  }

  /**
   * 単一アクション実行
   */
  private async executeAction(
    action: EventAction,
    context: GameContext
  ): Promise<void> {
    const listener = this.actionListeners.get(action.type);
    if (listener) {
      listener(action);
    }

    // カスタムハンドラーの実行
    if (action.type === "custom" && action.handler) {
      await action.handler(context);
    }
  }

  /**
   * 距離計算
   */
  private calculateDistance(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ): number {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 実行履歴をリセット
   */
  reset() {
    this.executedEvents.clear();
  }

  /**
   * 特定イベントの実行履歴をリセット
   */
  resetEvent(eventId: string) {
    this.executedEvents.delete(eventId);
  }

  /**
   * 実行済みイベントを取得
   */
  getExecutedEvents(): string[] {
    return Array.from(this.executedEvents);
  }
}
