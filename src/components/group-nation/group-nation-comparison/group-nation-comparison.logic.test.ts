import { describe, expect, it } from "vitest";
import { COMPARISON_DATA } from "./group-nation-comparison.logic";

describe("group-nation-comparison.logic", () => {
  it("仕様書通りのデータ構造を持っていること", () => {
    expect(COMPARISON_DATA).toHaveLength(2);

    const group = COMPARISON_DATA.find((d) => d.id === "group");
    expect(group?.title).toBe("グループ (Group)");
    expect(group?.items.origin.content).toBe("個人の「マッチング」");

    const nation = COMPARISON_DATA.find((d) => d.id === "nation");
    expect(nation?.title).toBe("国 (Nation)");
    expect(nation?.items.origin.content).toBe(
      "あるグループが掲げた「目的」で集まる。"
    );
  });
});
