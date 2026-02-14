import { describe, expect, it } from "vitest";
import { useEvents, useJoinEvent } from "./events.logic";

describe("events.logic", () => {
  describe("useEvents", () => {
    it("関数が定義されている", () => {
      // Assert
      expect(useEvents).toBeDefined();
    });
  });

  describe("useJoinEvent", () => {
    it("関数が定義されている", () => {
      // Assert
      expect(useJoinEvent).toBeDefined();
    });
  });

  // TODO: useEvents の戻り値テスト
  // TODO: useJoinEvent のイベント参加ロジックテスト
});
