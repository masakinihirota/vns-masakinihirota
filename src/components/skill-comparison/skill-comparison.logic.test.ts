import { describe, expect, it } from "vitest";
import {
  calculateMandalaStatus,
  getMasteryCount,
  MANDALA_STATUS,
  Profile,
} from "./skill-comparison.logic";

describe("skill-comparison.logic", () => {
  describe("calculateMandalaStatus", () => {
    it("双方未習得の場合は EMPTY(0) を返す", () => {
      expect(calculateMandalaStatus(false, false)).toBe(MANDALA_STATUS.EMPTY);
    });

    it("自分のみ習得の場合は ADVICE(1) を返す", () => {
      expect(calculateMandalaStatus(true, false)).toBe(MANDALA_STATUS.ADVICE);
    });

    it("相手のみ習得の場合は LEARN(2) を返す", () => {
      expect(calculateMandalaStatus(false, true)).toBe(MANDALA_STATUS.LEARN);
    });

    it("双方が習得している場合は SYNC(3) を返す", () => {
      expect(calculateMandalaStatus(true, true)).toBe(MANDALA_STATUS.SYNC);
    });
  });

  describe("getMasteryCount", () => {
    const mockProfile: Profile = {
      id: "test",
      name: "Test",
      role: "Role",
      mastery: {
        React: [0, 1, 2],
      },
    };

    it("習得済み項目の数を正しくカウントする", () => {
      expect(getMasteryCount(mockProfile, "React")).toBe(3);
    });

    it("未定義スキルの場合は 0 を返す", () => {
      expect(getMasteryCount(mockProfile, "Vue")).toBe(0);
    });

    it("プロフィールが undefined の場合は 0 を返す", () => {
      expect(getMasteryCount(undefined, "React")).toBe(0);
    });
  });
});
