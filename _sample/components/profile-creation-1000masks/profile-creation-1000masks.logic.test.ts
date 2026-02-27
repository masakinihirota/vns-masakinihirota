import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OBJECTIVE_PRESETS } from "./profile-creation-1000masks.constants";
import { useProfileCreation } from "./profile-creation-1000masks.logic";
import { ProfileStorageAdapter } from "./profile-storage-adapter";

describe("useProfileCreation", () => {
  it("フックの初期化と初期プロフィールの取得ができること", () => {
    const { result } = renderHook(() => useProfileCreation());

    // デフォルトで用意されている ghost プロフィールがアクティブになっているか
    expect(result.current.activeProfile.isGhost).toBe(true);
    expect(result.current.activeProfileId).toBe("ghost");
    expect(result.current.profiles.length).toBeGreaterThan(0);
  });

  it("目的（Objective）のトグル操作と関連するスロットの追加が行えること", () => {
    const { result } = renderHook(() => useProfileCreation());

    // Act: 'business_card' を追加
    act(() => {
      result.current.handleToggleObjective("business_card");
    });

    const draftAfterAdd = result.current.editDraft;
    expect(draftAfterAdd).not.toBeNull();
    expect(draftAfterAdd?.selectedObjectiveIds).toContain("business_card");
    expect(result.current.isDirty).toBe(true); // 変更が加えられた状態

    // business_card オブジェクティブに紐づくスロット(works, skills)が選択されているか
    const preset = OBJECTIVE_PRESETS.find((p) => p.id === "business_card");
    for (const slot of preset?.slots ?? []) {
      expect(draftAfterAdd?.selectedSlots).toContain(slot);
    }

    // Act: も一度 'business_card' をトグルして追加を解除
    act(() => {
      result.current.handleToggleObjective("business_card");
    });

    const draftAfterRemove = result.current.editDraft;
    expect(draftAfterRemove?.selectedObjectiveIds).not.toContain(
      "business_card"
    );
  });

  it("スロット単体のトグル操作が行えること", () => {
    const { result } = renderHook(() => useProfileCreation());

    // 初期状態では "social" スロットはないことを確認
    expect(result.current.activeProfile.selectedSlots).not.toContain("social");

    // Act: 'social' を追加
    act(() => {
      result.current.toggleSlot("social");
    });

    const draft = result.current.editDraft;
    expect(draft?.selectedSlots).toContain("social");
  });

  it("新規プロフィールの作成 (createNewProfile) が行えること", () => {
    const { result } = renderHook(() => useProfileCreation());

    act(() => {
      result.current.createNewProfile();
    });

    // 新しいプロフィールが配列に追加され、アクティブになっているか
    expect(result.current.activeProfileId).not.toBe("ghost");
    expect(result.current.activeProfile.isGhost).toBe(false);
    expect(result.current.activeProfile.name).toBe("新しい仮面");
    expect(result.current.profiles.length).toBe(3);
  });

  it("アダプターを使用した非同期の初期データロードが正しく行われること", async () => {
    const mockProfiles = [
      {
        id: "mock1",
        name: "Mocked Profile",
        isGhost: false,
        avatarType: "user" as const,
        maskId: "mask_default",
        selectedTypeId: "self",
        selectedObjectiveIds: [],
        selectedSlots: [],
        selectedValues: [],
        constellationName: "魚座",
        constellationHistory: [["魚座"]],
        historyPointer: 0,
      },
      // 内部ロジックでGhostが存在することを前提としているためダミーを追加
      {
        id: "ghost",
        name: "霊体(GHOST)",
        isGhost: true,
        avatarType: "user" as const,
        maskId: "mask_default",
        selectedTypeId: null,
        selectedObjectiveIds: [],
        selectedSlots: [],
        selectedValues: [],
        constellationName: "魚座",
        constellationHistory: [["魚座"]],
        historyPointer: 0,
      },
    ];

    const mockAdapter: ProfileStorageAdapter = {
      loadProfiles: vi.fn().mockResolvedValue(mockProfiles),
      saveProfiles: vi.fn().mockResolvedValue(undefined),
    };

    const { result } = renderHook(() => useProfileCreation(mockAdapter));

    // 非同期でモックデータが loadProfiles によりロードされるのを待つ
    await waitFor(() => {
      expect(mockAdapter.loadProfiles).toHaveBeenCalled();
      // ghostプロフィールともう一つのプロフィールがセットされているはず
      expect(result.current.profiles.length).toBe(2);
    });
  });

  it("アダプターを使用した保存時にエラーが発生した場合、エラーが伝播されること", async () => {
    const mockAdapter: ProfileStorageAdapter = {
      loadProfiles: vi.fn().mockResolvedValue([]),
      // 保存時にエラーをスローするモック
      saveProfiles: vi.fn().mockRejectedValue(new Error("Save failed mocked error")),
    };

    const { result } = renderHook(() => useProfileCreation(mockAdapter));

    // 保存処理の実行
    act(() => {
      result.current.handleSave();
    });

    // モーダルがエラーメッセージと共に開くことを確認する
    await waitFor(() => {
      expect(result.current.modal.isOpen).toBe(true);
      expect(result.current.modal.type).toBe("error");
      expect(result.current.modal.message).toBe("Save failed mocked error");
    });
  });
});
