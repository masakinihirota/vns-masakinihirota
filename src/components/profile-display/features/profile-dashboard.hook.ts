import { useCallback, useEffect, useMemo, useState } from 'react';
import { INITIAL_DATA } from './profile-dashboard.constants';
import {
  DashboardData,
  RATING_ORDER,
  RATING_TYPES,
  RatingType,
  SectionVisibility,
  SortConfig
} from './profile-dashboard.types';

/**
 * プロフィールダッシュボードのビジネスロジックを管理するカスタムフック
 */
export const useProfileDashboard = () => {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLikeMode, setIsLikeMode] = useState(false);
  const [filter, setFilter] = useState({ Manga: true, Anime: true });

  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    works: true,
    favorites: true,
    values: true,
    skills: true
  });

  const [worksSort, setWorksSort] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [favsSort, setFavsSort] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [pendingDelete, setPendingDelete] = useState<{ section: keyof DashboardData; id: number; title: string } | null>(null);

  // ダークモードの適用
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  /**
   * 評価の更新
   */
  const handleRatingChange = useCallback((section: keyof DashboardData, id: number, newRating: RatingType | 'Like') => {
    let finalRating: RatingType;

    if (newRating === 'Like') {
      finalRating = RATING_TYPES.TIER1;
    } else {
      finalRating = newRating;
    }

    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map(item =>
        item.id === id ? { ...item, rating: finalRating } : item
      )
    }));
  }, []);

  /**
   * セルの更新
   */
  const updateCell = useCallback((section: keyof DashboardData, id: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  /**
   * データのソート処理
   */
  const getSortedData = useCallback((list: any[], config: SortConfig) => {
    if (!config.key) return list;

    return [...list].sort((a, b) => {
      let valA = a[config.key!];
      let valB = b[config.key!];

      if (config.key === 'rating') {
        valA = RATING_ORDER[valA as RatingType] ?? 99;
        valB = RATING_ORDER[valB as RatingType] ?? 99;
      }

      if (valA < valB) return config.direction === 'asc' ? -1 : 1;
      if (valA > valB) return config.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  /**
   * ソートヘッダーのクリックハンドラ
   */
  const handleSort = useCallback((section: 'works' | 'favorites', key: string) => {
    const setter = section === 'works' ? setWorksSort : setFavsSort;
    const current = section === 'works' ? worksSort : favsSort;

    const direction = (current.key === key && current.direction === 'asc') ? 'desc' : 'asc';
    setter({ key, direction });
  }, [worksSort, favsSort]);

  /**
   * ソート・フィルタリング済みのデータ
   */
  const sortedWorks = useMemo(() => getSortedData([...data.works], worksSort), [data.works, worksSort, getSortedData]);

  const filteredAndSortedFavs = useMemo(() => {
    const filtered = data.favorites.filter(item => filter[item.subCategory]);
    return getSortedData(filtered, favsSort);
  }, [data.favorites, filter, favsSort, getSortedData]);

  /**
   * 項目追加
   */
  const handleAdd = useCallback((section: keyof DashboardData) => {
    const id = Date.now();
    let newItem: any = { id };

    switch (section) {
      case 'works':
        newItem = { ...newItem, title: "新規プロジェクト", category: "カテゴリ", url: "https://", rating: RATING_TYPES.UNRATED };
        break;
      case 'favorites':
        newItem = { ...newItem, title: "新規作品", subCategory: filter.Manga ? "Manga" : "Anime", genre: "ジャンル", rating: RATING_TYPES.UNRATED };
        break;
      case 'values':
        newItem = { ...newItem, key: "新規の価値観", description: "価値観の詳細を入力してください", rating: RATING_TYPES.UNRATED };
        break;
      case 'skills':
        newItem = { ...newItem, name: "新しいスキル", level: "Lvl 1", category: "分類" };
        break;
    }

    setData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), newItem]
    }));
  }, [filter]);

  /**
   * 削除のトリガー
   */
  const triggerDelete = useCallback((section: keyof DashboardData, id: number, title: string) => {
    setPendingDelete({ section, id, title });
  }, []);

  /**
   * 削除の確定
   */
  const confirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    const { section, id } = pendingDelete;
    setData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter(item => item.id !== id)
    }));
    setPendingDelete(null);
  }, [pendingDelete]);

  /**
   * セクションの表示切り替え
   */
  const toggleSection = useCallback((section: keyof SectionVisibility) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  return {
    data,
    isDarkMode,
    setIsDarkMode,
    isLikeMode,
    setIsLikeMode,
    filter,
    setFilter,
    visibleSections,
    toggleSection,
    worksSort,
    favsSort,
    handleSort,
    sortedWorks,
    filteredAndSortedFavs,
    handleAdd,
    updateCell,
    handleRatingChange,
    triggerDelete,
    confirmDelete,
    pendingDelete,
    setPendingDelete
  };
};
