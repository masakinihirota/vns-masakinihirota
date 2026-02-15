"use client";

import React from 'react';
import { ModalState, useProfileCreation } from './profile-creation-1000masks.logic';
import { Header } from './ui/header';
import { Modal } from './ui/modal';
import { Sidebar } from './ui/sidebar';
import { GhostView } from './ui/steps/ghost-view';
import { Step1Constellation } from './ui/steps/step1-constellation';
import { Step2Type } from './ui/steps/step2-type';
import { Step3Objective } from './ui/steps/step3-objective';
import { Step4Slots } from './ui/steps/step4-slots';
import { Step5Cassettes } from './ui/steps/step5-cassettes';

export const ProfileCreation1000Masks: React.FC = () => {
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
  } = useProfileCreation();

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

      <main ref={mainScrollRef} className="flex-1 overflow-y-auto bg-white dark:bg-[#0B0F1A]/50 relative no-scrollbar transition-colors duration-300">
        <div className="max-w-5xl mx-auto min-h-screen flex flex-col">
          <Header
            activeProfile={activeProfile}
            isDirty={isDirty}
            onNameChange={(name) => handleUpdateDraft({ name })}
            onSave={handleSave}
            onDelete={() => setModal({ isOpen: true, type: 'info', targetId: null, message: '削除機能は実装中です' })}
          />

          <div className="flex-1 p-12 pb-32 space-y-16">
            <Step1Constellation
              activeProfile={activeProfile}
              onNextAnonyms={handleNextAnonyms}
              onPrevAnonyms={handlePrevAnonyms}
              onSelectAnonym={handleSelectAnonym}
              isAtHistoryEnd={activeProfile.historyPointer === activeProfile.constellationHistory.length - 1}
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
                  onOpenModal={(type: ModalState['type'], message: string) => setModal({ isOpen: true, type, targetId: null, message })}
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
