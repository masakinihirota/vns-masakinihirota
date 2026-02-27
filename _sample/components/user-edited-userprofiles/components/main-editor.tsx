import {
  AlertCircle,
  Clock,
  Edit3,
  Heart,
  History,
  Image as ImageIcon,
  Loader2,
  Save,
  Target,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import React from "react";

import { getKeysBySectionId, getNextTier } from "../user-profile-app.logic";
import {
  MainEditorProperties,
  Package,
  SectionId,
  Slot
} from "../user-profile-app.types";

import { Button, Input } from "./common-ui";
import { EquippedPackageItem } from "./equipped-package";
import { CompactSlotItem } from "./slot-items";

/**
 * プロフィール編集のメインエディタコンポーネント
 * プロフィール基本情報（名前、自己紹介、アバター）および装備スロットの管理を行います。
 * @param root0
 * @param root0.profile
 * @param root0.activeSection
 * @param root0.onSectionSelect
 * @param root0.onUpdate
 * @param root0.onUpdateTier
 * @param root0.onSave
 * @param root0.isSaving
 * @param root0.isDirty
 */
export const MainEditor = ({
  profile,
  activeSection,
  onSectionSelect,
  onUpdate,
  onUpdateTier,
  onSave,
  isSaving,
  isDirty,
}: MainEditorProperties) => {

  const handleRemoveSlot = (slotId: string, sectionId: SectionId) => {
    const key = getKeysBySectionId(sectionId);
    const slots = profile?.equippedSlots?.[key] || [];
    const updated = slots.filter(
      (s: Slot) => s.id !== slotId
    );
    onUpdate({
      ...profile,
      equippedSlots: { ...profile?.equippedSlots, [key]: updated },
    });
  };

  const handleRemovePackage = (packageIndex: number, sectionId: SectionId) => {
    const key = getKeysBySectionId(sectionId);
    const packages = profile?.equippedPackages?.[key] || [];
    const updated = packages.filter((_, index) => index !== packageIndex);
    onUpdate({
      ...profile,
      equippedPackages: { ...profile?.equippedPackages, [key]: updated },
    });
  };

  const getSectionStyle = (sectionId: SectionId) => {
    const isActive = activeSection === sectionId;
    const base =
      "border rounded-lg transition-all duration-200 relative overflow-hidden";
    if (isActive) {
      let colors = "";
      if (sectionId.startsWith("work")) {
        colors =
          "border-blue-400 dark:border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/30 bg-white dark:bg-slate-900";
      } else if (sectionId === "value") {
        colors =
          "border-pink-400 dark:border-pink-600 ring-2 ring-pink-100 dark:ring-pink-900/30 bg-white dark:bg-slate-900";
      } else {
        colors =
          "border-amber-400 dark:border-amber-600 ring-2 ring-amber-100 dark:ring-amber-900/30 bg-white dark:bg-slate-900";
      }
      return `${base} ${colors}`;
    }
    return `${base} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer`;
  };

  const renderSectionContent = (
    sectionId: SectionId,
    title: string,
    icon: React.ElementType
  ) => {
    const key = getKeysBySectionId(sectionId);
    const packages: readonly Package[] = profile?.equippedPackages?.[key] || [];
    const items: readonly Slot[] = profile?.equippedSlots?.[key] || [];
    const totalCount =
      packages.reduce((accumulator, p) => accumulator + (p?.items?.length || 0), 0) + items.length;

    return (
      <section
        className={getSectionStyle(sectionId)}
        onClick={() => onSectionSelect(sectionId)}
        aria-label={`${title} セクション`}
      >
        <div
          className={`px-3 py-2 flex items-center justify-between border-b ${activeSection === sectionId ? "bg-opacity-50 dark:bg-slate-900/50" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 capitalize" aria-label={title}>
            {React.createElement(icon, { className: "w-3 h-3" })}
            {title}
          </div>
          <span className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded border border-slate-200 dark:border-slate-700">
            {totalCount} items
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 min-h-[32px] p-2 space-y-2">
          {packages.length > 0 && (
            <div className="space-y-2">
              {packages.map((package_, index) => (
                <EquippedPackageItem
                  key={`${package_.id}-${index}`}
                  pkg={package_}
                  onRemove={() => handleRemovePackage(index, sectionId)}
                  onUpdateTier={(itemId, currentTier) => {
                    const next = getNextTier(currentTier);
                    onUpdateTier(itemId, next);
                  }}
                />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div
              className={`space-y-0 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden ${packages.length > 0 ? "mt-4" : ""}`}
            >
              {items.map((slot) => (
                <CompactSlotItem
                  key={slot.id}
                  item={slot}
                  isEquipped
                  onAction={() => handleRemoveSlot(slot.id, sectionId)}
                  actionIcon={
                    <>
                      <X className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">{slot.title}を外す</span>
                    </>
                  }
                  onTierChange={() => {
                    const next = getNextTier(slot.tier);
                    onUpdateTier(slot.id, next);
                  }}
                />
              ))}
            </div>
          )}

          {totalCount === 0 && (
            <div className="text-xs text-slate-400 dark:text-slate-600 text-center py-4">
              アイテムがありません
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <main data-testid="main-editor" className="flex-1 flex flex-col h-full bg-slate-50/30 dark:bg-black/30 overflow-hidden">
      <div className="h-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Edit3 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="font-bold text-sm text-slate-700 dark:text-slate-300">
            Editor
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {isDirty && (
            <span className="flex items-center text-[10px] text-amber-600 dark:text-amber-400 animate-pulse mr-2">
              <AlertCircle className="w-3 h-3 mr-1" /> Unsaved
            </span>
          )}
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Preview
          </Button>
          <Button
            size="sm"
            className={`h-7 text-xs gap-1 min-w-[70px] transition-all ${isDirty ? "ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-slate-900" : ""}`}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3 flex gap-4 items-start shadow-sm">
            <div
              className="w-16 h-16 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden relative group cursor-pointer"
              role="button"
              aria-label="アバター画像を変更する（現在は未実装）"
              title="アバター変更"
            >
              <Image
                src={profile.avatarUrl}
                alt={`${profile.name}のアバター`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ImageIcon className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="profile-name"
                  className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase"
                >
                  Display Name
                </label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  className="h-7 text-sm"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdate({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="profile-bio"
                  className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase"
                >
                  Bio
                </label>
                <Input
                  id="profile-bio"
                  value={profile.bio}
                  className="h-7 text-sm"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdate({ ...profile, bio: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            Equipped Slots
          </div>

          {renderSectionContent("work_future", "Works (Future)", Target)}
          {renderSectionContent("work_current", "Works (Current)", Clock)}
          {renderSectionContent("work_life", "Works (Life)", History)}

          {renderSectionContent("value", "Values", Heart)}
          {renderSectionContent("skill", "Skills", Zap)}
        </div>
      </div>
    </main>
  );
};
