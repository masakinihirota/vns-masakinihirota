import { describe, expect, it } from 'vitest';
import { USER_BASE_CONSTELLATION } from './profile-mask.constants';
import {
  generateCandidateSet,
  getNextAnonymsHistory,
  toggleObjectiveSlots,
  validatePartnerObjective,
} from './profile-mask.logic';
import { ProfileMask } from './profile-mask.types';

describe('ProfileMask Logic', () => {
  describe('generateCandidateSet', () => {
    it('3つの異なる候補名を生成すること', () => {
      const result = generateCandidateSet(USER_BASE_CONSTELLATION);
      expect(result).toHaveLength(3);
      expect(new Set(result).size).toBe(3);
      result.forEach(name => {
        expect(name).toContain(USER_BASE_CONSTELLATION);
      });
    });

    it('前回のセットと重複しないこと', () => {
      const previousSet = ['赤いマテリアルの魚座', '青い光の魚座', '白い闇の魚座'];
      const result = generateCandidateSet(USER_BASE_CONSTELLATION, previousSet);
      result.forEach(name => {
        expect(previousSet).not.toContain(name);
      });
    });
  });

  describe('getNextAnonymsHistory', () => {
    it('履歴の途中にいる場合、ポインタを1つ進めること', () => {
      const history = [['A1', 'A2', 'A3'], ['B1', 'B2', 'B3']];
      const result = getNextAnonymsHistory(history, 0, USER_BASE_CONSTELLATION);
      expect(result.historyPointer).toBe(1);
      expect(result.constellationHistory).toEqual(history);
    });

    it('履歴の末尾にいる場合、新しいセットを追加すること', () => {
      const history = [['A1', 'A2', 'A3']];
      const result = getNextAnonymsHistory(history, 0, USER_BASE_CONSTELLATION);
      expect(result.constellationHistory).toHaveLength(2);
      expect(result.historyPointer).toBe(1);
    });

    it('履歴が10個を超えた場合、先頭を削除すること', () => {
      const history = Array(10).fill(['X', 'Y', 'Z']);
      const result = getNextAnonymsHistory(history, 9, USER_BASE_CONSTELLATION);
      expect(result.constellationHistory).toHaveLength(10);
      expect(result.historyPointer).toBe(9);
    });
  });

  describe('toggleObjectiveSlots', () => {
    it('目的を追加した際、対応するスロットが追加されること', () => {
      const currentObjectiveIds: string[] = [];
      const currentSlots: string[] = [];
      const objectiveId = 'business_card'; // slots: ['works', 'skills']

      const result = toggleObjectiveSlots(objectiveId, currentObjectiveIds, currentSlots);

      expect(result.selectedObjectiveIds).toContain('business_card');
      expect(result.selectedSlots).toContain('works');
      expect(result.selectedSlots).toContain('skills');
    });

    it('目的を削除した際、スロットは維持されること（仕様書に基づき、スロット削除は個別操作）', () => {
      // 補足: 仕様書3.2では「スロットをオフにした際、そのスロットに依存していた目的も非選択になる」とあるが、
      // 逆に「目的を削除した際にスロットを消す」とは明記されていない。
      // 実装のhandleToggleObjective(245行目)では、削除時はobjectiveIdsのみ更新している。
      const currentObjectiveIds = ['business_card'];
      const currentSlots = ['works', 'skills'];
      const objectiveId = 'business_card';

      const result = toggleObjectiveSlots(objectiveId, currentObjectiveIds, currentSlots);

      expect(result.selectedObjectiveIds).not.toContain('business_card');
      expect(result.selectedSlots).toEqual(currentSlots);
    });
  });

  describe('validatePartnerObjective', () => {
    const mockProfiles: Partial<ProfileMask>[] = [
      { id: 'p1', selectedObjectiveIds: ['partner'], name: '既存プロフィール' }
    ];

    it('他のプロフィールがパートナー活を使用している場合、エラーを返すこと', () => {
      const activeProfileId = 'p2';
      const result = validatePartnerObjective('partner', activeProfileId, mockProfiles as ProfileMask[]);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('既存プロフィール');
    });

    it('自分自身が使用している場合は有効であること', () => {
      const activeProfileId = 'p1';
      const result = validatePartnerObjective('partner', activeProfileId, mockProfiles as ProfileMask[]);
      expect(result.isValid).toBe(true);
    });

    it('他の目的の場合は常に有効であること', () => {
      const result = validatePartnerObjective('business_card', 'p2', mockProfiles as ProfileMask[]);
      expect(result.isValid).toBe(true);
    });
  });
});
