"use client";

import {
  Anchor,
  Aperture,
  Award,
  Bookmark,
  Briefcase,
  Cloud,
  Contact,
  Cpu,
  Eye,
  FileText,
  Flag,
  Gamepad2,
  Ghost,
  Heart,
  Home,
  Layers,
  LucideIcon,
  MessageSquare,
  Mic2,
  Moon,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  selectedTypeId: ProfileTypeId | null;
  selectedObjectiveIds: ObjectiveId[];
  selectedSlots: SlotId[];
  selectedValues: ValueCategoryId[];
  workSetId?: CassetteId;
  skillSetId?: CassetteId;
}

export interface ModalState {
  isOpen: boolean;
  type: "confirm_exit" | "confirm_create" | "error" | "success" | "info" | "";
  targetId: string | null;
  message: string;
  action?: () => void;
}

// --- Constants ---

export const MASK_ICONS: MaskIcon[] = [
  { id: "mask_default", icon: User, label: "標準" },
  { id: "mask_zap", icon: Zap, label: "電撃" },
  { id: "mask_shield", icon: Shield, label: "守護" },
  { id: "mask_star", icon: Star, label: "希望" },
  { id: "mask_target", icon: Target, label: "目的" },
  { id: "mask_anchor", icon: Anchor, label: "不変" },
  { id: "mask_cloud", icon: Cloud, label: "幻想" },
  { id: "mask_sun", icon: Sun, label: "情熱" },
  { id: "mask_aperture", icon: Aperture, label: "視点" },
  { id: "mask_smile", icon: Smile, label: "社交" },
];

export const COLORS = [
  "赤い",
  "青い",
  "黄色い",
  "緑の",
  "紫の",
  "橙色の",
  "ピンクの",
  "茶色の",
  "灰色の",
  "黒い",
  "白い",
];
export const MATERIALS = [
  "マテリアル",
  "光",
  "幻想",
  "氷",
  "炎",
  "輝き",
  "熱狂",
  "闇",
  "風",
  "水",
  "土",
  "雷",
  "音",
  "光速",
  "宇宙",
];
export const USER_BASE_CONSTELLATION = "魚座";

export const PROFILE_TYPES: ProfileType[] = [
  {
    id: "self",
    label: "本人 (SELF)",
    icon: User,
    description:
      "「自分自身の仮面」を作成します。標準的なプロフィールです。あなた自身の作品や性格等を登録し、あなたの「顔」を作成します。",
  },
  {
    id: "interview",
    label: "インタビュー (INTERVIEW)",
    icon: Mic2,
    description:
      "相手と対話して得た回答を元に作成します。直接本人から聞いてない場合は「心象プロフィール」を選択してください。",
  },
  {
    id: "imagined",
    label: "心象プロフィール (IMAGINED)",
    icon: Eye,
    description:
      "外部の断片的な情報とあなたの想像力で、あなたから見たその人の人物像を構築します。",
  },
  {
    id: "ideal",
    label: "理想像 (IDEAL)",
    icon: Sparkles,
    description:
      "あなた自身が求めている人物像や理想をプロフィール化して「理想の仮面」を作成します。",
  },
  {
    id: "politician",
    label: "議員 / POLITICIAN",
    icon: Award,
    description:
      "特別なプロフィールタイプ。政治家、または候補者としての情報を登録します。",
    isSpecial: true,
  },
  {
    id: "ai_dummy",
    label: "AIダミー生成 (AI DUMMY)",
    icon: Cpu,
    description:
      "テスト用にAIが架空の設定を自動生成します。デザイン確認や動作テストのために使用します。",
    isSpecial: true,
  },
];

export const ALL_SLOTS: Slot[] = [
  { id: "works", label: "自分の作品", icon: Layers },
  { id: "favorites", label: "好きな作品", icon: Gamepad2 },
  { id: "values", label: "自分の価値観", icon: MessageSquare },
  { id: "skills", label: "スキル", icon: Zap },
  { id: "politics", label: "政治情報", icon: Flag },
  { id: "partner_meta", label: "パートナー情報", icon: Heart },
  { id: "social", label: "連絡先", icon: Share2 },
];

export const OBJECTIVE_PRESETS: ObjectivePreset[] = [
  {
    id: "business_card",
    label: "名刺",
    slots: ["works", "skills"],
    icon: Contact,
  },
  {
    id: "resume",
    label: "履歴書",
    slots: ["works", "favorites", "values", "skills"],
    icon: FileText,
  },
  {
    id: "build_work",
    label: "創る・働く",
    slots: ["works", "favorites", "values", "skills"],
    icon: Briefcase,
  },
  {
    id: "play",
    label: "遊ぶ",
    slots: ["favorites", "values", "skills"],
    icon: Gamepad2,
  },
  {
    id: "partner",
    label: "パートナー活",
    slots: ["favorites", "values", "skills", "partner_meta"],
    icon: Heart,
  },
  {
    id: "consult",
    label: "相談",
    slots: ["favorites", "values", "skills"],
    icon: MessageSquare,
  },
  { id: "politics", label: "政治", slots: ["values", "politics"], icon: Flag },
  {
    id: "other",
    label: "その他",
    slots: ["favorites", "values", "skills"],
    icon: Settings,
  },
];

