import { describe, it, expect } from "vitest";
import { fetchWorks } from "./work-list.logic";

describe("Work List Logic", () => {
  it("作品リストが取得できること", async () => {
    const works = await fetchWorks();
    expect(works.length).toBeGreaterThan(0);
    expect(works[0].title).toBeDefined();
    expect(works[0].category).toBeDefined();
  });
});
