"use client";

import { Ghost, LucideIcon, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  COLORS,
  MASK_ICONS,
  MATERIALS,
  OBJECTIVE_PRESETS,
  USER_BASE_CONSTELLATION,
} from "./profile-creation-1000masks.constants";
import { validateProfile } from "./profile-creation-1000masks.schema";
import { ProfileStorageAdapter } from "./profile-storage-adapter";

// --- Types ---

export type MaskId =
  | "mask_default"
  | "mask_zap"
  | "mask_shield"
  | "mask_star"
  | "mask_target"
  | "mask_anchor"
  | "mask_cloud"
  | "mask_sun"
  | "mask_aperture"
  | "mask_smile"
  | "ghost";

export interface MaskIcon {
  id: MaskId;
  icon: LucideIcon;
  label: string;
}

export type ProfileTypeId =
  | "self"
  | "interview"
  | "imagined"
  | "ideal"
  | "politician"
  | "ai_dummy";

export interface ProfileType {
  id: ProfileTypeId;
  label: string;
  icon: LucideIcon;
  description: string;
  isSpecial?: boolean;
}

export type SlotId =
  | "works"
  | "favorites"
  | "values"
  | "skills"
  | "politics"
  | "partner_meta"
  | "social";

export interface Slot {
  id: SlotId;
  label: string;
  icon: LucideIcon;
}

export type ObjectiveId =
  | "business_card"
  | "resume"
  | "build_work"
  | "play"
  | "partner"
  | "consult"
  | "politics"
  | "other";

export interface ObjectivePreset {
  id: ObjectiveId;
  label: string;
  slots: SlotId[];
  icon: LucideIcon;
}

export type ValueCategoryId =
  | "val_core"
  | "val_basic"
  | "val_work"
  | "val_play"
  | "val_partner"
  | "val_life"
  | "val_ethic"
  | "val_end"
  | "val_politics";

export interface ValueCategory {
  id: ValueCategoryId;
  name: string;
  total: number;
  answered: number;
  isRoot?: boolean;
  icon: LucideIcon;
}

export type CassetteId = string;

export interface Cassette {
  id: CassetteId;
  name: string;
  items: string[];
}

export type AvatarType = "user" | "ghost";

export interface Profile {
  id: string;
  name: string;
  constellationName: string;
  constellationHistory: string[][];
  historyPointer: number;
  avatarType: AvatarType;
  maskId: MaskId;
  isGhost: boolean;
  selectedTypeId: ProfileTypeId | undefined;
  selectedObjectiveIds: ObjectiveId[];
  selectedSlots: SlotId[];
  selectedValues: ValueCategoryId[];
  workSetId?: CassetteId;
  skillSetId?: CassetteId;
}

export interface ModalState {
  isOpen: boolean;
  type: "confirm_exit" | "confirm_create" | "error" | "success" | "info" | "";
  targetId: string | undefined;
  message: string;
  action?: () => void;
}

// --- Utilities ---

/**
 * 魚座をベースとした候補名のセットを生成する
 * @param constellation 星座名
 * @param previousSet 以前のセット（重複回避用）
 * @returns 3つの候補名配列
 */
export const generateCandidateSet = (
  constellation: string,
  previousSet: string[] = []
) => {
  const newSet: string[] = [];
  while (newSet.length < 3) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const material = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    const name = `${color}${material}の${constellation}`;
    if (!newSet.includes(name) && !previousSet.includes(name))
      newSet.push(name);
  }
  return newSet;
};

/**
 * マスクIDとアバタータイプに応じたアイコンを取得する
 * @param maskId マスクID
 * @param avatarType アバタータイプ
 * @returns LucideIcon
 */
export const getMaskIcon = (maskId: MaskId, avatarType: AvatarType) => {
  if (avatarType === "ghost") return Ghost;
  const mask = MASK_ICONS.find((m) => m.id === maskId);
  return mask ? mask.icon : User;
};

const INITIAL_GHOST_HISTORY = [
  generateCandidateSet(USER_BASE_CONSTELLATION, []),
];

// --- Hook ---