export const VALUE_CATEGORIES: ValueCategory[] = [
  {
    id: "val_core",
    name: "基礎の基礎",
    total: 10,
    answered: 10,
    isRoot: true,
    icon: Bookmark,
  },
  { id: "val_basic", name: "基本", total: 30, answered: 12, icon: User },
  {
    id: "val_work",
    name: "創る・働く",
    total: 40,
    answered: 25,
    icon: Briefcase,
  },
  { id: "val_play", name: "遊ぶ", total: 30, answered: 8, icon: Gamepad2 },
  {
    id: "val_partner",
    name: "パートナー探し",
    total: 35,
    answered: 5,
    icon: Heart,
  },
  { id: "val_life", name: "生活", total: 25, answered: 15, icon: Home },
  {
    id: "val_ethic",
    name: "社会・倫理",
    total: 30,
    answered: 10,
    icon: ShieldAlert,
  },
  { id: "val_end", name: "終活", total: 20, answered: 2, icon: Moon },
  { id: "val_politics", name: "政治", total: 25, answered: 18, icon: Flag },
];

export const INITIAL_WORKS_CASSETTES: Cassette[] = [
  {
    id: "ws1",
    name: "一般公開用カセット",
    items: ["Next.js App", "React Library"],
  },
  {
    id: "ws2",
    name: "R18作品カセット",
    items: ["秘密のイラスト集", "限定コンテンツ"],
  },
];
export const INITIAL_SKILL_CASSETTES: Cassette[] = [
  {
    id: "ss1",
    name: "エンジニア構成カセット",
    items: ["React", "TypeScript", "Tailwind"],
  },
  {
    id: "ss2",
    name: "デザイナー構成カセット",
    items: ["Figma", "Photoshop", "UI/UX"],
  },
];

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
  const mainScrollRef = useRef<HTMLDivElement>(null);

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
      selectedTypeId: null,
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

  const [editDraft, setEditDraft] = useState<Profile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>("ghost");
  const [isDirty, setIsDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "",
    targetId: null,
    message: "",
  });

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
        .catch((err) => {
          console.error("Failed to load profiles:", err);
        });
    }
  }, [adapter]);

  useEffect(() => {
    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      setEditDraft({ ...profile });
      setIsDirty(false);
      mainScrollRef.current?.scrollTo({ top: 0 });
    }
  }, [activeProfileId, profiles]);

  const activeProfile =
    editDraft || profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleUpdateDraft = (updatedFields: Partial<Profile>) => {
    setEditDraft((prev) => (prev ? { ...prev, ...updatedFields } : null));
    setIsDirty(true);
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
      if (!activeProfile.selectedTypeId) {
        setModal({
          isOpen: true,
          type: "error",
          targetId: null,
          message: "STEP 2: プロフィールのタイプを選択してください。",
        });
        return;
      }
      if (activeProfile.selectedObjectiveIds.length === 0) {
        setModal({
          isOpen: true,
          type: "error",
          targetId: null,
          message: "STEP 3: プロフィールの目的を1つ以上選択してください。",
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
            targetId: null,
            message: "仮面の保存が完了しました。",
          });
        })
        .catch((_err) => {
          setModal({
            isOpen: true,
            type: "error",
            targetId: null,
            message: "保存に失敗しました。",
          });
        });
    } else {
      setModal({
        isOpen: true,
        type: "success",
        targetId: null,
        message: "仮面の保存が完了しました。",
      });
    }

    setTimeout(
      () =>
        setModal((prev) =>
          prev.type === "success" ? { ...prev, isOpen: false } : prev
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
    let newHistory = [...constellationHistory, newSet];
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

  const handlePrevAnonyms = () => {
    if (activeProfile.historyPointer > 0)
      handleUpdateDraft({ historyPointer: activeProfile.historyPointer - 1 });
  };

  const handleSelectAnonym = (name: string) =>
    handleUpdateDraft({ constellationName: name });

  /**
   * 目的（Objective）の選択状態を切り替える
   * プリセットの選択に伴い、スロットも連動して更新される
   */
  const handleToggleObjective = (objId: ObjectiveId) => {
    let newObjectiveIds = [...activeProfile.selectedObjectiveIds];
    const isAdding = !newObjectiveIds.includes(objId);
    if (isAdding) {
      if (objId === "partner") {
        const otherProfileWithPartner = profiles.find(
          (p) =>
            p.id !== activeProfile.id &&
            p.selectedObjectiveIds.includes("partner")
        );
        if (otherProfileWithPartner) {
          setModal({
            isOpen: true,
            type: "error",
            targetId: null,
            message: `「パートナー活」は全プロフィールの中で1つだけ登録可能です。現在「${otherProfileWithPartner.name}」で使用されています。`,
          });
          return;
        }
      }
      newObjectiveIds.push(objId);
      const preset = OBJECTIVE_PRESETS.find((p) => p.id === objId);
      if (preset) {
        const newSlotsSet = new Set([
          ...activeProfile.selectedSlots,
          ...preset.slots,
        ]);
        handleUpdateDraft({
          selectedObjectiveIds: newObjectiveIds,
          selectedSlots: Array.from(newSlotsSet),
        });
      }
    } else {
      newObjectiveIds = newObjectiveIds.filter((id) => id !== objId);
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
        (objId) => {
          const preset = OBJECTIVE_PRESETS.find((p) => p.id === objId);
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
          selectedTypeId: null,
          selectedObjectiveIds: [],
          selectedSlots: [],
          selectedValues: ["val_core"],
        };
        setProfiles((prev) => [...prev, newProfile]);
        setActiveProfileId(newId);
        setIsDirty(false);
        setModal({ isOpen: false, type: "", targetId: null, message: "" });
        mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    if (isDirty) {
      setModal({
        isOpen: true,
        type: "confirm_create",
        targetId: null,
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
    mainScrollRef,
    handleUpdateDraft,
    requestSwitchProfile,
    handleSave,
    handleNextAnonyms,
    handlePrevAnonyms,
    handleSelectAnonym,
    handleToggleObjective,
    toggleSlot,
    createNewProfile,
    filteredProfiles,
    setActiveProfileId,
    setIsDirty,
  };
};
