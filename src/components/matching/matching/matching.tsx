import {
  Activity,
  ArrowLeft,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Layers,
  LayoutDashboard,
  ListFilter,
  Play,
  RotateCcw,
  Search,
  Square,
  Target,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";
import { CATEGORIES, MatchStats, UserProfile } from "./matching.logic";

interface MatchingProps {
  // State
  selectedProfileId: string;
  selectedCategories: string[];
  matchCriterion: "count" | "score";
  processLimit: number;
  scoreThreshold: number;

  view: "setup" | "matching" | "result" | "detail";
  matchMode: "expand" | "refine";
  lastMatchStats: MatchStats;
  viewingUser: UserProfile | null;
  isSidebarCollapsed: boolean;
  isRightSidebarCollapsed: boolean;
  rightSidebarTab: "watch" | "drift";

  // Data
  myProfiles: UserProfile[];
  selectedProfile?: UserProfile;
  currentWatchList: UserProfile[];
  currentDriftList: UserProfile[];

  // Actions
  onProfileSwitch: (id: string) => void;
  onToggleCategory: (id: string) => void;
  onSetSelectedCategories: (ids: string[]) => void;
  onSetMatchCriterion: (val: "count" | "score") => void;
  onSetProcessLimit: (val: number) => void;
  onSetScoreThreshold: (val: number) => void;
  onSetMatchMode: (val: "expand" | "refine") => void;
  onRunMatching: () => void;
  onSetView: (view: "setup" | "matching" | "result" | "detail") => void;
  onViewUser: (user: UserProfile) => void;
  onCloseUserDetail: () => void; // Used for "Back" or switching view
  onRestoreUser: (user: UserProfile) => void;
  onRemoveUser: (user: UserProfile) => void;
  onToggleSidebar: () => void;
  onToggleRightSidebar: () => void;
  onSetRightSidebarTab: (tab: "watch" | "drift") => void;
}

export const Matching: React.FC<MatchingProps> = ({
  selectedProfileId,
  selectedCategories,
  matchCriterion,
  processLimit,
  scoreThreshold,

  view,
  matchMode,
  lastMatchStats,
  viewingUser,
  isSidebarCollapsed,
  isRightSidebarCollapsed,
  rightSidebarTab,
  myProfiles,
  selectedProfile,
  currentWatchList,
  currentDriftList,
  onProfileSwitch,
  onToggleCategory,
  onSetSelectedCategories,
  onSetMatchCriterion,
  onSetProcessLimit,
  onSetScoreThreshold,
  onSetMatchMode,
  onRunMatching,
  onSetView,
  onViewUser,
  onCloseUserDetail,
  onRestoreUser,
  onRemoveUser,
  onToggleSidebar,
  onToggleRightSidebar,
  onSetRightSidebarTab,
}) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 font-sans overflow-hidden text-base">
      {/* --- 左：プロフィールリスト --- */}
      <aside
        className={`${isSidebarCollapsed ? "w-20" : "w-72"} bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 relative`}
      >
        <button
          onClick={onToggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm z-10 hover:bg-slate-50 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} /> {!isSidebarCollapsed && "Target Persona"}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {myProfiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onProfileSwitch(profile.id)}
              className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center gap-3 ${
                selectedProfileId === profile.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className="text-2xl shrink-0">{profile.icon}</span>
              {!isSidebarCollapsed && (
                <div className="text-sm font-bold truncate">{profile.name}</div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* --- 中央：メインエリア --- */}
      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative">
        {view === "setup" && (
          <div className="max-w-2xl mx-auto w-full p-6 space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-slate-500 text-xs font-black uppercase rounded-full tracking-widest border border-slate-200 shadow-sm">
                <Activity size={12} /> Matching Management
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                自動マッチング設定
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                プロフィールに近い人を探して追加する、もしくは遠い人を整理します。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onSetMatchMode("expand")}
                className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${matchMode === "expand" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${matchMode === "expand" ? "bg-white/20" : "bg-indigo-50 text-indigo-600"}`}
                >
                  <UserPlus size={24} />
                </div>
                <div>
                  <div className="font-black text-base">
                    新規プロフィールの追加
                  </div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-tighter opacity-80 ${matchMode === "expand" ? "text-indigo-100" : "text-slate-400"}`}
                  >
                    Add New Profiles
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSetMatchMode("refine")}
                className={`p-4 rounded-2xl border-2 transition-all text-left space-y-2 ${matchMode === "refine" ? "bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${matchMode === "refine" ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}
                >
                  <ListFilter size={24} />
                </div>
                <div>
                  <div className="font-black text-base">既存リストの整理</div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-tighter opacity-80 ${matchMode === "refine" ? "text-slate-300" : "text-slate-400"}`}
                  >
                    Refine Current Watchlist
                  </div>
                </div>
              </button>
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center px-6">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {matchMode === "expand"
                    ? "マッチング対象項目"
                    : "整理の基準とする項目"}
                </label>
                <div className="flex gap-2 text-[10px] font-black">
                  <button
                    onClick={() =>
                      onSetSelectedCategories(CATEGORIES.map((c) => c.id))
                    }
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors uppercase"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => onSetSelectedCategories([])}
                    className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors uppercase"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onToggleCategory(cat.id)}
                    className={`flex items-center justify-between p-4 px-6 hover:bg-slate-50 transition-colors ${selectedCategories.includes(cat.id) ? "text-slate-800" : "text-slate-300"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          selectedCategories.includes(cat.id)
                            ? "text-indigo-600"
                            : "text-slate-300"
                        }
                      >
                        {cat.icon && <cat.icon size={18} />}
                      </span>
                      <span className="text-sm font-bold">{cat.label}</span>
                    </div>
                    {selectedCategories.includes(cat.id) ? (
                      <CheckSquare size={18} className="text-indigo-600" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 bg-slate-50/50 space-y-6">
                <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mx-auto border border-slate-200">
                  <button
                    onClick={() => onSetMatchCriterion("count")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${matchCriterion === "count" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <Users size={14} /> 人数で指定
                  </button>
                  <button
                    onClick={() => onSetMatchCriterion("score")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${matchCriterion === "score" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <Target size={14} /> スコアで指定
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {matchMode === "expand"
                        ? matchCriterion === "count"
                          ? "追加する最大人数"
                          : "追加対象の基準スコア"
                        : matchCriterion === "count"
                          ? "削除する最大人数"
                          : "削除対象の基準スコア"}
                    </label>
                    <span
                      className={`text-sm font-black px-3 py-0.5 rounded-full border shadow-sm ${matchMode === "expand" ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-800 text-white border-slate-800"}`}
                    >
                      {matchCriterion === "count"
                        ? `${processLimit}人`
                        : `${scoreThreshold}点以上`}
                    </span>
                  </div>

                  <div className="px-1">
                    <input
                      type="range"
                      min={matchCriterion === "count" ? 1 : 0}
                      max={
                        matchCriterion === "count"
                          ? matchMode === "expand"
                            ? 5
                            : Math.max(currentWatchList.length, 1)
                          : 8
                      }
                      step="1"
                      value={
                        matchCriterion === "count"
                          ? processLimit
                          : scoreThreshold
                      }
                      onChange={(e) =>
                        matchCriterion === "count"
                          ? onSetProcessLimit(parseInt(e.target.value))
                          : onSetScoreThreshold(parseInt(e.target.value))
                      }
                      className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${matchMode === "expand" ? "accent-indigo-600" : "accent-slate-800"}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={onRunMatching}
              disabled={
                selectedCategories.length === 0 ||
                (matchMode === "refine" && currentWatchList.length === 0)
              }
              className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 ${
                matchMode === "expand"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                  : "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-200"
              } ${(selectedCategories.length === 0 || (matchMode === "refine" && currentWatchList.length === 0)) && "opacity-50 cursor-not-allowed transform-none"}`}
            >
              {matchMode === "expand" ? (
                <>
                  <Play size={24} fill="currentColor" /> マッチング実行
                </>
              ) : (
                <>
                  <ListFilter size={24} /> 既存リストから整理の実行
                </>
              )}
            </button>
          </div>
        )}

        {view === "matching" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div
                className={`w-24 h-24 border-4 border-slate-200 rounded-full animate-spin ${matchMode === "expand" ? "border-t-indigo-600" : "border-t-slate-800"}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {matchMode === "expand" ? (
                  <Search size={32} className="text-indigo-600" />
                ) : (
                  <ListFilter size={32} className="text-slate-600" />
                )}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-1">
                Processing Data...
              </h2>
              <p className="text-sm text-slate-400 font-medium italic">
                設定された条件に基づき演算中
              </p>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 text-center space-y-8 max-w-lg w-full">
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-100">
                <Check size={40} strokeWidth={3} />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                  {matchMode === "expand"
                    ? "新しくウォッチするプロフィールが追加されました。"
                    : "ウォッチしているプロフィールの整理が完了しました。"}
                </h2>

                <div className="flex justify-center">
                  {matchMode === "expand" ? (
                    <div className="bg-indigo-50 px-8 py-5 rounded-3xl border border-indigo-100 text-center min-w-[220px]">
                      <div className="text-indigo-600 font-black text-4xl">
                        {lastMatchStats.added}
                      </div>
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2">
                        Profiles Added
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800 px-8 py-5 rounded-3xl border border-slate-700 text-center min-w-[220px]">
                      <div className="text-white font-black text-4xl">
                        {lastMatchStats.removed}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Profiles Excluded
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  条件に合うプロフィールをリストへ追加・整理しました。右側のリストをクリックすると、各プロフィールの詳細を確認できます。
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => onSetView("setup")}
                  className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                >
                  <LayoutDashboard size={20} /> トップに戻る
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- プロフィール詳細表示 (統合ビュー) --- */}
        {view === "detail" && viewingUser && (
          <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-right-4 duration-300">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {/* ナビゲーションヘッダー */}
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={onCloseUserDetail}
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors group"
                >
                  <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  前の画面に戻る
                </button>
                <button
                  onClick={() => onSetView("setup")}
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors group"
                >
                  <LayoutDashboard size={18} />
                  トップに戻る
                </button>
              </div>

              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 pb-0 flex items-center gap-6">
                  <div
                    className={`w-24 h-24 ${viewingUser.color} rounded-[32px] flex items-center justify-center text-white text-4xl font-black shadow-inner`}
                  >
                    {viewingUser.name[0]}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">
                      Target Profile Detail
                    </div>
                    <h3 className="text-3xl font-black text-slate-800">
                      {viewingUser.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-full border border-indigo-100">
                        Match Score: {viewingUser.matchScore}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">
                        Resonating Wave
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {cat.icon && <cat.icon size={18} />} {cat.label}
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {(viewingUser[cat.id] as string[])?.map((item) => (
                          <span
                            key={item}
                            className={`px-4 py-2 rounded-2xl text-sm font-bold border transition-all ${
                              selectedProfile?.[cat.id]?.includes(item)
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-105"
                                : "bg-white text-slate-500 border-slate-100"
                            }`}
                          >
                            {selectedProfile?.[cat.id]?.includes(item) && (
                              <Check
                                size={14}
                                className="inline mr-1.5"
                                strokeWidth={3}
                              />
                            )}
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  {rightSidebarTab === "watch" ? (
                    <button
                      onClick={() => onRemoveUser(viewingUser)}
                      className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-base hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <UserMinus size={18} /> リストから除外する
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestoreUser(viewingUser)}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={18} /> ウォッチリストに戻す
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- 右：観測リストサイドバー --- */}
      <aside
        className={`${isRightSidebarCollapsed ? "w-20" : "w-72"} bg-white border-l border-slate-200 flex flex-col shrink-0 transition-all duration-300 relative shadow-[inset_1px_0_0_0_rgba(0,0,0,0.05)]`}
      >
        <button
          onClick={onToggleRightSidebar}
          className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm z-10 hover:bg-slate-50 transition-colors"
        >
          {isRightSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        {!isRightSidebarCollapsed ? (
          <div className="p-1.5 bg-slate-100 flex gap-1">
            <button
              onClick={() => onSetRightSidebarTab("watch")}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${rightSidebarTab === "watch" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-500"}`}
            >
              <Eye size={12} /> Watch{" "}
              {currentWatchList.length > 0 && `(${currentWatchList.length})`}
            </button>
            <button
              onClick={() => onSetRightSidebarTab("drift")}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${rightSidebarTab === "drift" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-500"}`}
            >
              <UserMinus size={12} /> Excluded{" "}
              {currentDriftList.length > 0 && `(${currentDriftList.length})`}
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-center">
            <Filter size={14} className="text-slate-400" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {(rightSidebarTab === "watch"
            ? currentWatchList
            : currentDriftList
          ).map((user, idx) => (
            <div
              key={`${user.id}-${idx}`}
              onClick={() => onViewUser(user)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 group cursor-pointer ${
                viewingUser?.id === user.id && view === "detail"
                  ? "bg-indigo-50 border-indigo-200 ring-2 ring-indigo-50"
                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
              } ${isRightSidebarCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`w-9 h-9 ${user.color} rounded-lg flex items-center justify-center text-white font-black shrink-0 text-sm shadow-sm ${rightSidebarTab === "drift" ? "grayscale opacity-60" : ""}`}
              >
                {user.name[0]}
              </div>
              {!isRightSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-800 truncate leading-tight">
                      {user.name}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all text-slate-300">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold px-1.5 bg-slate-50 rounded w-fit mt-0.5 border border-slate-100">
                    Score: {user.matchScore}
                  </div>
                </div>
              )}
            </div>
          ))}

          {(rightSidebarTab === "watch" ? currentWatchList : currentDriftList)
            .length === 0 && (
            <div className="text-center py-16 text-slate-300 px-6 animate-in fade-in duration-500">
              <Search className="mx-auto mb-2 opacity-10" size={32} />
              {!isRightSidebarCollapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  No Data
                </p>
              )}
            </div>
          )}
        </div>

        {!isRightSidebarCollapsed && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => onSetView("setup")}
              className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:bg-slate-50 shadow-sm transition-all uppercase tracking-widest"
            >
              新規処理を開始
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
