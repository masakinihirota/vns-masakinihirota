import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Layers,
  Search,
  Settings,
  ShoppingCart,
  Tv,
  User,
  Users,
  X,
} from "lucide-react";

import {
  Profile,
  Rating,
  RatingMode,
  RATINGS,
  SortConfig,
  SortKey,
  Work,
} from "./work-list.logic";

interface WorkListProperties {
  readonly works: Work[];
  readonly filteredAndSortedWorks: Work[];
  readonly currentItems: Work[];
  readonly totalPages: number;
  readonly selectedWork: Work | undefined;
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly adVisible: boolean;
  readonly selectedWorkId: number | string | null;
  readonly sortConfig: SortConfig;
  readonly ratingMode: RatingMode;
  readonly searchInput: string;
  readonly appliedSearch: string;
  readonly enabledCategories: string[];
  readonly activeProfile: Profile;
  readonly isProfileAccordionOpen: boolean;
  readonly profiles: Profile[];

  readonly onAdVisibleChange: (visible: boolean) => void;
  readonly onSelectedWorkIdChange: (id: number | string | null) => void;
  readonly onPageChange: (newPage: number) => void;
  readonly onSearchInputChange: (value: string) => void;
  readonly onActiveProfileChange: (profile: Profile) => void;
  readonly onIsProfileAccordionOpenChange: (open: boolean) => void;

  readonly onRatingModeToggle: (mode: RatingMode) => void;
  readonly onCategoryToggle: (category: string) => void;
  readonly onSortRequest: (key: SortKey) => void;
  readonly onRatingChange: (rating: Rating) => void;
  readonly onSearchExecute: () => void;
  readonly onSearchClear: () => void;
}

/**
 *
 * @param root0
 * @param root0.filteredAndSortedWorks
 * @param root0.currentItems
 * @param root0.totalPages
 * @param root0.selectedWork
 * @param root0.isLoading
 * @param root0.currentPage
 * @param root0.adVisible
 * @param root0.selectedWorkId
 * @param root0.sortConfig
 * @param root0.ratingMode
 * @param root0.searchInput
 * @param root0.appliedSearch
 * @param root0.enabledCategories
 * @param root0.activeProfile
 * @param root0.isProfileAccordionOpen
 * @param root0.profiles
 * @param root0.onAdVisibleChange
 * @param root0.onSelectedWorkIdChange
 * @param root0.onPageChange
 * @param root0.onSearchInputChange
 * @param root0.onActiveProfileChange
 * @param root0.onIsProfileAccordionOpenChange
 * @param root0.onRatingModeToggle
 * @param root0.onCategoryToggle
 * @param root0.onSortRequest
 * @param root0.onRatingChange
 * @param root0.onSearchExecute
 * @param root0.onSearchClear
 */
