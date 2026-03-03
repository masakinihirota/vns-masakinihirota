import { describe, expect, it } from 'vitest';
import {
  calculateSyncLevel,
  generateComparisonData,
  Profile
} from './work-profile-comparison.logic';

describe('work-profile-comparison.logic', () => {
  const mockMe: Profile = {
    id: 'me',
    name: 'Me',
    role: 'Role',
    values: [],
    ratings: {
      'WorkA': 'T1',
      'WorkB': 'T2',
    },
  };

  const mockTarget: Profile = {
    id: 'target',
    name: 'Target',
    role: 'Role',
    values: [],
    ratings: {
      'WorkA': 'T1', // Match!
      'WorkC': 'T1',
    },
  };

  describe('calculateSyncLevel', () => {
    it('ターゲットがいない場合はnullを返すこと', () => {
      expect(calculateSyncLevel(mockMe, null)).toBeNull();
    });

    it('基礎点60%に、マッチ1件につき15%加算されること', () => {
      // WorkAがT1で一致 -> 60 + 15 = 75
      expect(calculateSyncLevel(mockMe, mockTarget)).toBe(75);
    });

    it('最大99%に制限されること', () => {
      const perfectMatch: Profile = {
        ...mockMe,
        ratings: {
          'W1': 'T1', 'W2': 'T1', 'W3': 'T1',
          'W4': 'T1', 'W5': 'T1', 'W6': 'T1',
        }
      };
      // 60 + 15*6 = 150 -> 99
      expect(calculateSyncLevel(perfectMatch, perfectMatch)).toBe(99);
    });
  });

  describe('generateComparisonData', () => {
    const defaultFilters = {
      tier: { T1: true, T2: true, T3: true, NORMAL: true, UNRATED: true, INTERESTLESS: true },
      category: { MANGA: true, MOVIE: true, OTHER: true },
      temporal: { LIFE: true, PRESENT: true, FUTURE: true },
    };

    const defaultSort = { key: 'heat' as const, direction: 'desc' as const };

    it('正しくデータを生成し、フィルタリングできること', () => {
      const data = generateComparisonData(mockMe, mockTarget, defaultFilters, defaultSort);
      // WorkA, WorkB, WorkC
      expect(data.length).toBe(3);
      expect(data.find(d => d.title === 'WorkA')?.myTier).toBe('T1');
      expect(data.find(d => d.title === 'WorkA')?.theirTier).toBe('T1');
    });

    it('ティアフィルタが正しく動作すること', () => {
      const filters = {
        ...defaultFilters,
        tier: { ...defaultFilters.tier, T2: false },
      };
      const data = generateComparisonData(mockMe, null, filters, defaultSort);
      // WorkB (T2) が除外されるはず
      expect(data.find(d => d.title === 'WorkB')).toBeUndefined();
    });
  });
});
