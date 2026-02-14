'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProfileMaskView } from './profile-mask-view';
import {
  USER_BASE_CONSTELLATION
} from './profile-mask.constants';
import {
  generateCandidateSet,
  getNextAnonymsHistory,
  toggleObjectiveSlots,
  toggleSlotAndObjectives,
  validatePartnerObjective,
} from './profile-mask.logic';
import { ModalState, ProfileMask } from './profile-mask.types';

/**
 * 幽霊プロフィールの初期データ生成
 */
const createInitialGhost = (): ProfileMask => {
  const initialHistory = [generateCandidateSet(USER_BASE_CONSTELLATION)];
  return {
    id: 'ghost',
    name: '幽霊のプロフィール',
    constellationName: initialHistory[0][0],
    constellationHistory: initialHistory,
    historyPointer: 0,
    avatarType: 'ghost',
    maskId: 'ghost',
    isGhost: true,
    selectedTypeId: null,
    selectedObjectiveIds: [],
    selectedSlots: [],
    selectedValues: ['val_core'],
  };
};

export const ProfileMaskContainer: React.FC = () => {
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const [profiles, setProfiles] = useState<ProfileMask[]>(() => [
    createInitialGhost(),
    {
      id: 'p1',
      name: 'エンジニアとしての僕',
      constellationName: '緑の光速の魚座',
      constellationHistory: [['緑の光速の魚座', '白い炎の魚座', '青い雷の魚座']],
      historyPointer: 0,
      avatarType: 'user',
      maskId: 'mask_zap',
      isGhost: false,
      selectedTypeId: 'self',
      selectedObjectiveIds: ['build_work'],
      selectedSlots: ['works', 'favorites', 'values', 'skills'],
      selectedValues: ['val_core', 'val_basic', 'val_work'],
      workSetId: 'ws1',
      skillSetId: 'ss1',
    },
  ]);

  const [activeProfileId, setActiveProfileId] = useState<string>('ghost');
  const [editDraft, setEditDraft] = useState<ProfileMask | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: '', message: '' });

  // アクティブプロフィールが切り替わった際のドラフト更新
  useEffect(() => {
    const profile = profiles.find((p) => p.id === activeProfileId);
    if (profile) {
      setEditDraft({ ...profile });
      setIsDirty(false);
      mainScrollRef.current?.scrollTo({ top: 0 });
    }
  }, [activeProfileId, profiles]);

  const activeProfile = editDraft || profiles.find((p) => p.id === activeProfileId) || profiles[0];

  /**
   * ドラフトの更新
   */
  const handleUpdateDraft = (updatedFields: Partial<ProfileMask>) => {
    setEditDraft((prev) => (prev ? { ...prev, ...updatedFields } : null));
    setIsDirty(true);
  };

  /**
   * プロフィールの切り替えリクエスト（離脱ガード付き）
   */
  const requestSwitchProfile = (id: string) => {
    if (id === activeProfileId) return;
    if (isDirty) {
      setModal({
        isOpen: true,
        type: 'confirm_exit',
        targetId: id,
        message: '変更が保存されていません。破棄して移動しますか？',
      });
    } else {
      setActiveProfileId(id);
    }
  };

  /**
   * 保存処理
   */
  const handleSave = () => {
    if (!activeProfile.isGhost) {
      if (!activeProfile.selectedTypeId) {
        setModal({ isOpen: true, type: 'error', message: 'STEP 2: プロフィールのタイプを選択してください。' });
        return;
      }
      if (activeProfile.selectedObjectiveIds.length === 0) {
        setModal({ isOpen: true, type: 'error', message: 'STEP 3: プロフィールの目的を1つ以上選択してください。' });
        return;
      }
    }

    setProfiles((prev) => prev.map((p) => (p.id === activeProfile.id ? { ...activeProfile } : p)));
    setIsDirty(false);
    setModal({ isOpen: true, type: 'success', message: '仮面の保存が完了しました。' });
    setTimeout(() => {
      setModal((prev) => (prev.type === 'success' ? { ...prev, isOpen: false } : prev));
    }, 2000);
  };

  /**
   * 識別ID生成（ガチャ）
   */
  const handleNextAnonyms = () => {
    const { constellationHistory, historyPointer } = activeProfile;
    const result = getNextAnonymsHistory(constellationHistory, historyPointer, USER_BASE_CONSTELLATION);
    handleUpdateDraft(result);
  };

  const handlePrevAnonyms = () => {
    if (activeProfile.historyPointer > 0) {
      handleUpdateDraft({ historyPointer: activeProfile.historyPointer - 1 });
    }
  };

  const handleSelectAnonym = (name: string) => handleUpdateDraft({ constellationName: name });

  /**
   * 目的のトグル
   */
  const handleToggleObjective = (objId: string) => {
    // バリデーション（パートナー活の重複）
    const validation = validatePartnerObjective(objId, activeProfile.id, profiles);
    if (!validation.isValid) {
      setModal({ isOpen: true, type: 'error', message: validation.message });
      return;
    }

    const result = toggleObjectiveSlots(objId, activeProfile.selectedObjectiveIds, activeProfile.selectedSlots);
    handleUpdateDraft(result);
  };

  /**
   * スロットのトグル
   */
  const toggleSlot = (slotId: string) => {
    const result = toggleSlotAndObjectives(slotId, activeProfile.selectedSlots, activeProfile.selectedObjectiveIds);
    handleUpdateDraft(result);
  };

  /**
   * 新規プロフィールの作成
   */
  const createNewProfile = () => {
    const performCreate = () => {
      const newId = `p${Date.now()}`;
      const ghost = profiles.find((p) => p.isGhost) || createInitialGhost();
      const newProfile: ProfileMask = {
        ...ghost,
        id: newId,
        name: '新しい仮面',
        isGhost: false,
        avatarType: 'user',
        maskId: 'mask_default',
        selectedTypeId: null,
        selectedObjectiveIds: [],
        selectedSlots: [],
        selectedValues: ['val_core'],
      };
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newId);
      setIsDirty(false);
      setModal({ isOpen: false, type: '', message: '' });
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isDirty) {
      setModal({
        isOpen: true,
        type: 'confirm_create',
        message: '変更を破棄して、新規作成しますか？',
        action: performCreate,
      });
    } else {
      performCreate();
    }
  };

  // 検索フィルタリング
  const filteredProfiles = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(query) || p.constellationName.toLowerCase().includes(query)
    );
  }, [profiles, searchQuery]);

  // モーダルクローズ
  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  // 確認モーダルの「はい」
  const handleConfirm = () => {
    if (modal.type === 'confirm_exit' && modal.targetId) {
      setActiveProfileId(modal.targetId);
      setIsDirty(false);
      closeModal();
    } else if (modal.type === 'confirm_create' && modal.action) {
      modal.action();
    }
  };

  return (
    <ProfileMaskView
      profiles={profiles}
      activeProfile={activeProfile}
      activeProfileId={activeProfileId}
      filteredProfiles={filteredProfiles}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isDirty={isDirty}
      modal={modal}
      mainScrollRef={mainScrollRef}
      onUpdateDraft={handleUpdateDraft}
      onSwitchProfile={requestSwitchProfile}
      onSave={handleSave}
      onNextAnonyms={handleNextAnonyms}
      onPrevAnonyms={handlePrevAnonyms}
      onSelectAnonym={handleSelectAnonym}
      onToggleObjective={handleToggleObjective}
      onToggleSlot={toggleSlot}
      onCreateNewProfile={createNewProfile}
      onCloseModal={closeModal}
      onConfirmModal={handleConfirm}
    />
  );
};
