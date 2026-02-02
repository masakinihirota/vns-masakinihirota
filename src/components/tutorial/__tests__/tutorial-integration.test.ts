import { beforeEach, describe, expect, it } from "vitest";
import { EventSystem } from "../events/event-system";
import { LEVEL01_EVENTS } from "../events/level01-events";
import type { GameContext, TutorialEvent } from "../events/types";
import { KeywordSystem } from "../keywords/keyword-system";
import { LEVEL01_MAP_CONFIG } from "../map/map-config";
import {
  GameStateManager,
  getGameStateManager,
  resetGameStateManager,
} from "../state/game-state-manager";

describe("Tutorial Integration Tests", () => {
  let stateManager: GameStateManager;
  let eventSystem: EventSystem;
  let keywordSystem: KeywordSystem;

  beforeEach(() => {
    resetGameStateManager();
    stateManager = getGameStateManager();
    eventSystem = new EventSystem();
    keywordSystem = new KeywordSystem();
  });

  describe("Full Tutorial Flow", () => {
    it("should start at scene1 phase 0", () => {
      const state = stateManager.getState();
      expect(state.currentPhase).toBe("scene1");
      expect(state.lineIndex).toBe(0);
    });

    it("should transition through phases in correct order", async () => {
      let states: string[] = [];
      stateManager.subscribe((state) => {
        states.push(state.currentPhase);
      });

      stateManager.goToPhase("scene2", 0);
      expect(states).toContain("scene2");

      stateManager.goToPhase("quest", 0);
      expect(states).toContain("quest");

      stateManager.goToPhase("map_found", 0);
      expect(states).toContain("map_found");

      stateManager.goToPhase("explore", 0);
      expect(states).toContain("explore");
    });

    it("should progress lines within a phase", () => {
      let lineIndices: number[] = [];
      stateManager.subscribe((state) => {
        lineIndices.push(state.lineIndex);
      });

      stateManager.advanceLine();
      expect(lineIndices).toContain(1);

      stateManager.advanceLine();
      expect(lineIndices).toContain(2);

      stateManager.regressLine();
      expect(lineIndices).toContain(1);
    });
  });

  describe("Event System Integration", () => {
    it("should detect proximity triggers during gameplay", () => {
      const mapItemEvent = LEVEL01_EVENTS.map_item;

      const context: GameContext = {
        playerPosition: { x: 3.1, y: 5.0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      const canTrigger = eventSystem.checkTrigger(mapItemEvent, context);
      expect(canTrigger).toBe(true);
    });

    it("should enforce one-time event execution", async () => {
      const mapItemEvent = LEVEL01_EVENTS.map_item;
      const context: GameContext = {
        playerPosition: { x: 3.1, y: 5.0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      // 初回実行
      const result1 = await eventSystem.execute(mapItemEvent, context);
      expect(result1.executed).toBe(true);

      // 2回目実行（失敗するはず）
      const result2 = await eventSystem.execute(mapItemEvent, context);
      expect(result2.executed).toBe(false);
      expect(result2.reason).toBe("already_executed");
    });

    it("should execute all actions in sequence", async () => {
      const actionSequence: string[] = [];

      eventSystem.onAction("give-item", (action) => {
        actionSequence.push(`give-item:${action.itemId}`);
      });

      eventSystem.onAction("show-dialogue", (action) => {
        actionSequence.push(`show-dialogue:${action.speaker}`);
      });

      const mapItemEvent = LEVEL01_EVENTS.map_item;
      const context: GameContext = {
        playerPosition: { x: 3.1, y: 5.0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      await eventSystem.execute(mapItemEvent, context);

      expect(actionSequence.length).toBeGreaterThan(0);
      expect(actionSequence.some((a) => a.includes("give-item"))).toBe(true);
    });

    it("should integrate with state manager on event completion", async () => {
      stateManager.subscribe((_state) => {
        // state.hasMap check (unused variable removed)
      });

      const mapItemEvent = LEVEL01_EVENTS.map_item;
      const context: GameContext = {
        playerPosition: { x: 3.1, y: 5.0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      eventSystem.onAction("trigger-phase", (action) => {
        stateManager.goToPhase(action.phase as any, 0);
      });

      await eventSystem.execute(mapItemEvent, context);

      // イベントが完了したことを確認
      expect(eventSystem.canExecute(mapItemEvent, context)).toBe(false);
    });
  });

  describe("Keyword System Integration", () => {
    it("should auto-unlock keywords at correct phase/line", () => {
      keywordSystem.checkAndUnlock("scene1", 0);
      keywordSystem.checkAndUnlock("scene1", 3); // "ghost" auto-unlock at scene1 line 3

      const newUnlocked = keywordSystem.getNewUnlockedKeywords();
      expect(newUnlocked).toContain("ghost");
    });

    it("should not repeat keyword unlocks", () => {
      const newUnlockedFirst = keywordSystem.checkAndUnlock("scene1", 3);
      const newUnlockedSecond = keywordSystem.checkAndUnlock("scene1", 3);

      expect(newUnlockedFirst.length).toBeGreaterThan(0);
      expect(newUnlockedSecond.length).toBe(0);
    });

    it("should track keyword learning", () => {
      keywordSystem.unlock("ghost");
      let isLearned = false;

      const ghostKeyword = keywordSystem.getKeyword("ghost");
      if (ghostKeyword) {
        keywordSystem.learn("ghost");
        const learned = keywordSystem.serialize().learnedKeywords;
        isLearned = learned.includes("ghost");
      }

      expect(isLearned).toBe(true);
    });

    it("should return related keywords", () => {
      const ghostKeyword = keywordSystem.getKeyword("ghost");
      expect(ghostKeyword).toBeDefined();

      if (ghostKeyword?.relatedKeywords) {
        const related = ghostKeyword.relatedKeywords.map((id) =>
          keywordSystem.getKeyword(id)
        );
        expect(related.some((k) => k !== undefined)).toBe(true);
      }
    });
  });

  describe("State Persistence", () => {
    it("should serialize and deserialize state correctly", () => {
      stateManager.goToPhase("map_found", 5);
      stateManager.unlockKeyword("compass");
      stateManager.learnKeyword("ghost");

      const serialized = stateManager.serialize();

      resetGameStateManager();
      const newManager = getGameStateManager();
      newManager.deserialize(serialized);

      const state = newManager.getState();
      expect(state.currentPhase).toBe("map_found");
      expect(state.lineIndex).toBe(5);
      expect(state.unlockedKeywordIds).toContain("compass");
      expect(state.learnedKeywordIds).toContain("ghost");
    });

    it("should maintain state across multiple updates", () => {
      const stateHistory: any[] = [];

      stateManager.subscribe((state) => {
        stateHistory.push({
          phase: state.currentPhase,
          lineIndex: state.lineIndex,
          hasMap: state.hasMap,
        });
      });

      stateManager.goToPhase("scene2", 0);
      stateManager.advanceLine();
      stateManager.advanceLine();
      stateManager.goToPhase("quest", 0);

      expect(stateHistory.length).toBeGreaterThan(0);
      expect(stateHistory[stateHistory.length - 1].phase).toBe("quest");
    });
  });

  describe("Error Handling", () => {
    it("should log errors with context", () => {
      let errorLogged = false;
      let errorCode = "";

      stateManager.onError("test-error", (error) => {
        errorLogged = true;
        errorCode = error.code;
      });

      stateManager.logError("test-error", "Test error message", {
        context: "test",
      });

      expect(errorLogged).toBe(true);
      expect(errorCode).toBe("test-error");
    });

    it("should handle missing event gracefully", async () => {
      const invalidEvent: TutorialEvent = {
        id: "invalid",
        position: { x: 0, y: 0 },
        type: "item",
        trigger: "proximity",
        actions: [],
      };

      const context: GameContext = {
        playerPosition: { x: 0, y: 0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      const result = await eventSystem.execute(invalidEvent, context);
      // Should handle gracefully (no throw)
      expect(result).toBeDefined();
    });
  });

  describe("Map System Integration", () => {
    it("should have valid map configuration", () => {
      expect(LEVEL01_MAP_CONFIG).toBeDefined();
      expect(LEVEL01_MAP_CONFIG.width).toBeGreaterThan(0);
      expect(LEVEL01_MAP_CONFIG.height).toBeGreaterThan(0);
      expect(LEVEL01_MAP_CONFIG.tileSize).toBeGreaterThan(0);
    });

    it("should have all required entities in LEVEL01_EVENTS", () => {
      expect(LEVEL01_EVENTS.map_item).toBeDefined();
      expect(LEVEL01_EVENTS.queen_npc).toBeDefined();
      expect(LEVEL01_EVENTS.guide_trigger).toBeDefined();
    });

    it("should have valid event positions", () => {
      Object.values(LEVEL01_EVENTS).forEach((event) => {
        expect(event.position).toBeDefined();
        expect(event.position.x).toBeGreaterThanOrEqual(0);
        expect(event.position.y).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Multi-System Workflow", () => {
    it("should handle a complete quest flow", async () => {
      const phaseHistory: string[] = [];
      const itemsGiven: string[] = [];
      const keywordsUnlocked: string[] = [];

      // Listeners
      stateManager.subscribe((state) => {
        phaseHistory.push(state.currentPhase);
      });

      eventSystem.onAction("give-item", (action) => {
        if (action.itemId) itemsGiven.push(action.itemId);
      });

      stateManager.subscribe((state) => {
        if (state.unlockedKeywordIds.length > keywordsUnlocked.length) {
          state.unlockedKeywordIds.forEach((id) => {
            if (!keywordsUnlocked.includes(id)) {
              keywordsUnlocked.push(id);
            }
          });
        }
      });

      // Start quest
      stateManager.goToPhase("quest", 0);

      // Player finds map item
      const mapItemEvent = LEVEL01_EVENTS.map_item;
      const questContext: GameContext = {
        playerPosition: { x: 3.1, y: 5.0 },
        hasMap: false,
        currentPhase: "quest",
        lineIndex: 0,
        discoveredEntities: new Set(),
      };

      await eventSystem.execute(mapItemEvent, questContext);

      // Check auto-unlock keywords
      keywordSystem.checkAndUnlock("quest", 0);

      expect(phaseHistory).toContain("quest");
      expect(itemsGiven.some((item) => item.includes("compass"))).toBe(true);
    });
  });
});
