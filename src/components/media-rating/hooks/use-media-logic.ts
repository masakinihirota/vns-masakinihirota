import { useMemo } from 'react';
import { RATINGS } from '../media-rating.constants';
import { Category, SortConfig, Work } from '../media-rating.types';

/**
 * フィルタリング、ソート、ページネーションのビジネスロジックを管理するフック
 */
export function useMediaLogic(
  works: readonly Work[],
  sortConfig: SortConfig,
  appliedSearch: string,
  enabledCategories: readonly Category[],
) {
  const filteredAndSortedWorks = useMemo(() => {
    let result = [...works];

    // 1. カテゴリフィルタ
    result = result.filter(w => enabledCategories.includes(w.category));

    // 2. 検索フィルタ
    if (appliedSearch) {
      const lowerSearch = appliedSearch.toLowerCase();
      result = result.filter(w =>
        w.title.toLowerCase().includes(lowerSearch) ||
        w.tags.some(t => t.toLowerCase().includes(lowerSearch))
      );
    }

    // 3. ソート
    if (sortConfig.key) {
      result.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let aVal: any = a[sortConfig.key as keyof Work];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let bVal: any = b[sortConfig.key as keyof Work];

        if (sortConfig.key === 'userRating') {
          aVal = RATINGS[a.userRating]?.weight ?? 0;
          bVal = RATINGS[b.userRating]?.weight ?? 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [works, sortConfig, appliedSearch, enabledCategories]);

  return {
    filteredAndSortedWorks,
  };
}
