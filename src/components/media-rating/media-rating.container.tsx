'use client';

import { useCallback, useEffect, useState } from 'react';
import { MediaTable } from './components/media-table';
import { Pagination } from './components/pagination';
import { ProfilePanel } from './components/profile-panel';
import { SearchHeader } from './components/search-header';
import { useMediaLogic } from './hooks/use-media-logic';
import { useRatingSync } from './hooks/use-rating-sync';
import { ITEMS_PER_PAGE, PROFILES } from './media-rating.constants';
import { Category, Profile, RatingKey, RatingMode, SortConfig, Work } from './media-rating.types';

/**
 * モックデータの生成 (内部ヘルパー)
 */
const generateMockData = (count: number): Work[] => {
  const categories: Category[] = ['アニメ', '漫画', 'その他'];
  const tags = ['SF', '日常', 'ファンタジー', 'バトル', '恋愛', 'ミステリー', 'コメディ'];

  return Array.from({ length: count }, (_, i) => {
    const initialRating: RatingKey = i % 10 === 0 ? 'TIER1' : (i % 7 === 0 ? 'LIKE1' : (i % 5 === 0 ? 'NORMAL_OR_NOT' : 'UNRATED'));

    return {
      id: i + 1,
      title: `作品タイトル ${i + 1} ${i % 3 === 0 ? '非常に長いタイトルで2行までの表示テストを行っています（公式データ）' : ''}`,
      category: categories[i % 3],
      tags: [tags[i % tags.length], tags[(i + 2) % tags.length]],
      externalUrl: 'https://example.com/official',
      affiliateUrl: 'https://example.com/ad-link',
      isOfficial: i % 3 === 0,
      userRating: initialRating,
      lastTier: ['TIER1', 'TIER2', 'TIER3'].includes(initialRating) ? (initialRating as 'TIER1' | 'TIER2' | 'TIER3') : 'TIER1'
    };
  });
};

export function MediaRatingContainer() {
  // --- States ---
  const [works, setWorks] = useState<readonly Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [adVisible, setAdVisible] = useState(true);
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'title', direction: 'asc' });
  const [ratingMode, setRatingMode] = useState<RatingMode>('tier');

  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [enabledCategories, setEnabledCategories] = useState<readonly Category[]>(['アニメ', '漫画']);

  const [activeProfile, setActiveProfile] = useState<Profile>(PROFILES[0]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- Logic Hooks ---
  const { filteredAndSortedWorks } = useMediaLogic(works, sortConfig, appliedSearch, enabledCategories);
  const { convertRatingOnModeChange, updateWorkRating } = useRatingSync();

  // --- Initial Layout ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setWorks(generateMockData(250));
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Handlers ---
  const handleRatingModeToggle = useCallback((newMode: RatingMode) => {
    if (newMode === ratingMode) return;
    setWorks(prev => convertRatingOnModeChange(prev, newMode));
    setRatingMode(newMode);
  }, [ratingMode, convertRatingOnModeChange]);

  const handleRatingChange = useCallback((newRating: RatingKey) => {
    if (selectedWorkId === null) return;
    setWorks(prev => updateWorkRating(prev, selectedWorkId, newRating));
  }, [selectedWorkId, updateWorkRating]);

  const toggleCategory = useCallback((cat: Category) => {
    setEnabledCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  }, []);

  const requestSort = useCallback((key: keyof Work | 'userRating') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSearchExecute = () => {
    setAppliedSearch(searchInput);
    setCurrentPage(1);
  };

  const currentItems = filteredAndSortedWorks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAndSortedWorks.length / ITEMS_PER_PAGE);
  const selectedWork = works.find(w => w.id === selectedWorkId) || null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <ProfilePanel
        activeProfile={activeProfile}
        onProfileChange={(p) => { setActiveProfile(p); setIsProfileOpen(false); }}
        isProfileOpen={isProfileOpen}
        onProfileToggle={() => setIsProfileOpen(!isProfileOpen)}
        ratingMode={ratingMode}
        onRatingModeToggle={handleRatingModeToggle}
        selectedWork={selectedWork}
        onRatingChange={handleRatingChange}
      />

      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <SearchHeader
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          onSearchExecute={handleSearchExecute}
          onSearchClear={() => { setSearchInput(''); setAppliedSearch(''); setCurrentPage(1); }}
          adVisible={adVisible}
          onAdToggle={() => setAdVisible(!adVisible)}
          enabledCategories={enabledCategories}
          onCategoryToggle={toggleCategory}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemCount={filteredAndSortedWorks.length}
            isSearchActive={!!appliedSearch}
          />

          <MediaTable
            works={currentItems}
            isLoading={isLoading}
            selectedWorkId={selectedWorkId}
            onWorkSelect={setSelectedWorkId}
            adVisible={adVisible}
            sortConfig={sortConfig}
            onSortRequest={requestSort}
          />

          <div className="bg-white border-t border-slate-100 px-8 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemCount={filteredAndSortedWorks.length}
              isSearchActive={!!appliedSearch}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
