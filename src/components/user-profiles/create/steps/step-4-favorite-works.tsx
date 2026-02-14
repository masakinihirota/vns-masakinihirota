import {
  CheckCircle2,
  Heart,
  HelpCircle,
  Plus,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";
import React from "react";
import { ERAS, WORK_CATEGORIES } from "../user-profile-creation.constants";
import { MasterWork, Period, UserProfile } from "../user-profile-creation.types";

interface Step4FavoriteWorksProps {
  formData: UserProfile;
  activePeriod: Period;
  setActivePeriod: (period: Period) => void;
  ratingType: "LIKE" | "TIER";
  setRatingType: (type: "LIKE" | "TIER") => void;
  setShowRatingHelp: (show: boolean) => void;
  toggleBestWork: (id: number, period: Period) => void;
  setWorkTier: (
    id: number,
    period: Period,
    tier: 1 | 2 | 3 | "normal" | null
  ) => void;
  removeFavWork: (id: number, period: Period) => void;
  handleRegisterNewWork: () => void;
  masterSearch: string;
  setMasterSearch: (value: string) => void;
  filterCategories: string[];
  setFilterCategories: (value: React.SetStateAction<string[]>) => void;
  filterEras: string[];
  setFilterEras: (value: React.SetStateAction<string[]>) => void;
  searchedMasterWorks: MasterWork[];
  addFavWorkFromMaster: (work: MasterWork) => void;
}

export const Step4FavoriteWorks = ({
  formData,
  activePeriod,
  setActivePeriod,
  ratingType,
  setRatingType,
  setShowRatingHelp,
  toggleBestWork,
  setWorkTier,
  removeFavWork,
  handleRegisterNewWork,
  masterSearch,
  setMasterSearch,
  filterCategories,
  setFilterCategories,
  filterEras,
  setFilterEras,
  searchedMasterWorks,
  addFavWorkFromMaster,
}: Step4FavoriteWorksProps) => {
  // Filter Works for Display based on Active Period
  const displayWorks = formData.favWorks.filter(
    (w) => w.period === activePeriod
  );

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              私の好きな作品
            </h2>
          </div>
        </div>

        {/* Rating Type Toggle - Removed from here */}
      </div>

      {/* Period Tabs */}
      <div className="shrink-0 flex gap-4 border-b border-slate-200 mb-4 px-1">
        {(["NOW", "FUTURE", "LIFE"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activePeriod === p
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
          >
            {p === "LIFE" && "人生 (Life)"}
            {p === "NOW" && "今 (Now)"}
            {p === "FUTURE" && "未来 (Future)"}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left Column: User List (My List) - MOVED HERE */}
        <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-inner flex flex-col h-full overflow-hidden">
          <div className="shrink-0 mb-3 flex items-center justify-end gap-2">
            {/* Rating Type Toggle - Moved Here */}
            <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
              <button
                onClick={() => setRatingType("LIKE")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${ratingType === "LIKE" ? "bg-white dark:bg-slate-600 text-pink-500 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <Heart className="w-3 h-3 inline mr-1 mb-0.5" /> LIKE
              </button>
              <button
                onClick={() => setRatingType("TIER")}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${ratingType === "TIER" ? "bg-white dark:bg-slate-600 text-indigo-500 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                <Trophy className="w-3 h-3 inline mr-1 mb-0.5" /> TIER
              </button>
            </div>

            <button
              onClick={() => setShowRatingHelp(true)}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="評価の基準について"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1">
            {displayWorks.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs border-dashed border-2 border-slate-200 rounded-lg">
                作品がまだありません。
                <br />
                右から検索して追加してください。
              </div>
            )}
            {displayWorks.map((work) => (
              <div
                key={`${work.id}-${work.period}`}
                className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate"
                      title={work.title}
                    >
                      {work.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-hidden text-[10px] text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1 py-0.5 rounded text-slate-500 dark:text-slate-400 shrink-0">
                      {work.category}
                    </span>
                    {work.author && (
                      <span className="truncate">{work.author}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Unrated Badge - Emphasized */}
                  {work.tier === null && (
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 px-2 py-0.5 rounded-full font-bold shadow-sm">
                      未評価
                    </span>
                  )}

                  {/* Rating Controls */}
                  {ratingType === "LIKE" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBestWork(work.id, activePeriod)}
                        className="focus:outline-none p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${work.isBest ? "text-pink-500 fill-pink-500" : "text-slate-300 dark:text-slate-600 hover:text-pink-300"}`}
                        />
                      </button>
                      <button
                        onClick={() =>
                          setWorkTier(work.id, activePeriod, "normal")
                        }
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${work.tier === "normal"
                            ? "bg-slate-400 dark:bg-slate-600 text-white shadow-sm"
                            : "text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-500 dark:hover:text-slate-400"
                          }`}
                      >
                        普通
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-0.5 rounded-md">
                      {[1, 2, 3, "normal"].map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setWorkTier(work.id, activePeriod, t as any)
                          }
                          className={`h-6 px-2 text-[10px] font-bold rounded flex items-center justify-center transition-all ${work.tier === t
                              ? t === 1
                                ? "bg-purple-600 text-white shadow-sm"
                                : t === 2
                                  ? "bg-indigo-500 text-white"
                                  : t === 3
                                    ? "bg-teal-500 text-white"
                                    : "bg-slate-400 dark:bg-slate-500 text-white"
                              : "text-slate-300 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600"
                            }`}
                        >
                          {t === "normal" ? "普通" : `T${t}`}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => removeFavWork(work.id, activePeriod)}
                    className="text-slate-300 hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Existing Work List & Filters & Add Button */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="shrink-0 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span>登録済み作品リスト</span>
                <span className="text-xs font-normal text-slate-400">
                  Registered Work List
                </span>
              </h3>
              <button
                onClick={handleRegisterNewWork} // Navigates to external page (placeholder)
                className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                新規追加(別画面)
              </button>
            </div>

            {/* Filters */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="作品名、作者名で検索..."
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  value={masterSearch}
                  onChange={(e) => setMasterSearch(e.target.value)}
                />
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {WORK_CATEGORIES.map((cat) => {
                  const isSelected = filterCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilterCategories((prev) =>
                          isSelected
                            ? prev.filter((c) => c !== cat)
                            : [...prev, cat]
                        );
                      }}
                      className={`text-xs px-3 py-1.5 rounded-md border transition-all ${isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-md"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              {/* Era Multi-select Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ERAS.map((era) => {
                  const isSelected = filterEras.includes(era);
                  return (
                    <button
                      key={era}
                      onClick={() => {
                        setFilterEras((prev) =>
                          isSelected
                            ? prev.filter((e) => e !== era)
                            : [...prev, era]
                        );
                      }}
                      className={`text-[10px] px-2 py-1 rounded-full border transition-all ${isSelected
                          ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 font-bold shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-500"
                        }`}
                    >
                      {era}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 mt-2">
            {searchedMasterWorks.length === 0 && (
              <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                <p className="text-xs text-slate-400 mb-2">
                  条件に一致する作品が見つかりません
                </p>
              </div>
            )}
            {(() => {
              // Sort works: Unregistered first, then Registered
              const sortedWorks = [...searchedMasterWorks].sort((a, b) => {
                const isAddedA = formData.favWorks.some(
                  (fw) => fw.id === a.id && fw.period === activePeriod
                );
                const isAddedB = formData.favWorks.some(
                  (fw) => fw.id === b.id && fw.period === activePeriod
                );
                if (isAddedA === isAddedB) return 0;
                return isAddedA ? 1 : -1; // Added items go to bottom
              });

              return sortedWorks.map((work) => {
                const isAdded = formData.favWorks.some(
                  (fw) => fw.id === work.id && fw.period === activePeriod
                );
                return (
                  <div
                    key={work.id}
                    onClick={() => !isAdded && addFavWorkFromMaster(work)}
                    className={`flex items-start justify-between p-2 rounded border transition-all group ${isAdded
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 cursor-default"
                        : "bg-white dark:bg-slate-900 border-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-100 dark:hover:border-indigo-800 cursor-pointer shadow-sm hover:shadow-md"
                      }`}
                  >
                    <div className="min-w-0 pr-2 pointer-events-none">
                      <div className="font-bold text-slate-700 dark:text-slate-200 text-sm truncate">
                        {work.title}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {isAdded && (
                          <span className="inline-block bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] px-1.5 rounded mr-1.5 font-bold">
                            登録済
                          </span>
                        )}
                        <span
                          className={`${isAdded ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-800"} px-1.5 rounded mr-1.5`}
                        >
                          {work.category}
                        </span>
                        {work.author}
                      </div>
                    </div>
                    <button
                      disabled={isAdded}
                      className={`shrink-0 p-1.5 rounded-full transition-all pointer-events-none ${isAdded
                          ? "text-slate-400 bg-slate-200 dark:bg-slate-700"
                          : "text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900"
                        }`}
                    >
                      {isAdded ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                );
              });
            })()}
          </div>
        </section>
      </div>
    </div>
  );
};
