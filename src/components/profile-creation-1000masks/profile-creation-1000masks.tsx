"use client";

import React from 'react';
import { useProfileCreation } from './profile-creation-1000masks.logic';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  } = useProfileCreation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-600">
      <Sidebar
        profiles={profiles}
        filteredProfiles={filteredProfiles}
        activeProfileId={activeProfileId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfileSelect={requestSwitchProfile}
        onCreateNew={createNewProfile}
      />

      <main className="flex-1 flex flex-col relative min-w-0">
        <Header
          activeProfile={activeProfile}
          isDirty={isDirty}
          onNameChange={(name) => handleUpdateDraft({ name })}
          onSave={handleSave}
          onDelete={() => setModal({ isOpen: true, type: 'info', targetId: null, message: '削除機能は実装中です' })}
        />

        <div ref={mainScrollRef} className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8 space-y-12 pb-32">
          {activeProfile.isGhost ? (
            <>
              <GhostView activeProfile={activeProfile} />
              <Step1Constellation
                activeProfile={activeProfile}
                onNextAnonyms={handleNextAnonyms}
                onPrevAnonyms={handlePrevAnonyms}
                onSelectAnonym={handleSelectAnonym}
                isAtHistoryEnd={activeProfile.historyPointer === activeProfile.constellationHistory.length - 1}
              />
            </>
          ) : (
            <div className="space-y-16 animate-in fade-in duration-500">
              <Step1Constellation
                activeProfile={activeProfile}
                onNextAnonyms={handleNextAnonyms}
                onPrevAnonyms={handlePrevAnonyms}
                onSelectAnonym={handleSelectAnonym}
                isAtHistoryEnd={activeProfile.historyPointer === activeProfile.constellationHistory.length - 1}
              />
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
                onOpenModal={(type, message) => setModal({ isOpen: true, type, targetId: null, message })}
              />
            </div>
          )}
        </div>

        <Modal
          modal={modal}
          onClose={() => setModal({ ...modal, isOpen: false })}
        />
      </main>
    </div>
  );
};
