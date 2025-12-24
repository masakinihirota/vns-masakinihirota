import { describe, it, expect } from "vitest";
import {
  generateRelatedIds,
  INITIAL_CHOICES,
} from "./values-selection-screen.logic";

describe("ValueSelectionScreen Logic", () => {
  describe("INITIAL_CHOICES", () => {
    it("初期選択肢が正しく定義されている", () => {
      expect(INITIAL_CHOICES).toHaveLength(5);
      expect(INITIAL_CHOICES[0].label).toBe("選択肢1");
      expect(INITIAL_CHOICES[3].user).toBe("登録ユーザー名");
    });
  });

  describe("generateRelatedIds", () => {
    it("指定された数のIDを生成する", () => {
      const ids = generateRelatedIds("test-base", 3);
      expect(ids).toHaveLength(3);
      expect(ids[0]).toBe("test-base-0");
      expect(ids[1]).toBe("test-base-1");
      expect(ids[2]).toBe("test-base-2");
    });
  });
});
