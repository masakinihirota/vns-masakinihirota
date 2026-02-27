import { describe, expect, it } from "vitest";

import { Profile } from "../types";

import { getCellStatus, getMasteryCount } from "./mandala-chart.logic";

describe("MandalaChart Logic", () => {
  const mockMe: Profile = {
    id: "me",
    name: "Me",
    role: "Dev",
    mastery: {
      SkillA: [0, 1], // 0, 1 を習得
    },
  };

  const mockTarget: Profile = {
    id: "target",
    name: "Target",
    role: "Dev",
    mastery: {
      SkillA: [1, 2], // 1, 2 を習得
    },
  };

  describe("getCellStatus", () => {
    it("双方が習得している場合は SYNC を返す", () => {
      // Index 1 は両者が持っている
      expect(getCellStatus(1, "SkillA", mockMe, mockTarget)).toBe("SYNC");
    });

    it("自分のみ習得している場合は ADVICE を返す", () => {
      // Index 0 は自分のみ
      expect(getCellStatus(0, "SkillA", mockMe, mockTarget)).toBe("ADVICE");
    });

    it("相手のみ習得している場合は LEARN を返す", () => {
      // Index 2 は相手のみ
      expect(getCellStatus(2, "SkillA", mockMe, mockTarget)).toBe("LEARN");
    });

    it("どちらも習得していない場合は NONE を返す", () => {
      // Index 3 はどちらも持っていない
      expect(getCellStatus(3, "SkillA", mockMe, mockTarget)).toBe("NONE");
    });

    it("プロファイルが存在しない場合は NONE を返す", () => {
      expect(getCellStatus(1, "SkillA")).toBe("NONE");
    });
  });

  describe("getMasteryCount", () => {
    it("習得済み項目の数を正しくカウントする", () => {
      expect(getMasteryCount(mockMe, "SkillA")).toBe(2);
      expect(getMasteryCount(mockTarget, "SkillA")).toBe(2);
    });

    it("存在しないスキルの場合は 0 を返す", () => {
      expect(getMasteryCount(mockMe, "UnknownSkill")).toBe(0);
    });
  });
});
