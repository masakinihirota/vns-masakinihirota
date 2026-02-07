import { WorkList } from "./work-list";
import { PROFILES, useWorkListLogic } from "./work-list.logic";

export function WorkListContainer() {
  const logic = useWorkListLogic();

  return (
    <WorkList
      // データ
      works={logic.works}
      filteredAndSortedWorks={logic.filteredAndSortedWorks}
      currentItems={logic.currentItems}
      totalPages={logic.totalPages}
      selectedWork={logic.selectedWork}
      isLoading={logic.isLoading}
      currentPage={logic.currentPage}
      adVisible={logic.adVisible}
      selectedWorkId={logic.selectedWorkId}
      sortConfig={logic.sortConfig}
      ratingMode={logic.ratingMode}
      searchInput={logic.searchInput}
      appliedSearch={logic.appliedSearch}
      enabledCategories={logic.enabledCategories}
      activeProfile={logic.activeProfile}
      isProfileAccordionOpen={logic.isProfileAccordionOpen}
      profiles={PROFILES}
      // アクション
      onAdVisibleChange={logic.setAdVisible}
      onSelectedWorkIdChange={logic.setSelectedWorkId}
      onPageChange={logic.setCurrentPage}
      onSearchInputChange={logic.setSearchInput}
      onActiveProfileChange={logic.setActiveProfile}
      onIsProfileAccordionOpenChange={logic.setIsProfileAccordionOpen}
      // イベントハンドラ
      onRatingModeToggle={logic.handleRatingModeToggle}
      onCategoryToggle={logic.toggleCategory}
      onSortRequest={logic.requestSort}
      onRatingChange={logic.handleRatingChange}
      onSearchExecute={logic.handleSearchExecute}
      onSearchClear={logic.handleSearchClear}
    />
  );
}
