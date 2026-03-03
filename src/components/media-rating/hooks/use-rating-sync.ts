import { RatingKey, RatingMode, Work } from '../media-rating.types';

/**
 * Tier方式と好き方式の評価同期・変換ロジックを管理するフック
 */
export function useRatingSync() {
  /**
   * 評価モード切り替え時のデータ変換ロジック
   */
  const convertRatingOnModeChange = (
    works: readonly Work[],
    newMode: RatingMode
  ): Work[] => {
    return works.map(work => {
      let newRating: RatingKey = work.userRating;

      if (newMode === 'like') {
        // Tier(1,2,3) -> 好き(1) への変換
        if (['TIER1', 'TIER2', 'TIER3'].includes(work.userRating)) {
          newRating = 'LIKE1';
        }
      } else if (newMode === 'tier') {
        // 好き(1) -> 以前のTier への変換
        if (work.userRating === 'LIKE1') {
          newRating = work.lastTier;
        }
      }

      return { ...work, userRating: newRating };
    });
  };

  /**
   * 評価個別の変更ロジック
   */
  const updateWorkRating = (
    works: readonly Work[],
    targetId: number,
    newRating: RatingKey
  ): Work[] => {
    return works.map(work => {
      if (work.id === targetId) {
        const isTier = ['TIER1', 'TIER2', 'TIER3'].includes(newRating);
        return {
          ...work,
          userRating: newRating,
          lastTier: isTier ? (newRating as 'TIER1' | 'TIER2' | 'TIER3') : work.lastTier
        };
      }
      return work;
    });
  };

  return {
    convertRatingOnModeChange,
    updateWorkRating,
  };
}