export const useProfileCreation = (adapter?: ProfileStorageAdapter) => {
  const mainScrollReference = useRef<HTMLDivElement>(null);

  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "ghost",
      name: "幽霊のプロフィール",
      constellationName: INITIAL_GHOST_HISTORY[0][0],
      constellationHistory: INITIAL_GHOST_HISTORY,
      historyPointer: 0,
      avatarType: "ghost",
      maskId: "ghost",
      isGhost: true,
      selectedTypeId: undefined,
      selectedObjectiveIds: [],
      selectedSlots: [],
      selectedValues: ["val_core"],
    },
    {
      id: "p1",
      name: "エンジニアとしての僕",
      constellationName: "緑の光速の魚座",
      constellationHistory: [
        ["緑の光速の魚座", "白い炎の魚座", "青い雷の魚座"],
      ],
      historyPointer: 0,
      avatarType: "user",
      maskId: "mask_zap",
      isGhost: false,
      selectedTypeId: "self",
      selectedObjectiveIds: ["build_work"],
      selectedSlots: ["works", "favorites", "values", "skills"],
      selectedValues: ["val_core", "val_basic", "val_work"],
    },
  ]);

  const [editDraft, setEditDraft] = useState<Profile | undefined>();
  const [activeProfileId, setActiveProfileId] = useState<string>("ghost");
  const [isDirty, setIsDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "",
    targetId: undefined,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );

  // 初期ロード
  useEffect(() => {
    if (adapter) {
      void adapter
        .loadProfiles()
        .then((loadedProfiles) => {
          if (loadedProfiles.length > 0) {
            setProfiles(loadedProfiles);
          }
        })
        .catch((error) => {
          console.error("Failed to load profiles:", error);
        });
    }
  }, [adapter]);

  useEffect(() => {
    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditDraft({ ...profile });
      setIsDirty(false);
      setErrors({});
      mainScrollReference.current?.scrollTo({ top: 0 });
    }
  }, [activeProfileId, profiles]);

  const activeProfile =
    editDraft || profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleUpdateDraft = (updatedFields: Partial<Profile>) => {
    setEditDraft((previous) => (previous ? { ...previous, ...updatedFields } : undefined));
    setIsDirty(true);

    // エラーがある場合は、更新されたフィールドのエラーをクリアする
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      for (const key of Object.keys(updatedFields)) {
        delete newErrors[key as keyof typeof newErrors];
      }
      setErrors(newErrors);
    }
  };

  const requestSwitchProfile = (id: string) => {
    if (id === activeProfileId) return;
    if (isDirty) {
      setModal({
        isOpen: true,
        type: "confirm_exit",
        targetId: id,
        message: "変更が保存されていません。破棄して移動しますか？",
      });
    } else {
      setActiveProfileId(id);
    }
  };

  const handleSave = () => {
    if (!activeProfile.isGhost) {
      const result = validateProfile(activeProfile);
      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        setModal({
          isOpen: true,
          type: "error",
          targetId: undefined,
          message: "入力内容を確認してください。",
        });
        return;
      }
    }
    const updatedProfiles = profiles.map((p) =>
      p.id === activeProfile.id ? { ...activeProfile } : p
    );
    setProfiles(updatedProfiles);
    setIsDirty(false);

    if (adapter) {
      adapter
        .saveProfiles(updatedProfiles)
        .then(() => {
          setModal({
            isOpen: true,
            type: "success",
            targetId: undefined,
            message: "仮面の保存が完了しました。",
          });
        })
        .catch((error) => {
          setModal({
            isOpen: true,
            type: "error",
            targetId: undefined,
            message: error instanceof Error ? error.message : "保存に失敗しました。",
          });
        });
    } else {
      setModal({
        isOpen: true,
        type: "success",
        targetId: undefined,
        message: "仮面の保存が完了しました。",
      });
    }

    setTimeout(
      () =>
        setModal((previous) =>
          previous.type === "success" ? { ...previous, isOpen: false } : previous
        ),
      2000
    );
  };

  /**
   * 次の候補名セットを生成・表示する
   */
  const handleNextAnonyms = () => {
    const { constellationHistory, historyPointer } = activeProfile;
    if (historyPointer < constellationHistory.length - 1) {
      handleUpdateDraft({ historyPointer: historyPointer + 1 });
      return;
    }
    const newSet = generateCandidateSet(
      USER_BASE_CONSTELLATION,
      constellationHistory[historyPointer]
    );
    const newHistory = [...constellationHistory, newSet];
    let newPointer = newHistory.length - 1;
    if (newHistory.length > 10) {
      newHistory.shift();
      newPointer = 9;
    }
    handleUpdateDraft({
      constellationHistory: newHistory,
      historyPointer: newPointer,
    });
  };

  const handlePreviousAnonyms = () => {
    if (activeProfile.historyPointer > 0)
      handleUpdateDraft({ historyPointer: activeProfile.historyPointer - 1 });
  };

  const handleSelectAnonym = (name: string) =>
    handleUpdateDraft({ constellationName: name });

  /**
   * 目的（Objective）の選択状態を切り替える
   * プリセットの選択に伴い、スロットも連動して更新される
   * @param objId
   * @param objectId
   */
  const handleToggleObjective = (objectId: ObjectiveId) => {
    let newObjectiveIds = [...activeProfile.selectedObjectiveIds];
    const isAdding = !newObjectiveIds.includes(objectId);
    if (isAdding) {
      if (objectId === "partner") {
        const otherProfileWithPartner = profiles.find(
          (p) =>
            p.id !== activeProfile.id &&
            p.selectedObjectiveIds.includes("partner")
        );
        if (otherProfileWithPartner) {
          setModal({
            isOpen: true,
            type: "error",
            targetId: undefined,
            message: `「パートナー活」は全プロフィールの中で1つだけ登録可能です。現在「${otherProfileWithPartner.name}」で使用されています。`,
          });
          return;
        }
      }
      newObjectiveIds.push(objectId);
      const preset = OBJECTIVE_PRESETS.find((p) => p.id === objectId);
      if (preset) {
        const newSlotsSet = new Set([
          ...activeProfile.selectedSlots,
          ...preset.slots,
        ]);
        handleUpdateDraft({
          selectedObjectiveIds: newObjectiveIds,
          selectedSlots: [...newSlotsSet],
        });
      }
    } else {
      newObjectiveIds = newObjectiveIds.filter((id) => id !== objectId);
      handleUpdateDraft({ selectedObjectiveIds: newObjectiveIds });
    }
  };

  const toggleSlot = (slotId: SlotId) => {
    const isCurrentlySelected = activeProfile.selectedSlots.includes(slotId);
    if (isCurrentlySelected) {
      const newSlots = activeProfile.selectedSlots.filter(
        (id) => id !== slotId
      );
      const newObjectiveIds = activeProfile.selectedObjectiveIds.filter(
        (objectId) => {
          const preset = OBJECTIVE_PRESETS.find((p) => p.id === objectId);
          return preset && !preset.slots.includes(slotId);
        }
      );
      handleUpdateDraft({
        selectedSlots: newSlots,
        selectedObjectiveIds: newObjectiveIds,
      });
    } else {
      handleUpdateDraft({
        selectedSlots: [...activeProfile.selectedSlots, slotId],
      });
    }
  };

  const createNewProfile = () => {
    const performCreate = () => {
      const newId = `p${Date.now()}`;
      const ghost = profiles.find((p) => p.isGhost);
      if (ghost) {
        const newProfile: Profile = {
          ...ghost,
          id: newId,
          name: "新しい仮面",
          isGhost: false,
          avatarType: "user",
          maskId: "mask_default",
          selectedTypeId: undefined,
          selectedObjectiveIds: [],
          selectedSlots: [],
          selectedValues: ["val_core"],
        };
        setProfiles((previous) => [...previous, newProfile]);
        setActiveProfileId(newId);
        setIsDirty(false);
        setModal({ isOpen: false, type: "", targetId: undefined, message: "" });
        mainScrollReference.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    if (isDirty) {
      setModal({
        isOpen: true,
        type: "confirm_create",
        targetId: undefined,
        message: "変更を破棄して、新規作成しますか？",
        action: performCreate,
      });
    } else {
      performCreate();
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.constellationName.includes(searchQuery)
    );
  }, [profiles, searchQuery]);

  return {
    profiles,
    activeProfile,
    activeProfileId,
    editDraft,
    isDirty,
    searchQuery,
    setSearchQuery,
    modal,
    setModal,
    errors,
    mainScrollRef: mainScrollReference,
    handleUpdateDraft,
    requestSwitchProfile,
    handleSave,
    handleNextAnonyms,
    handlePrevAnonyms: handlePreviousAnonyms,
    handleSelectAnonym,
    handleToggleObjective,
    toggleSlot,
    createNewProfile,
    filteredProfiles,
    setActiveProfileId,
    setIsDirty,
  };
};
