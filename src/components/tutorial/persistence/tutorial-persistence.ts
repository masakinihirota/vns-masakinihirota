/**
 * チュートリアル進捗の永続化
 * Supabase との連携
 */

import { createClient } from "@/lib/supabase/client";
import type { TutorialGameState } from "../state";

export interface TutorialProgressData {
  user_id: string;
  phase: string;
  line_index: number;
  has_map: boolean;
  discovered_entities: string[];
  unlocked_keyword_ids: string[];
  learned_keyword_ids: string[];
  last_position: { x: number; y: number };
  updated_at: string;
}

export class TutorialPersistence {
  private supabase = createClient();
  private table = "tutorial_progress";

  /**
   * 進捗を保存
   */
  async save(userId: string, state: TutorialGameState): Promise<boolean> {
    try {
      const data: TutorialProgressData = {
        user_id: userId,
        phase: state.currentPhase,
        line_index: state.lineIndex,
        has_map: state.hasMap,
        discovered_entities: Array.from(state.discoveredEntities),
        unlocked_keyword_ids: state.unlockedKeywordIds,
        learned_keyword_ids: state.learnedKeywordIds,
        last_position: state.playerPosition,
        updated_at: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from(this.table)
        .upsert(data, { onConflict: "user_id" });

      if (error) {
        console.error("Failed to save tutorial progress:", error);
        return false;
      }

      return true;
    } catch (e) {
      console.error("Tutorial persistence error:", e);
      return false;
    }
  }

  /**
   * 進捗を読み込む
   */
  async load(userId: string): Promise<Partial<TutorialGameState> | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.table)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        // データが存在しない場合は正常
        console.debug("No tutorial progress found for user:", userId);
        return null;
      }

      const typedData = data as TutorialProgressData;

      return {
        currentPhase: typedData.phase as any,
        lineIndex: typedData.line_index,
        hasMap: typedData.has_map,
        discoveredEntities: new Set(typedData.discovered_entities),
        unlockedKeywordIds: typedData.unlocked_keyword_ids,
        learnedKeywordIds: typedData.learned_keyword_ids,
        playerPosition: typedData.last_position,
      };
    } catch (e) {
      console.error("Failed to load tutorial progress:", e);
      return null;
    }
  }

  /**
   * イベント完了状態を記録
   */
  async recordEventCompletion(userId: string, eventId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("tutorial_event_log")
        .insert({
          user_id: userId,
          event_id: eventId,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Failed to record event completion:", error);
        return false;
      }

      return true;
    } catch (e) {
      console.error("Event logging error:", e);
      return false;
    }
  }

  /**
   * 完了したイベントを取得
   */
  async getCompletedEvents(userId: string): Promise<Set<string>> {
    try {
      const { data, error } = await this.supabase
        .from("tutorial_event_log")
        .select("event_id")
        .eq("user_id", userId);

      if (error || !data) {
        return new Set();
      }

      return new Set(data.map((row: any) => row.event_id));
    } catch (e) {
      console.error("Failed to get completed events:", e);
      return new Set();
    }
  }

  /**
   * 進捗をリセット
   */
  async reset(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.table)
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to reset tutorial progress:", error);
        return false;
      }

      // イベントログもリセット
      await this.supabase
        .from("tutorial_event_log")
        .delete()
        .eq("user_id", userId);

      return true;
    } catch (e) {
      console.error("Failed to reset tutorial data:", e);
      return false;
    }
  }
}

/**
 * グローバルパーシステンスインスタンス
 */
let persistenceInstance: TutorialPersistence | null = null;

export function getTutorialPersistence(): TutorialPersistence {
  if (!persistenceInstance) {
    persistenceInstance = new TutorialPersistence();
  }
  return persistenceInstance;
}
