import { describe, it, expect } from "vitest";
import { DEFAULT_SETTINGS, VALUE_OPTIONS } from "./matching-conditions.logic";

describe("Matching Conditions Logic", () => {
  it("デフォルト設定が意図通りであること", () => {
    expect(DEFAULT_SETTINGS.minAge).toBe(20);
    expect(DEFAULT_SETTINGS.maxAge).toBe(40);
    // All values should initialize to 50
    VALUE_OPTIONS.forEach((opt) => {
      expect(DEFAULT_SETTINGS.valueImportance[opt.id]).toBe(50);
    });
  });
});
