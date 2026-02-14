import { LucideIcon } from 'lucide-react';

/**
 * プロフィールのタイプ
 */
export type ProfileType = {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly description: string;
  readonly isSpecial?: boolean;
};

/**
 * プロフィールの目的（プリセット）
 */
export type ObjectivePreset = {
  readonly id: string;
  readonly label: string;
  readonly slots: readonly string[];
  readonly icon: LucideIcon;
};

/**
 * スロットの定義
 */
export type Slot = {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
};

/**
 * 価値観のカテゴリー
 */
export type ValueCategory = {
  readonly id: string;
  readonly name: string;
  readonly total: number;
  readonly answered: number;
  readonly isRoot?: boolean;
  readonly icon: LucideIcon;
};

/**
 * カセット（データセット）
 */
export type Cassette = {
  readonly id: string;
  readonly name: string;
  readonly items: readonly string[];
};

/**
 * プロフィールの実体定義
 */
export type ProfileMask = {
  readonly id: string;
  readonly name: string;
  readonly constellationName: string;
  readonly constellationHistory: readonly (readonly string[])[];
  readonly historyPointer: number;
  readonly avatarType: 'ghost' | 'user';
  readonly maskId: string;
  readonly isGhost: boolean;
  readonly selectedTypeId: string | null;
  readonly selectedObjectiveIds: readonly string[];
  readonly selectedSlots: readonly string[];
  readonly selectedValues: readonly string[];
  readonly workSetId?: string;
  readonly skillSetId?: string;
};

/**
 * モーダルの状態
 */
export type ModalState = {
  readonly isOpen: boolean;
  readonly type: 'error' | 'success' | 'confirm_exit' | 'confirm_create' | 'info' | '';
  readonly targetId?: string | null;
  readonly message: string;
  readonly action?: () => void;
};