export function WorkList({
  filteredAndSortedWorks,
  currentItems,
  totalPages,
  selectedWork,
  isLoading,
  currentPage,
  adVisible,
  selectedWorkId,
  sortConfig,
  ratingMode,
  searchInput,
  appliedSearch,
  enabledCategories,
  activeProfile,
  isProfileAccordionOpen,
  profiles,

  onAdVisibleChange,
  onSelectedWorkIdChange,
  onPageChange,
  onSearchInputChange,
  onActiveProfileChange,
  onIsProfileAccordionOpenChange,

  onRatingModeToggle,
  onCategoryToggle,
  onSortRequest,
  onRatingChange,
  onSearchExecute,
  onSearchClear,
}: WorkListProperties) {
  // ソートアイコンコンポーネント
  // render時のコンポーネント定義を防止するため、コンポーネント発の外で定義
  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey)
      return (
        <ArrowUp size={14} className="opacity-20 group-hover:opacity-50" />
      );
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} className="text-[var(--accent-main)]" />
    ) : (
      <ArrowDown size={14} className="text-[var(--accent-main)]" />
    );
  };

  // スケルトンスクリーン行
  const renderSkeletonRow = (index: number) => (
    <tr key={index} className="border-b border-[var(--card-border-glass)] animate-pulse">
      <td className="p-3">
        <div className="h-7 bg-[var(--input-bg)] rounded w-full mx-auto"></div>
      </td>
      <td className="p-3">
        <div className="h-7 bg-[var(--input-bg)] rounded w-full"></div>
      </td>
      <td className="p-3 hidden lg:table-cell">
        <div className="h-7 bg-[var(--input-bg)] rounded w-full"></div>
      </td>
      <td className="p-3 text-center">
        <div className="h-7 bg-[var(--input-bg)] rounded w-8 mx-auto"></div>
      </td>
      {adVisible && (
        <td className="p-3 text-center">
          <div className="h-7 bg-[var(--input-bg)] rounded w-8 mx-auto"></div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[var(--text-main)] transition-colors duration-300">
      {/* 左サイドバー: プロフィール & 評価パネル */}
      <aside className="w-[380px] glass-deep border-r border-[var(--card-border-glass)] shadow-2xl flex flex-col z-30 shrink-0">
        {/* プロフィール選択アコーディオン */}
        <div className="border-b border-[var(--card-border-glass)] bg-[var(--header-bg)] relative">
          <button
            onClick={() =>
              onIsProfileAccordionOpenChange(!isProfileAccordionOpen)
            }
            className="w-full p-6 flex items-center justify-between hover:bg-[var(--card-glass)] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 ${activeProfile.color} rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-white/20 transition-transform group-hover:scale-105`}
              >
                <User size={28} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-widest block">
                  Active Profile
                </span>
                <h2 className="font-bold text-xl text-[var(--text-main)] truncate max-w-[180px]">
                  {activeProfile.name}
                </h2>
              </div>
            </div>
            {isProfileAccordionOpen ? (
              <ChevronUp className="text-[var(--text-sub)]" />
            ) : (
              <ChevronDown className="text-[var(--text-sub)] group-hover:text-[var(--accent-main)]" />
            )}
          </button>

          {/* アコーディオンの中身 */}
          {isProfileAccordionOpen && (
            <div className="absolute top-full left-0 w-full glass-deep border-b border-[var(--card-border-glass)] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 backdrop-blur-3xl">
              <div className="p-2 border-t border-[var(--card-border-glass)] bg-[var(--bg)]/90">
                <p className="px-4 py-2 text-xs font-bold text-[var(--text-sub)] uppercase flex items-center gap-2">
                  <Users size={14} /> Switch User Profile
                </p>
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      onActiveProfileChange(profile);
                      onIsProfileAccordionOpenChange(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${activeProfile.id === profile.id
                      ? "bg-[var(--accent-bg)] text-[var(--accent-main)] ring-1 ring-inset ring-[var(--accent-main)]/30 font-bold"
                      : "hover:bg-[var(--card-glass)] text-[var(--text-sub)]"
                      }`}
                  >
                    <div
                      className={`w-8 h-8 ${profile.color} rounded-full flex items-center justify-center text-white text-xs`}
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[16px]">{profile.name}</span>
                    {activeProfile.id === profile.id && (
                      <CheckCircle2 size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="glass p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2 text-[var(--text-main)]">
                <Settings size={20} /> 評価設定
              </h3>
              {/* 評価方式切り替えボタン */}
              <div className="flex bg-[var(--input-bg)] p-1 rounded-lg border border-[var(--card-border-glass)]">
                <button
                  onClick={() => onRatingModeToggle("tier")}
                  className={`p-1.5 rounded-md transition-all ${ratingMode === "tier" ? "bg-[var(--card-glass)] shadow text-[var(--accent-main)]" : "text-[var(--text-sub)]"}`}
                  title="Tier方式"
                  aria-label="Tier方式に切り替え"
                >
                  <Layers size={18} />
                </button>
                <button
                  onClick={() => onRatingModeToggle("like")}
                  className={`p-1.5 rounded-md transition-all ${ratingMode === "like" ? "bg-[var(--card-glass)] shadow text-pink-500" : "text-[var(--text-sub)]"}`}
                  title="好き方式"
                  aria-label="好き方式に切り替え"
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>

            {selectedWork ? (
              <div className="space-y-4">
                <div className="p-4 bg-[var(--card-glass)] rounded-xl border border-[var(--card-border-glass)] shadow-sm">
                  <span className="text-xs text-[var(--accent-main)] font-bold uppercase tracking-wider block mb-1">
                    Editing Work
                  </span>
                  <p className="font-bold text-[var(--text-main)] leading-tight">
                    {selectedWork.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-sub)]">
                    Current:{" "}
                    <span className="font-bold text-[var(--text-main)]">
                      {RATINGS[selectedWork.userRating]?.label || "未設定"}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  {ratingMode === "tier" ? (
                    <div className="grid grid-cols-3 gap-2">
                      {(["TIER1", "TIER2", "TIER3"] as Rating[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => onRatingChange(r)}
                          className={`py-3 rounded-lg font-bold border transition-all ${selectedWork.userRating === r
                            ? "bg-[var(--accent-main)] text-white border-[var(--accent-main)] shadow-lg shadow-[var(--accent-main)]/30 transform scale-[1.02]"
                            : "bg-[var(--input-bg)] hover:bg-[var(--accent-bg)] text-[var(--text-main)] border-transparent"
                            }`}
                        >
                          {RATINGS[r].label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => onRatingChange("LIKE1")}
                      className={`w-full py-4 rounded-lg font-bold border transition-all flex items-center justify-center gap-2 ${selectedWork.userRating === "LIKE1"
                        ? "bg-pink-500 text-white border-pink-600 shadow-lg shadow-pink-500/30 transform scale-[1.02]"
                        : "bg-[var(--input-bg)] hover:bg-pink-500/10 text-pink-500 border-transparent"
                        }`}
                    >
                      <Heart
                        size={20}
                        fill={
                          selectedWork.userRating === "LIKE1"
                            ? "currentColor"
                            : "none"
                        }
                      />
                      好き (1)
                    </button>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--card-border-glass)]">
                  <p className="text-xs font-bold text-[var(--text-sub)] uppercase mb-2">
                    Basic Status
                  </p>
                  {(
                    ["NORMAL_OR_NOT", "UNRATED", "NO_INTEREST"] as Rating[]
                  ).map((r) => (
                    <button
                      key={r}
                      onClick={() => onRatingChange(r)}
                      className={`w-full py-2.5 text-left px-4 rounded-lg border flex items-center justify-between transition-all ${selectedWork.userRating === r
                        ? "bg-slate-800 text-white border-slate-900 shadow-lg"
                        : "bg-[var(--input-bg)] hover:bg-[var(--card-glass)] text-[var(--text-sub)] border-transparent"
                        }`}
                    >
                      <span className="font-medium">{RATINGS[r].label}</span>
                      {selectedWork.userRating === r && (
                        <CheckCircle2 size={18} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--card-border-glass)] rounded-xl bg-[var(--input-bg)]/30">
                <p className="text-[var(--text-sub)] leading-relaxed italic">
                  作品を選択して評価を
                  <br />
                  入力してください
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-[var(--header-bg)] text-[var(--text-sub)] text-xs text-center font-mono uppercase tracking-tighter border-t border-[var(--card-border-glass)]">
          VNS:{activeProfile.id}:CORE
        </div>
      </aside>

      {/* メイン: リスト表示層 */}
      <main className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] to-transparent opacity-50 pointer-events-none" />

        {/* 固定ヘッダー */}
        <header className="px-6 py-4 border-b border-[var(--card-border-glass)] flex flex-col gap-4 bg-[var(--header-bg)] backdrop-filter backdrop-blur-xl z-20 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="font-bold text-2xl tracking-tight text-[var(--text-main)] shrink-0 drop-shadow-sm">
              登録済みリスト
            </h1>

            {/* 検索バー */}
            <div className="flex-1 flex items-center max-w-xl">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="作品名・タグで検索 (Enterで実行)"
                  value={searchInput}
                  onChange={(e) => onSearchInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearchExecute()}
                  className="w-full bg-[var(--input-bg)] border-2 border-transparent focus:border-[var(--accent-main)] focus:bg-[var(--card-glass)] rounded-xl pl-10 pr-10 py-2.5 outline-none transition-all text-[18px] text-[var(--text-main)] placeholder-[var(--text-sub)]/50 shadow-inner"
                  aria-label="作品名・タグで検索"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] group-focus-within:text-[var(--accent-main)]"
                  size={20}
                />
                {searchInput && (
                  <button
                    onClick={onSearchClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)] hover:text-[var(--text-main)]"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <button
                onClick={onSearchExecute}
                className="ml-2 bg-[var(--accent-main)] hover:bg-[var(--accent-main)]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-[var(--accent-main)]/20 whitespace-nowrap active:scale-95"
              >
                検索
              </button>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => onAdVisibleChange(!adVisible)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all font-bold ${adVisible
                  ? "border-orange-500/30 text-orange-600 bg-orange-500/10 shadow-sm"
                  : "border-[var(--card-border-glass)] text-[var(--text-sub)] bg-[var(--input-bg)] hover:bg-[var(--card-glass)]"
                  }`}
              >
                {adVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                <span className="whitespace-nowrap">
                  {adVisible ? "広告 ON" : "広告 OFF"}
                </span>
              </button>
            </div>
          </div>

          {/* カテゴリトグルボタン */}
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm font-bold text-[var(--text-sub)] uppercase tracking-widest">
              Category Filter:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onCategoryToggle("アニメ")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl border font-bold transition-all ${enabledCategories.includes("アニメ")
                  ? "border-purple-500/30 bg-purple-500/10 text-purple-600 shadow-inner ring-1 ring-purple-500/20"
                  : "border-[var(--card-border-glass)] bg-[var(--card-glass)] text-[var(--text-sub)] hover:bg-[var(--input-bg)]"
                  }`}
              >
                <Tv size={18} /> アニメ
              </button>
              <button
                onClick={() => onCategoryToggle("漫画")}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl border font-bold transition-all ${enabledCategories.includes("漫画")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-inner ring-1 ring-emerald-500/20"
                  : "border-[var(--card-border-glass)] bg-[var(--card-glass)] text-[var(--text-sub)] hover:bg-[var(--input-bg)]"
                  }`}
              >
                <BookOpen size={18} /> 漫画
              </button>
            </div>
          </div>
        </header>

        {/* テーブルエリア */}
        <div className="flex-1 overflow-auto p-4 md:p-6 z-10 custom-scrollbar">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemCount={filteredAndSortedWorks.length}
            isSearchActive={!!appliedSearch}
          />

          <div className="rounded-2xl overflow-hidden glass shadow-xl border border-[var(--card-border-glass)]">
            <table className="w-full border-collapse table-fixed min-w-[600px] lg:min-w-[900px]">
              <thead className="sticky top-0 bg-[var(--header-bg)] z-10 backdrop-blur-md text-[var(--text-main)]">
                <tr className="text-left select-none border-b border-[var(--card-border-glass)]">
                  {/* 1. カテゴリ (幅100px) */}
                  <th
                    onClick={() => onSortRequest("category")}
                    className="p-4 w-[110px] cursor-pointer hover:bg-[var(--accent-bg)] transition-colors group"
                  >
                    <div className="flex items-center justify-center gap-1 font-bold text-sm">
                      種別 {renderSortIcon("category")}
                    </div>
                  </th>
                  {/* 2. 作品タイトル (柔軟な幅) */}
                  <th
                    onClick={() => onSortRequest("title")}
                    className="p-4 w-auto min-w-[200px] cursor-pointer hover:bg-[var(--accent-bg)] transition-colors group"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      作品タイトル {renderSortIcon("title")}
                    </div>
                  </th>
                  {/* 3. タグ / 属性 (狭い時は非表示) */}
                  <th className="p-4 w-[250px] hidden lg:table-cell font-bold text-sm">
                    タグ / 属性
                  </th>
                  {/* 4. 公式 */}
                  <th className="p-4 w-[80px] text-center font-bold text-sm">
                    公式
                  </th>
                  {/* 5. 広告 */}
                  {adVisible && (
                    <th className="p-4 w-[80px] text-center font-bold text-sm">
                      広告
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-transparent/50 divide-y divide-[var(--card-border-glass)]">
                {isLoading ? (
                  Array.from({ length: 50 }).map((_, index) => renderSkeletonRow(index))
                ) : (filteredAndSortedWorks.length > 0 ? (
                  currentItems.map((work) => (
                    <tr
                      key={work.id}
                      onClick={() => onSelectedWorkIdChange(work.id)}
                      className={`hover:bg-[var(--accent-bg)] cursor-pointer transition-colors ${selectedWorkId === work.id
                        ? "bg-[var(--accent-bg)] shadow-[inset_3px_0_0_var(--accent-main)]"
                        : ""
                        }`}
                    >
                      {/* カテゴリ */}
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full border text-xs font-bold whitespace-nowrap ${work.category === "アニメ"
                            ? "border-purple-500/20 bg-purple-500/10 text-purple-600"
                            : (work.category === "漫画"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                              : "border-slate-500/20 bg-slate-500/10 text-slate-600")
                            }`}
                        >
                          {work.category}
                        </span>
                      </td>
                      {/* 作品タイトル (2行まで許容) */}
                      <td className="p-3 font-medium align-middle">
                        <span
                          className={`line-clamp-2 leading-tight ${work.isOfficial ? "text-[var(--text-main)]" : "text-[var(--accent-main)]"}`}
                        >
                          {work.title}
                        </span>
                      </td>
                      {/* タグ / 属性 (狭い時は非表示) */}
                      <td className="p-3 truncate text-sm text-[var(--text-sub)] hidden lg:table-cell">
                        {work.tags.map((t) => `#${t}`).join(" ")}
                      </td>
                      {/* 公式リンク */}
                      <td className="p-3 text-center">
                        {work.externalUrl && (
                          <a
                            href={work.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--text-sub)] hover:text-[var(--accent-main)] inline-block p-2 hover:bg-[var(--card-glass)] rounded-full transition-all hover:scale-110"
                            aria-label={`${work.title}の公式サイトを開く`}
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </td>
                      {/* 広告リンク */}
                      {adVisible && (
                        <td className="p-3 text-center">
                          {work.affiliateUrl && (
                            <a
                              href={work.affiliateUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-orange-400 hover:text-orange-600 inline-block p-2 hover:bg-orange-500/10 rounded-full transition-all hover:scale-110"
                              aria-label={`${work.title}のアフィリエイトリンクを開く`}
                            >
                              <ShoppingCart size={20} />
                            </a>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={adVisible ? 5 : 4}
                      className="p-20 text-center text-[var(--text-sub)] italic"
                    >
                      一致する作品が見つかりませんでした
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pb-20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              itemCount={undefined}
              isSearchActive={undefined}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * ページネーションコンポーネント (Glassmorphism compatible)
 */
interface PaginationProperties {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemCount?: number;
  isSearchActive?: boolean;
}

/**
 *
 * @param root0
 * @param root0.currentPage
 * @param root0.totalPages
 * @param root0.onPageChange
 * @param root0.itemCount
 * @param root0.isSearchActive
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemCount,
  isSearchActive,
}: PaginationProperties) {
  if (totalPages <= 0 && !isSearchActive) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 glass rounded-xl mb-4 text-[var(--text-main)]">
      <div className="text-sm font-medium opacity-80">
        {itemCount !== undefined && (
          <>
            {isSearchActive ? "検索結果: " : "合計 "}
            <span className="font-bold text-[var(--text-main)] text-[18px]">
              {itemCount}
            </span>{" "}
            件 —
          </>
        )}
        ページ {currentPage} / {Math.max(1, totalPages)}
      </div>

      {totalPages > 0 && (
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="p-2 border border-[var(--card-border-glass)] rounded-lg hover:bg-[var(--card-glass)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="前のページへ"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              let pageNumber = index + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNumber = currentPage - 2 + index;
              }
              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-10 h-10 border rounded-lg font-bold transition-all text-[16px] ${currentPage === pageNumber
                    ? "bg-[var(--accent-main)] text-white border-[var(--accent-main)] shadow-lg scale-105"
                    : "hover:bg-[var(--card-glass)] border-[var(--card-border-glass)] text-[var(--text-sub)]"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="p-2 border border-[var(--card-border-glass)] rounded-lg hover:bg-[var(--card-glass)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="次のページへ"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
