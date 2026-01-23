import { describe, it, expect } from "vitest";
import {
  generateNameCandidates,
  isReadOnlyMode,
} from "./beginning-country.logic";

describe("BeginningCountry Logic", () => {
  describe("generateNameCandidates", () => {
    it("3つの異なる名前候補を生成する", () => {
      const candidates = generateNameCandidates("蠍座", []);
      expect(candidates).toHaveLength(3);
      expect(new Set(candidates).size).toBe(3);
      candidates.forEach((name) => {
        expect(name).toContain("蠍座");
      });
    });

    it("前回の候補と同じ名前を含まない", () => {
      const lastSet = ["白い光の蠍座", "青い炎の蠍座", "黒い星の蠍座"];
      const candidates = generateNameCandidates("蠍座", [lastSet]);
      candidates.forEach((name) => {
        expect(lastSet).not.toContain(name);
      });
    });
  });

  describe("isReadOnlyMode", () => {
    it("Lv1の場合は読み取り専用モードとなる", () => {
      expect(isReadOnlyMode(1)).toBe(true);
    });

    it("Lv2以上の場合は読み取り専用モードではない", () => {
      expect(isReadOnlyMode(2)).toBe(false);
    });
  });
});
