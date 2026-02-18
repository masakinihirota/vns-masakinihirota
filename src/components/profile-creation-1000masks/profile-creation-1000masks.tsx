"use client";

import { Sparkles, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { LocalStorageAdapter } from "./adapters/local-storage-adapter";
import { PostgresAdapter } from "./adapters/postgres-adapter";
import {
  ModalState,
  useProfileCreation,
} from "./profile-creation-1000masks.logic";
import { ProfileStorageAdapter } from "./profile-storage-adapter";
import { Header } from "./ui/header";
import { Modal } from "./ui/modal";
import { Sidebar } from "./ui/sidebar";
import { GhostView } from "./ui/steps/ghost-view";
import { Step1Constellation } from "./ui/steps/step1-constellation";
import { Step2Type } from "./ui/steps/step2-type";
import { Step3Objective } from "./ui/steps/step3-objective";
import { Step4Slots } from "./ui/steps/step4-slots";
import { Step5Cassettes } from "./ui/steps/step5-cassettes";

interface ProfileCreationProps {
  adapter?: ProfileStorageAdapter;
  isTrial?: boolean;
}

export const ProfileCreation1000Masks: React.FC<ProfileCreationProps> = ({
  adapter,
  isTrial,
}) => {
  return (
    <Suspense fallback={null}>
      <ProfileCreationContent adapter={adapter} isTrial={isTrial} />
    </Suspense>
  );
};

const ProfileCreationContent: React.FC<ProfileCreationProps> = ({
  adapter,
  isTrial,
}) => {
  const storageAdapter = React.useMemo(() => {
    if (adapter) return adapter;
    return isTrial ? new LocalStorageAdapter() : new PostgresAdapter();
  }, [adapter, isTrial]);

  const searchParams = useSearchParams();
  const fromTrial = searchParams.get("from") === "trial";
  const [showReminder, setShowReminder] = React.useState(fromTrial);

  const {
    profiles,
    activeProfile,
    activeProfileId,
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
  } = useProfileCreation(storageAdapter);

  // プロフィールが幽霊以外に存在しないかチェック
  const realProfileCount = profiles.filter((p) => !p.isGhost).length;
  const needsCreation =
    realProfileCount === 0 ||
    (realProfileCount === 1 &&
      profiles.find((p) => !p.isGhost)?.name === "エンジニアとしての僕");
  const shouldShowBanner = showReminder && needsCreation;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0F1A] overflow-hidden transition-colors duration-300 font-sans">
      <Sidebar
        profiles={profiles}
        filteredProfiles={filteredProfiles}
        activeProfileId={activeProfileId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfileSelect={requestSwitchProfile}
        onCreateNew={createNewProfile}
      />

      <main
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto bg-white dark:bg-[#0B0F1A]/50 relative no-scrollbar transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto min-h-screen flex flex-col">
          <Header
            activeProfile={activeProfile}
            isDirty={isDirty}
            onNameChange={(name) => handleUpdateDraft({ name })}
            onSave={handleSave}
            onDelete={() =>
              setModal({
                isOpen: true,
                type: "info",
                targetId: null,
                message: "削除機能は実装中です",
              })
            }
          />

          {shouldShowBanner && (
            <div className="mx-12 mt-8 animate-in slide-in-from-top-4 duration-500">
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 p-6 backdrop-blur-xl shadow-xl shadow-amber-500/5">
                <div className="relative z-10 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                      <Sparkles size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[20px] font-black text-amber-900 dark:text-amber-200">
                        プロフィールを新規に作成してください
                      </h4>
                      <p className="text-[16px] font-medium text-amber-800/80 dark:text-amber-300/80">
                        体験版へようこそ！まずは左側の「新規作成」ボタンから、あなたの最初のプロフィールを作りましょう。
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReminder(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200/50 text-amber-900 transition-colors hover:bg-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:hover:bg-amber-800"
                  >
                    <X size={20} />
                  </button>
                </div>
                {/* 装飾用 */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl" />
              </div>
            </div>
          )}

          <div className="flex-1 p-12 pb-32 space-y-16">
            <Step1Constellation
              activeProfile={activeProfile}
              onNextAnonyms={handleNextAnonyms}
              onPrevAnonyms={handlePrevAnonyms}
              onSelectAnonym={handleSelectAnonym}
              isAtHistoryEnd={
                activeProfile.historyPointer ===
                activeProfile.constellationHistory.length - 1
              }
            />

            {activeProfile.isGhost ? (
              <GhostView activeProfile={activeProfile} />
            ) : (
              <>
                <Step2Type
                  activeProfile={activeProfile}
                  onUpdateDraft={handleUpdateDraft}
                />
                <Step3Objective
                  activeProfile={activeProfile}
                  onToggleObjective={handleToggleObjective}
                  onToggleSlot={toggleSlot}
                />
                <Step4Slots
                  activeProfile={activeProfile}
                  onToggleSlot={toggleSlot}
                />
                <Step5Cassettes
                  activeProfile={activeProfile}
                  onUpdateDraft={handleUpdateDraft}
                  onOpenModal={(type: ModalState["type"], message: string) =>
                    setModal({ isOpen: true, type, targetId: null, message })
                  }
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Modal
        modal={modal}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirmExit={() => {
          if (modal.targetId) {
            setActiveProfileId(modal.targetId);
            setIsDirty(false);
          }
          setModal({ ...modal, isOpen: false });
        }}
      />
    </div>
  );
};
