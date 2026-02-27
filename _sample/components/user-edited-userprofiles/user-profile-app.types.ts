import React from "react";

export type SlotType = "work" | "value" | "skill";

export type SectionId =
  | "work_future"
  | "work_current"
  | "work_life"
  | "value"
  | "skill";

export interface Slot {
  id: string;
  type: SlotType;
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  tier?: 1 | 2 | 3;
}

export interface Package {
  readonly id: string;
  readonly type: SlotType;
  readonly title: string;
  readonly category: string;
  readonly description?: string;
  readonly items: readonly Slot[];
}

export interface UserProfile {
  readonly id: string;
  readonly name: string;
  readonly handle: string;
  readonly bio: string;
  readonly avatarUrl: string;
  readonly coverUrl: string;
  readonly attributes: {
    readonly purpose: string;
    readonly role: string;
    readonly type: string;
  };
  readonly equippedSlots: {
    readonly worksFuture: readonly Slot[];
    readonly worksCurrent: readonly Slot[];
    readonly worksLife: readonly Slot[];
    readonly values: readonly Slot[];
    readonly skills: readonly Slot[];
  };
  readonly equippedPackages: {
    readonly worksFuture: readonly Package[];
    readonly worksCurrent: readonly Package[];
    readonly worksLife: readonly Package[];
    readonly values: readonly Package[];
    readonly skills: readonly Package[];
  };
}

// UI Component Props
export interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "icon";
}

export interface InputProperties extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export interface TierBadgeProperties {
  tier?: number;
  onClick?: () => void;
}

export interface CompactSlotItemProperties {
  item: Slot;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  onClick?: () => void;
  onTierChange?: () => void;
  isEquipped?: boolean;
  isRegistered?: boolean;
  isPackageMember?: boolean;
}

export interface EquippedPackageItemProperties {
  pkg: Package;
  onRemove: () => void;
  onUpdateTier: (itemId: string, currentTier?: number) => void;
}

export interface GlobalNavProperties {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface ProfileListSidebarProperties {
  readonly profiles: readonly UserProfile[];
  readonly activeId: string;
  readonly onSelect: (id: string) => void;
}

export interface InventorySidebarProperties {
  activeSectionId: SectionId;
  onEquipPackage: (package_: Package) => void;
  onEquipItem: (item: Slot) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateTier: (itemId: string, newTier?: 1 | 2 | 3) => void;
  localTiers: Record<string, 1 | 2 | 3 | undefined>;
  setLocalTiers: React.Dispatch<
    React.SetStateAction<Record<string, 1 | 2 | 3 | undefined>>
  >;
  profile: UserProfile;
}

export interface MainEditorProperties {
  readonly profile: UserProfile;
  readonly activeSection: SectionId;
  readonly onSectionSelect: (sectionId: SectionId) => void;
  readonly onUpdate: (updatedProfile: UserProfile) => void;
  readonly onUpdateTier: (itemId: string, newTier?: 1 | 2 | 3) => void;
  readonly onSave: () => void;
  readonly isSaving: boolean;
  readonly isDirty: boolean;
}
