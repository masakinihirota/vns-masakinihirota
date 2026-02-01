/**
 * チュートリアルシステムのテストスイート
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventSystem } from "../events/event-system";
import type { EventAction, GameContext, TutorialEvent } from "../events/types";
import { KeywordSystem } from "../keywords/keyword-system";
import { GameStateManager } from "../state/game-state-manager";

describe("Tutorial System", () => {
  describe("EventSystem", () => {
    let eventSystem: EventSystem;
    let gameContext: GameContext;

    beforeEach(() => {
      eventSystem = new EventSystem();
      gameContext = {
        playerPosition: { x: 5, y: 5 },
        hasMap: false,
        currentPhase: "scene1",
        discoveredEntities: new Set(),
        lineIndex: 0,
      };
    });

    it("should detect proximity trigger", () => {
      const event: TutorialEvent = {
        id: "test_item",
        position: { x: 5, y: 5 },
        type: "item",
        trigger: "proximity",
        triggerDistance: 1,
        actions: [],
      };

      expect(eventSystem.checkTrigger(event, gameContext)).toBe(true);
    });

    it("should not trigger if too far", () => {
      const event: TutorialEvent = {
        id: "test_item",
        position: { x: 10, y: 10 },
        type: "item",
        trigger: "proximity",
        triggerDistance: 1,
        actions: [],
      };

      expect(eventSystem.checkTrigger(event, gameContext)).toBe(false);
    });

    it("should handle one-time events", async () => {
      const event: TutorialEvent = {
        id: "one_time_event",
        position: { x: 5, y: 5 },
        type: "item",
        trigger: "proximity",
        triggerDistance: 1,
        actions: [{ type: "give-item", itemId: "test_item" }],
        oneTime: true,
      };

      const result1 = await eventSystem.execute(event, gameContext);
      expect(result1.executed).toBe(true);

      const result2 = await eventSystem.execute(event, gameContext);
      expect(result2.executed).toBe(false); // Already executed
    });

    it("should execute multiple actions", async () => {
      const actionLog: EventAction[] = [];

      eventSystem.onAction("give-item", (action) => {
        actionLog.push(action);
      });
      eventSystem.onAction("show-dialogue", (action) => {
        actionLog.push(action);
      });

      const event: TutorialEvent = {
        id: "multi_action_event",
        position: { x: 5, y: 5 },
        type: "item",
        trigger: "proximity",
        triggerDistance: 1,
        actions: [
          { type: "give-item", itemId: "compass" },
          { type: "show-dialogue", speaker: "System", dialogue: "Got item!" },
        ],
      };

      const result = await eventSystem.execute(event, gameContext);
      expect(result.executed).toBe(true);
      expect(actionLog.length).toBe(2);
    });
  });

  describe("GameStateManager", () => {
    let stateManager: GameStateManager;

    beforeEach(() => {
      stateManager = new GameStateManager();
    });

    it("should update player position", () => {
      const listener = vi.fn();
      stateManager.subscribe(listener);

      stateManager.updatePlayerPosition(10, 20);

      expect(listener).toHaveBeenCalled();
      const state = stateManager.getState();
      expect(state.playerPosition).toEqual({ x: 10, y: 20 });
    });

    it("should notify listeners on state change", () => {
      const listener = vi.fn();
      stateManager.subscribe(listener);

      stateManager.setHasMap(true);

      expect(listener).toHaveBeenCalled();
    });

    it("should handle phase transitions", () => {
      stateManager.goToPhase("map_found", 5);

      const state = stateManager.getState();
      expect(state.currentPhase).toBe("map_found");
      expect(state.lineIndex).toBe(5);
    });

    it("should manage keywords", () => {
      stateManager.unlockKeyword("ghost");
      stateManager.learnKeyword("ghost");

      const state = stateManager.getState();
      expect(state.unlockedKeywordIds).toContain("ghost");
      expect(state.learnedKeywordIds).toContain("ghost");
    });

    it("should log errors", () => {
      const errorHandler = vi.fn();
      stateManager.onError("test-error", errorHandler);

      stateManager.logError("test-error", "Test error message");

      expect(errorHandler).toHaveBeenCalled();

      const state = stateManager.getState();
      expect(state.errors.length).toBeGreaterThan(0);
    });

    it("should serialize and deserialize state", () => {
      stateManager.goToPhase("explore", 10);
      stateManager.setHasMap(true);
      stateManager.unlockKeyword("compass");

      const serialized = stateManager.serialize();

      const newManager = new GameStateManager();
      newManager.deserialize(serialized);

      const state = newManager.getState();
      expect(state.currentPhase).toBe("explore");
      expect(state.lineIndex).toBe(10);
      expect(state.hasMap).toBe(true);
      expect(state.unlockedKeywordIds).toContain("compass");
    });
  });

  describe("KeywordSystem", () => {
    let keywordSystem: KeywordSystem;

    beforeEach(() => {
      keywordSystem = new KeywordSystem();
    });

    it("should unlock keywords", () => {
      const result = keywordSystem.unlock("ghost");
      expect(result).toBe(true);
    });

    it("should learn unlocked keywords", () => {
      keywordSystem.unlock("ghost");
      const result = keywordSystem.learn("ghost");
      expect(result).toBe(true);
    });

    it("should not learn locked keywords", () => {
      const result = keywordSystem.learn("compass");
      expect(result).toBe(false);
    });

    it("should check and auto-unlock keywords by phase", () => {
      const newUnlocks = keywordSystem.checkAndUnlock("scene1", 3);
      expect(newUnlocks).toContain("ghost");
    });

    it("should get related keywords", () => {
      keywordSystem.unlock("ghost");
      const related = keywordSystem.getRelatedKeywords("ghost");
      expect(related.length).toBeGreaterThan(0);
    });

    it("should track new unlocked keywords", () => {
      keywordSystem.unlock("ghost");
      keywordSystem.unlock("compass");
      keywordSystem.learn("ghost");

      const newKeywords = keywordSystem.getNewUnlockedKeywords();
      expect(newKeywords).toContain("compass");
      expect(newKeywords).not.toContain("ghost");
    });
  });

  describe("Tutorial Flow", () => {
    it("should complete basic tutorial flow", async () => {
      const stateManager = new GameStateManager();
      const eventSystem = new EventSystem();
      const keywordSystem = new KeywordSystem();

      // Start: scene1
      expect(stateManager.getState().currentPhase).toBe("scene1");

      // Advance lines
      stateManager.advanceLine();
      stateManager.advanceLine();
      stateManager.advanceLine();
      stateManager.advanceLine();

      // Check keywords unlocked
      const newKeywords = keywordSystem.checkAndUnlock("scene1", 3);
      expect(newKeywords).toContain("ghost");

      // Move to scene2
      stateManager.goToPhase("scene2", 0);
      expect(stateManager.getState().currentPhase).toBe("scene2");

      // Get map
      stateManager.setHasMap(true);
      expect(stateManager.getState().hasMap).toBe(true);

      // Move to explore
      stateManager.goToPhase("explore", 0);
      expect(stateManager.getState().currentPhase).toBe("explore");
    });
  });
});
