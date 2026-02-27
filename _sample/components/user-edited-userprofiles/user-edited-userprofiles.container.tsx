/* eslint-disable no-console */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { UserEditedUserProfiles } from "./user-edited-userprofiles";
import { getKeysBySectionId } from "./user-profile-app.logic";
import { MOCK_PROFILES } from "./user-profile-app.mock";
import { Package, SectionId, Slot, UserProfile } from "./user-profile-app.types";

/**
 * コンテナコンポーネント: 状態管理とビジネスロジックを担当
 * ローカルストレージとの同期、プロファイルの作成・選択・更新・削除などの
 * コアロジックをカプセル化し、プレゼンテーションコンポーネントに提供します。
 */
export const UserEditedUserProfilesContainer = () => {
  // 状態管理
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    if (globalThis.window !== undefined) {
      const saved = localStorage.getItem("vns-user-profiles");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Failed to parse profiles from localStorage", error);
        }
      }
    }
    return MOCK_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0]?.id || "");
  const [activeSectionId, setActiveSectionId] = useState<SectionId>("work_future");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ローカルでのティア保存（Inventory用）
  const [localTiers, setLocalTiers] = useState<Record<string, 1 | 2 | 3 | undefined>>(() => {
    if (globalThis.window !== undefined) {
      const saved = localStorage.getItem("vns-user-tiers");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Failed to parse tiers from localStorage", error);
        }
      }
    }
    return {};
  });

  // 保存処理
  useEffect(() => {
    if (globalThis.window !== undefined) {
      localStorage.setItem("vns-user-profiles", JSON.stringify(profiles));
      localStorage.setItem("vns-user-tiers", JSON.stringify(localTiers));
    }
  }, [profiles, localTiers]);

  // アクティブなプロファイルを取得
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  // ハンドラー
  const handleProfileSelect = useCallback((id: string) => {
    setActiveProfileId(id);
  }, []);

  const handleUpdateProfile = useCallback(
    (updatedProfile: UserProfile) => {
      setProfiles((previous) =>
        previous.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
      );
      setIsDirty(true);
    },
    []
  );

  const handleUpdateTier = useCallback(
    (itemId: string, newTier?: 1 | 2 | 3) => {
      setLocalTiers((previous) => ({
        ...previous,
        [itemId]: newTier,
      }));
      setIsDirty(true);
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // 擬似的な保存遅延（実際のAPIコールをシミュレート）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDirty(false);
    } catch (error) {
      console.error("保存中にエラーが発生しました", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleEquipPackage = useCallback(
    (package_: Package) => {
      const updatedProfile = { ...activeProfile };
      const key = getKeysBySectionId(activeSectionId);

      // パッケージを装備（既存のパッケージは上書きされる想定）
      updatedProfile.equippedPackages = {
        ...updatedProfile.equippedPackages,
        [key]: [package_],
      };

      // そのセクションの個別アイテムスロットをクリアする（パッケージ優先の仕様の場合）
      updatedProfile.equippedSlots = {
        ...updatedProfile.equippedSlots,
        [key]: [],
      };

      handleUpdateProfile(updatedProfile);
    },
    [activeProfile, activeSectionId, handleUpdateProfile]
  );

  const handleEquipItem = useCallback(
    (item: Slot) => {
      const updatedProfile = { ...activeProfile };
      const key = getKeysBySectionId(activeSectionId);

      // 個別スロットに追加（最大数はここでは制限しないか、既存ロジックに合わせる）
      const currentSlots = [...updatedProfile.equippedSlots[key]];

      // 重複チェック
      if (!currentSlots.find(s => s.id === item.id)) {
        updatedProfile.equippedSlots = {
          ...updatedProfile.equippedSlots,
          [key]: [...currentSlots, item],
        };
        handleUpdateProfile(updatedProfile);
      }
    },
    [activeProfile, activeSectionId, handleUpdateProfile]
  );

  const handleRemoveItemById = useCallback(
    (id: string) => {
      const updatedProfile = { ...activeProfile };
      const key = getKeysBySectionId(activeSectionId);

      // スロットから削除
      updatedProfile.equippedSlots = {
        ...updatedProfile.equippedSlots,
        [key]: updatedProfile.equippedSlots[key].filter((item) => item.id !== id),
      };

      // パッケージから削除（もしパッケージ内に含まれるアイテムなら、パッケージごと外すか、パッケージの中身を編集するかは仕様によるが、ここではパッケージごと外す簡易実装）
      const currentPackages = updatedProfile.equippedPackages[key];
      if (currentPackages.some(package_ => package_.items.some(item => item.id === id))) {
        updatedProfile.equippedPackages = {
          ...updatedProfile.equippedPackages,
          [key]: [],
        };
      }

      handleUpdateProfile(updatedProfile);
    },
    [activeProfile, activeSectionId, handleUpdateProfile]
  );

  return (
    <UserEditedUserProfiles
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      profiles={profiles}
      activeProfileId={activeProfileId}
      activeProfile={activeProfile}
      activeSectionId={activeSectionId}
      setActiveSectionId={setActiveSectionId}
      handleProfileSelect={handleProfileSelect}
      handleUpdateProfile={handleUpdateProfile}
      handleUpdateTier={handleUpdateTier}
      handleSave={handleSave}
      isSaving={isSaving}
      isDirty={isDirty}
      localTiers={localTiers}
      setLocalTiers={setLocalTiers}
      handleEquipPackage={handleEquipPackage}
      handleEquipItem={handleEquipItem}
      handleRemoveItemById={handleRemoveItemById}
    />
  );
};
