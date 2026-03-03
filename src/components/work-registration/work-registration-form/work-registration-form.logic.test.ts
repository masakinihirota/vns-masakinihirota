import { describe, expect, it } from "vitest";
import type { AiDraftData, WorkFormData } from "./work-registration-form.logic";
import { getDiffKeys } from "./work-registration-form.logic";

describe("WorkRegistrationForm Logic", () => {
  const baseFormData: WorkFormData = {
    title: "呪術廻戦",
    creator: "芥見下々",
    releaseYear: "2024",
    officialUrl: "https://example.com",
    affiliateUrl: "",
    length: "1週間",
    isPurchasable: true,
    tags: "アクション",
    synopsis: "元のあらすじ",
  };

  it("差分があるキーを正しく検出する", () => {
    const draft: AiDraftData = {
      creator: "MAPPA",
      releaseYear: "2025",
    };

    const diffKeys = getDiffKeys(baseFormData, draft);
    expect(diffKeys).toContain("creator");
    expect(diffKeys).toContain("releaseYear");
    expect(diffKeys).not.toContain("title");
  });

  it("値が同じ場合は差分として検出しない", () => {
    const draft: AiDraftData = {
      creator: "芥見下々",
    };

    const diffKeys = getDiffKeys(baseFormData, draft);
    expect(diffKeys).toHaveLength(0);
  });

  it("あらすじ（synopsis）は仕様通り差分検出から除外する", () => {
    const draft: AiDraftData = {
      synopsis: "新しいあらすじ",
    };

    const diffKeys = getDiffKeys(baseFormData, draft);
    expect(diffKeys).not.toContain("synopsis");
  });
});
