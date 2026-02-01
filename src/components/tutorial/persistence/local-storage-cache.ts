/**
 * ローカルストレージ キャッシュ レイヤー
 * Supabase が利用不可の場合のフォールバック
 */

import type { TutorialGameState } from "../state";

const STORAGE_KEY = "vns_tutorial_progress_v2";
const CACHE_DURATION = 30 * 60 * 1000; // 30分

interface CacheEntry {
  data: any;
  timestamp: number;
}

export class LocalStorageCache {
  /**
   * キャッシュに保存
   */
  static set(key: string, value: any): void {
    try {
      const entry: CacheEntry = {
        data: value,
        timestamp: Date.now(),
      };
      localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
  }

  /**
   * キャッシュから取得
   */
  static get(key: string): any {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY}:${key}`);
      if (!item) return null;

      const entry: CacheEntry = JSON.parse(item);

      // キャッシュの有効期限をチェック
      if (Date.now() - entry.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`${STORAGE_KEY}:${key}`);
        return null;
      }

      return entry.data;
    } catch (e) {
      console.warn("Failed to read from localStorage:", e);
      return null;
    }
  }

  /**
   * キャッシュをクリア
   */
  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }

  /**
   * キャッシュからクリア
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_KEY}:${key}`);
    } catch (e) {
      console.warn("Failed to remove from localStorage:", e);
    }
  }
}

/**
 * デュアルレイヤー永続化
 * ローカルとサーバーの同期を管理
 */
export class HybridPersistence {
  private lastSyncTime: number = 0;
  private syncInterval: number = 5 * 60 * 1000; // 5分

  /**
   * 状態を保存（ローカル + サーバー）
   */
  async save(
    userId: string,
    state: TutorialGameState,
    remote?: (userId: string, state: TutorialGameState) => Promise<boolean>
  ): Promise<void> {
    // ローカルに即保存
    LocalStorageCache.set(`progress:${userId}`, {
      phase: state.currentPhase,
      lineIndex: state.lineIndex,
      hasMap: state.hasMap,
      discoveredEntities: Array.from(state.discoveredEntities),
      unlockedKeywordIds: state.unlockedKeywordIds,
      learnedKeywordIds: state.learnedKeywordIds,
      playerPosition: state.playerPosition,
    });

    // 定期的にサーバーに同期
    if (
      remote &&
      Date.now() - this.lastSyncTime > this.syncInterval
    ) {
      try {
        await remote(userId, state);
        this.lastSyncTime = Date.now();
      } catch (e) {
        console.warn("Failed to sync to server:", e);
        // ローカルのみで続行
      }
    }
  }

  /**
   * 状態を読み込む（サーバー → ローカル）
   */
  async load(
    userId: string,
    remote?: (userId: string) => Promise<any>
  ): Promise<Partial<TutorialGameState> | null> {
    // サーバーから読み込み
    if (remote) {
      try {
        const remoteData = await remote(userId);
        if (remoteData) {
          // ローカルキャッシュを更新
          LocalStorageCache.set(`progress:${userId}`, remoteData);
          this.lastSyncTime = Date.now();
          return remoteData;
        }
      } catch (e) {
        console.warn("Failed to load from server:", e);
      }
    }

    // ローカルキャッシュから読み込み
    const localData = LocalStorageCache.get(`progress:${userId}`);
    if (localData) {
      return {
        ...localData,
        discoveredEntities: new Set(
          localData.discoveredEntities || []
        ),
      };
    }

    return null;
  }

  /**
   * リセット
   */
  reset(userId: string): void {
    LocalStorageCache.remove(`progress:${userId}`);
  }
}
