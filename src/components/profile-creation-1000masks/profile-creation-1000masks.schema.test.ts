import { describe, expect, it } from "vitest";
import { validateProfile } from "./profile-creation-1000masks.schema";

describe("profile-creation-1000masks validation", () => {
  const validProfile = {
    name: "Valid Name",
    constellationName: "魚座",
    selectedTypeId: "self",
    selectedObjectiveIds: ["business_card"],
    selectedSlots: ["works"],
    selectedValues: ["val_core"],
  };

  it("有効なプロフィールの場合はエラーを返さない", () => {
    const result = validateProfile(validProfile);
    expect(result.success).toBe(true);
  });

  it("名前が空の場合はエラーを返す", () => {
    const result = validateProfile({ ...validProfile, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "名前を入力してください"
      );
    }
  });

  it("プロフィールタイプが未選択の場合はエラーを返す", () => {
    const result = validateProfile({ ...validProfile, selectedTypeId: null });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.selectedTypeId).toContain(
        "プロフィールのタイプを選択してください"
      );
    }
  });

  it("目的が未選択の場合はエラーを返す", () => {
    const result = validateProfile({
      ...validProfile,
      selectedObjectiveIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.selectedObjectiveIds).toContain(
        "プロフィールの目的を1つ以上選択してください"
      );
    }
  });
});
