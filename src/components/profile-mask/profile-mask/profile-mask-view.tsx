"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Disc,
  Layers,
  Plus,
  RotateCw,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import React from "react";
import * as Sections from "../sections";
import {
  INITIAL_SKILL_CASSETTES,
  INITIAL_WORKS_CASSETTES,
  MASK_ICONS,
  PROFILE_TYPES,
} from "./profile-mask.constants";
import { ModalState, ProfileMask } from "./profile-mask.types";

interface ProfileMaskViewProps {
  profiles: readonly ProfileMask[];
  activeProfile: ProfileMask;
  activeProfileId: string;
  filteredProfiles: readonly ProfileMask[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDirty: boolean;
  modal: ModalState;
  mainScrollRef: React.RefObject<HTMLDivElement | null>;
  onUpdateDraft: (fields: Partial<ProfileMask>) => void;
  onSwitchProfile: (id: string) => void;
  onSave: () => void;
  onNextAnonyms: () => void;
  onPrevAnonyms: () => void;
  onSelectAnonym: (name: string) => void;
  onToggleObjective: (id: string) => void;
  onToggleSlot: (id: string) => void;
  onCreateNewProfile: () => void;
  onCloseModal: () => void;
  onConfirmModal: () => void;
}

export const ProfileMaskView: React.FC<ProfileMaskViewProps> = ({
  activeProfile,
  activeProfileId,
  filteredProfiles,
  searchQuery,
  setSearchQuery,
  isDirty,
  modal,
  mainScrollRef,
  onUpdateDraft,
  onSwitchProfile,
  onSave,
  onNextAnonyms,
  onPrevAnonyms,
  onSelectAnonym,
  onToggleObjective,
  onToggleSlot,
  onCreateNewProfile,
  onCloseModal,
  onConfirmModal,
}) => {
  // マスクアイコンの取得
  const getMaskIcon = (maskId: string, avatarType: string) => {
    if (avatarType === "ghost") return Disc; // 幽霊用アイコン
    const mask = MASK_ICONS.find((m) => m.id === maskId);
    return mask ? mask.icon : Disc;
  };

  const ActiveIcon = getMaskIcon(
    activeProfile.maskId,
    activeProfile.avatarType
  );

  return (
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text)] font-sans overflow-hidden">
      {/* --- Modal --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg)] dark:bg-neutral-900/95 rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 dark:border-white/10 animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${modal.type === "error" ? "bg-red-50 text-red-500" : modal.type === "success" ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"}`}
              >
                {modal.type === "success" ? (
                  <CheckCircle2 size={40} />
                ) : (
                  <AlertCircle size={40} />
                )}
              </div>
              <h3 className="text-lg font-black text-[var(--text)] mb-3 uppercase tracking-widest">
                Notification
              </h3>
              <p className="text-lg font-bold text-slate-500 dark:text-neutral-400 leading-relaxed">
                {modal.message}
              </p>
            </div>
            <div className="p-8 bg-black/5 border-t border-white/10 flex items-center justify-center space-x-4">
              {modal.type.startsWith("confirm") ? (
                <>
                  <button
                    onClick={onCloseModal}
                    className="px-8 py-3 rounded-2xl font-black text-lg text-slate-400 dark:text-neutral-500 hover:bg-white/10 transition-all"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={onConfirmModal}
                    className="px-10 py-3 rounded-2xl font-black text-lg bg-[var(--accent)] text-white shadow-xl transition-all active:scale-95"
                  >
                    確定
                  </button>
                </>
              ) : (
                <button
                  onClick={onCloseModal}
                  className="px-12 py-3 rounded-2xl font-black text-lg bg-[var(--accent)] text-white shadow-xl transition-all active:scale-95"
                >
                  了解
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Sidebar --- */}
      <aside className="w-[24rem] bg-[var(--card)] backdrop-blur-md border-r border-white/20 dark:border-white/10 flex flex-col shadow-lg shrink-0">
        <div className="p-6 border-b border-white/20 dark:border-white/10 shrink-0">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
              V
            </div>
            <h1 className="text-xl font-black tracking-tighter text-[var(--text)]">
              1000 Masks
            </h1>
          </div>
          <button
            onClick={onCreateNewProfile}
            className="w-full flex items-center justify-center space-x-3 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white py-4 rounded-[1.25rem] shadow-xl shadow-blue-500/20 transition-all active:scale-95 font-black text-lg mb-8"
          >
            <Plus size={20} />
            <span>プロフィール作成</span>
          </button>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-100/50 dark:bg-white/5 border-transparent rounded-xl text-lg font-bold outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-[var(--text)]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {filteredProfiles.map((p) => {
            const Icon = getMaskIcon(p.maskId, p.avatarType);
            const isActive = activeProfileId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSwitchProfile(p.id)}
                className={`w-full text-left p-6 rounded-[2rem] transition-all flex flex-col border-2 ${isActive
                    ? "bg-[var(--accent)] border-white/30 text-white shadow-xl scale-[1.02]"
                    : "bg-white/50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10"
                  }`}
              >
                <div className="flex items-center w-full mb-2">
                  <div
                    className={`p-3 rounded-xl mr-5 ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-400"}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-black truncate text-lg ${isActive ? "text-white" : "text-[var(--text)]"}`}
                    >
                      {p.name}
                    </p>
                  </div>
                </div>
                <div className="pl-[4.75rem] w-full">
                  <p
                    className={`text-sm font-black truncate uppercase ${isActive ? "text-white/70" : "text-slate-400"}`}
                  >
                    {p.constellationName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden m-4 bg-[var(--card)] backdrop-blur-md rounded-[2.5rem] border border-white/30 dark:border-white/10 shadow-2xl relative">
        {/* Header */}
        <header
          className={`p-8 border-b transition-all duration-500 shrink-0 bg-[var(--bg)]/90 backdrop-blur-md z-20 flex justify-between items-center ${isDirty ? "border-b-amber-400" : "border-b-slate-100 dark:border-white/5"}`}
        >
          <div className="flex-1 mr-8 flex items-center space-x-8">
            <div
              className={`p-6 rounded-[2rem] shadow-inner transition-all duration-500 ${activeProfile.isGhost ? "bg-purple-600 text-white" : "bg-[var(--accent)] text-white"}`}
            >
              <ActiveIcon size={36} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 text-slate-400 mb-1.5">
                <span
                  className={`text-sm font-black uppercase tracking-widest ${activeProfile.isGhost ? "text-purple-500" : "text-blue-500"}`}
                >
                  {activeProfile.isGhost ? "ROOT" : "MASK"}
                </span>
                <span className="text-slate-200 dark:text-white/10">|</span>
                <span className="text-sm font-black uppercase">
                  {activeProfile.constellationName}
                </span>
              </div>
              <input
                type="text"
                value={activeProfile.name}
                onChange={(e) => onUpdateDraft({ name: e.target.value })}
                className="text-2xl font-black bg-transparent focus:outline-none placeholder-slate-200 text-[var(--text)] w-full"
                placeholder="名前を入力..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {!activeProfile.isGhost && (
              <button className="p-4 text-slate-300 dark:text-white/20 hover:text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl">
                <Trash2 size={24} />
              </button>
            )}
            <button
              onClick={onSave}
              className={`flex items-center space-x-3 px-8 py-3.5 text-white rounded-2xl font-black shadow-2xl transition-all active:scale-95 text-xl ${activeProfile.isGhost ? "bg-purple-600" : "bg-[var(--accent)]"
                } ${!isDirty ? "opacity-40 grayscale pointer-events-none" : "animate-pulse"}`}
            >
              <Save size={24} />
              <span>{isDirty ? "保存する" : "保存済"}</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto p-12 max-w-7xl mx-auto w-full space-y-24 pb-64 no-scrollbar"
        >
          {/* STEP 1: 星座匿名 */}
          <section className="bg-white/10 dark:bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 dark:border-white/10 shadow-sm transition-all">
            <div className="flex items-start space-x-5 mb-8">
              <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 bg-[var(--accent)] text-white">
                1
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-[var(--text)] tracking-tight leading-none mb-2 uppercase">
                  星座匿名（識別ID）
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                  核となる識別子を選択してください。
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-lg text-slate-500 dark:text-neutral-400 font-bold">
                候補: {activeProfile.constellationName}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onPrevAnonyms}
                  disabled={activeProfile.historyPointer === 0}
                  className="p-3 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-500 dark:text-neutral-400 disabled:opacity-20 transition-all hover:bg-slate-50 dark:hover:bg-white/15"
                  aria-label="前の候補を表示"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={onNextAnonyms}
                  className="flex items-center space-x-3 px-6 py-3 rounded-2xl bg-slate-800 dark:bg-white/10 text-white font-black transition-all hover:bg-slate-700 dark:hover:bg-white/20"
                >
                  <span>次へ</span>
                  <RotateCw size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {activeProfile.constellationHistory[
                activeProfile.historyPointer
              ]?.map((name) => (
                <button
                  key={name}
                  onClick={() => onSelectAnonym(name)}
                  className={`p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${activeProfile.constellationName === name
                      ? "bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]"
                      : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 dark:text-neutral-400"
                    }`}
                >
                  <span className="font-bold">{name}</span>
                  {activeProfile.constellationName === name && (
                    <CheckCircle2 size={24} />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* STEP 2: プロフィールタイプ */}
          <section className="space-y-12">
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 bg-[var(--accent)] text-white">
                2
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-[var(--text)] tracking-tight leading-none mb-2 uppercase">
                  プロフィールのタイプ
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                  用途に合わせてタイプを選択してください。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROFILE_TYPES.map((type) => (
                <Sections.TypeCard
                  key={type.id}
                  type={type}
                  isSelected={activeProfile.selectedTypeId === type.id}
                  onSelect={(id) => onUpdateDraft({ selectedTypeId: id })}
                />
              ))}
            </div>
          </section>

          {/* STEP 3: プロフィールの目的 */}
          <section className="space-y-12">
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 bg-[var(--accent)] text-white">
                3
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-[var(--text)] tracking-tight leading-none mb-2 uppercase">
                  プロフィールの目的
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                  目的を選択すると、最適なスロットが自動的に構成されます。
                </p>
              </div>
            </div>
            <Sections.ObjectiveSelector
              selectedIds={activeProfile.selectedObjectiveIds}
              onToggle={onToggleObjective}
            />
          </section>

          {/* STEP 4: スロット設定 */}
          <section className="space-y-12">
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 bg-[var(--accent)] text-white">
                4
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-[var(--text)] tracking-tight leading-none mb-2 uppercase">
                  スロット設定
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                  公開したい情報の種類を微調整できます。
                </p>
              </div>
            </div>
            <Sections.SlotSelector
              selectedSlots={activeProfile.selectedSlots}
              onToggle={onToggleSlot}
            />
          </section>

          {/* STEP 5: データセット（カセット）選択 */}
          <section className="space-y-12">
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-lg shadow-lg shrink-0 bg-[var(--accent)] text-white">
                5
              </div>
              <div className="pt-1">
                <h2 className="text-xl font-black text-[var(--text)] tracking-tight leading-none mb-2 uppercase">
                  データセット選択
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                  スロットに流し込むデータの塊を選択してください。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeProfile.selectedSlots.includes("works") && (
                <Sections.CassetteSelector
                  label="作品セット"
                  icon={Layers}
                  colorClass="border-l-blue-500"
                  cassettes={INITIAL_WORKS_CASSETTES}
                  selectedId={activeProfile.workSetId}
                  onSelect={(id) => onUpdateDraft({ workSetId: id })}
                />
              )}
              {activeProfile.selectedSlots.includes("skills") && (
                <Sections.CassetteSelector
                  label="形式・スキル"
                  icon={Sparkles}
                  colorClass="border-l-amber-500"
                  cassettes={INITIAL_SKILL_CASSETTES}
                  selectedId={activeProfile.skillSetId}
                  onSelect={(id) => onUpdateDraft({ skillSetId: id })}
                />
              )}
            </div>
          </section>

          {/* フッター余白 */}
          <div className="h-32" />
        </div>
      </main>
    </div>
  );
};
