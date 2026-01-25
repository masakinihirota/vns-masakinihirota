import {
  User,
  Users,
  Play,
  Eye,
  Layers,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Heart,
  Zap,
  Tag,
  Square,
  CheckSquare,
  UserMinus,
  UserPlus,
  Target,
  ArrowLeft,
  ListFilter,
  RotateCcw,
  LayoutDashboard,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";

// --- 定数 ---
const CATEGORIES = [
  { id: "values", label: "価値観", icon: <Heart size={18} /> },
  { id: "createdWorks", label: "作った作品", icon: <Briefcase size={18} /> },
  { id: "favoriteWorks", label: "好きな作品", icon: <Tag size={18} /> },
  { id: "skills", label: "スキル", icon: <Zap size={18} /> },
] as const;

// --- モックデータ ---
const MY_PROFILES = [
  {
    id: "p1",
    name: "プロフェッショナル",
    icon: "💼",
    purposes: ["創る・働く"],
    values: ["効率", "論理", "成長"],
    createdWorks: ["システムA"],
    favoriteWorks: ["技術書X"],
    skills: ["React", "Go"],
    stats: { follows: 12, watches: 45, partners: 3 },
  },
  {
    id: "p2",
    name: "自由人",
    icon: "🎮",
    purposes: ["遊ぶ"],
    values: ["没入感", "物語"],
    createdWorks: ["Modツール"],
    favoriteWorks: ["RPG Z"],
    skills: ["エイム"],
    stats: { follows: 5, watches: 128, partners: 1 },
  },
] as const;

const CANDIDATE_POOL = [
  {
    id: "u1",
    name: "アリス",
    color: "bg-blue-500",
    values: ["効率", "美"],
    createdWorks: ["デザイン"],
    favoriteWorks: ["技術書X"],
    skills: ["React"],
  },
  {
    id: "u2",
    name: "ボブ",
    color: "bg-green-500",
    values: ["没入感", "共闘"],
    createdWorks: ["ゲーム"],
    favoriteWorks: ["RPG Z"],
    skills: ["チームビルド"],
  },
  {
    id: "u3",
    name: "キャロル",
    color: "bg-purple-500",
    values: ["物語", "繊細"],
    createdWorks: ["小説"],
    favoriteWorks: ["アニメM"],
    skills: ["執筆"],
  },
  {
    id: "u4",
    name: "デイビッド",
    color: "bg-orange-500",
    values: ["論理", "成長"],
    createdWorks: ["アプリ"],
    favoriteWorks: ["ビジネス書"],
    skills: ["Go"],
  },
  {
    id: "u5",
    name: "エレン",
    color: "bg-pink-500",
    values: ["独創性", "感情"],
    createdWorks: ["写真"],
    favoriteWorks: ["映画P"],
    skills: ["撮影"],
  },
  {
    id: "u6",
    name: "サトシ",
    color: "bg-indigo-500",
    values: ["論理", "美"],
    createdWorks: ["Webサイト"],
    favoriteWorks: ["技術書X"],
    skills: ["React"],
  },
  {
    id: "u7",
    name: "ミカ",
    color: "bg-teal-500",
    values: ["効率", "成長"],
    createdWorks: ["ツール"],
    favoriteWorks: ["ビジネス書"],
    skills: ["Go"],
  },
] as const;

type UserType = (typeof CANDIDATE_POOL)[number] & { matchScore?: number };

const AutoMatching2 = () => {
  // 状態管理
  const [selectedProfileId, setSelectedProfileId] = useState(MY_PROFILES[0].id);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    CATEGORIES.map((c) => c.id)
  );

  // マッチング基準: 'count' (人数) | 'score' (スコア)
  const [matchCriterion, setMatchCriterion] = useState<"count" | "score">(
    "count"
  );
  const [processLimit, setProcessLimit] = useState(3); // 人数指定用
  const [scoreThreshold, setScoreThreshold] = useState(2); // スコア指定用

  const [isMatching, setIsMatching] = useState(false);
  const [watchedUsersPerProfile, setWatchedUsersPerProfile] = useState<
    Record<string, UserType[]>
  >({});
  const [driftedUsersPerProfile, setDriftedUsersPerProfile] = useState<
    Record<string, UserType[]>
  >({});
  const [lastMatchStats, setLastMatchStats] = useState({
    added: 0,
    removed: 0,
  });

  // view: 'setup' | 'matching' | 'result' | 'detail'
  const [view, setView] = useState<"setup" | "matching" | "result" | "detail">(
    "setup"
  );
  const [previousView, setPreviousView] = useState<
    "setup" | "matching" | "result" | "detail"
  >("setup");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState<"watch" | "drift">(
    "watch"
  );

  const [viewingUser, setViewingUser] = useState<UserType | null>(null);
  const [matchMode, setMatchMode] = useState<"expand" | "refine">("expand");

  // ダークモード状態 (初期値はfalseだが、useEffectでsystem preferenceを読むなど拡張可)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ダークモード切り替え時にhtmlクラスを操作
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 計算値
  const selectedProfile = useMemo(
    () => MY_PROFILES.find((p) => p.id === selectedProfileId) || MY_PROFILES[0],
    [selectedProfileId]
  );

  const currentWatchList = useMemo(
    () => watchedUsersPerProfile[selectedProfileId] || [],
    [watchedUsersPerProfile, selectedProfileId]
  );

  const currentDriftList = useMemo(
    () => driftedUsersPerProfile[selectedProfileId] || [],
    [driftedUsersPerProfile, selectedProfileId]
  );

  // 関数定義
  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleRestore = (user: UserType) => {
    setDriftedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: (prev[selectedProfileId] || []).filter(
        (u) => u.id !== user.id
      ),
    }));
    setWatchedUsersPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: [...(prev[selectedProfileId] || []), user],
    }));
  };

  const runMatching = () => {
    setIsMatching(true);
    setView("matching");

    setTimeout(() => {
      let addedUsers: UserType[] = [];
      let removedUsers: UserType[] = [];

      const calculateScore = (user: any) => {
        let score = 0;
        selectedCategories.forEach((cat) => {
          // @ts-ignore - dynamic access
          const matches =
            user[cat]?.filter((item) => selectedProfile[cat]?.includes(item)) ||
            [];
          score += matches.length * 2;
        });
        return { ...user, matchScore: score };
      };

      if (matchMode === "expand") {
        const scoredCandidates = CANDIDATE_POOL.filter(
          (p) => !currentWatchList.find((w) => w.id === p.id)
        ).map(calculateScore);

        if (matchCriterion === "count") {
          addedUsers = scoredCandidates
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, processLimit);
        } else {
          addedUsers = scoredCandidates.filter(
            (u) => u.matchScore >= scoreThreshold
          );
        }

        setWatchedUsersPerProfile((prev) => ({
          ...prev,
          [selectedProfileId]: [
            ...(prev[selectedProfileId] || []),
            ...addedUsers,
          ],
        }));
      } else {
        const scoredWatchList = currentWatchList.map(calculateScore);

        if (matchCriterion === "count") {
          const sorted = scoredWatchList.sort(
            (a, b) => a.matchScore - b.matchScore
          );
          removedUsers = sorted.slice(0, processLimit);
          const kept = sorted.slice(processLimit);
          setWatchedUsersPerProfile((prev) => ({
            ...prev,
            [selectedProfileId]: kept,
          }));
        } else {
          removedUsers = scoredWatchList.filter(
            (u) => u.matchScore < scoreThreshold
          );
          const kept = scoredWatchList.filter(
            (u) => u.matchScore >= scoreThreshold
          );
          setWatchedUsersPerProfile((prev) => ({
            ...prev,
            [selectedProfileId]: kept,
          }));
        }

        setDriftedUsersPerProfile((prev) => ({
          ...prev,
          [selectedProfileId]: [
            ...(prev[selectedProfileId] || []),
            ...removedUsers,
          ],
        }));
      }

      setLastMatchStats({
        added: addedUsers.length,
        removed: removedUsers.length,
      });
      setIsMatching(false);
      setView("result");
    }, 1500);
  };

  const handleProfileSwitch = (id: string) => {
    setSelectedProfileId(id);
    setView("setup");
    setProcessLimit(3);
    setScoreThreshold(2);
  };

  const handleViewUser = (user: UserType) => {
    if (view !== "detail") {
      setPreviousView(view);
    }
    setViewingUser(user);
    setView("detail");
  };

  // --- デザインクラス (Glassmorphism Light / Elegant Dark) ---
  const bgBase =
    "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-[#0B0F1A] dark:via-[#111625] dark:to-[#0B0F1A]";
  // Increased opacity for better contrast: bg-white/60 -> bg-white/80
  const cardGlass =
    "bg-white/90 backdrop-blur-md border border-white/40 shadow-xl ring-1 ring-white/50 dark:bg-white/5 dark:border-white/10 dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] dark:ring-0";
  const sidebarGlass =
    "bg-white/95 backdrop-blur-xl border-r border-slate-200 dark:bg-[#0B0F1A]/95 dark:border-white/5";
  const textMain = "text-slate-900 dark:text-neutral-100"; // Darker slate
  const textSub = "text-slate-600 dark:text-neutral-400"; // Darker slate for subtext
  const textAccentLight = "text-indigo-700 dark:text-indigo-400"; // Darker indigo
  const buttonPrimary =
    "bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none dark:bg-indigo-600/90 dark:hover:bg-indigo-600";
  const buttonSecondary =
    "bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm dark:bg-white/5 dark:text-neutral-300 dark:border-white/10 dark:hover:bg-white/10";

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden text-base transition-colors duration-500 ${bgBase}`}
    >
      {/* --- 左：プロフィールリスト --- */}
      <aside
        className={`${isSidebarCollapsed ? "w-20" : "w-72"} ${sidebarGlass} flex flex-col shrink-0 transition-all duration-300 relative z-20`}
        aria-label="Profile Selection Sidebar"
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm z-30 hover:scale-110 transition-transform text-slate-500 dark:text-slate-400"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h2 className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} /> Target Persona
            </h2>
          )}
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all ${isDarkMode ? "bg-yellow-500/10 text-yellow-400" : "bg-slate-100/80 text-slate-600"} ${isSidebarCollapsed ? "mx-auto" : ""}`}
            title="Toggle Theme"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {MY_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSwitch(profile.id)}
              className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center gap-3 relative overflow-hidden group ${
                selectedProfileId === profile.id
                  ? "bg-indigo-700 border-indigo-600 text-white shadow-md dark:shadow-indigo-900/20"
                  : "bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className="text-2xl shrink-0 relative z-10 filter drop-shadow-sm">
                {profile.icon}
              </span>
              {!isSidebarCollapsed && (
                <div className="min-w-0 relative z-10">
                  <div className="text-sm font-bold truncate">
                    {profile.name}
                  </div>
                  <div
                    className={`text-[10px] truncate ${selectedProfileId === profile.id ? "text-indigo-100" : "text-slate-500 dark:text-slate-500"}`}
                  >
                    {profile.purposes.join(", ")}
                  </div>
                </div>
              )}
              {selectedProfileId === profile.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* --- 中央：メインエリア --- */}
      <main
        className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
        aria-label="Matching Setup Interface"
      >
        <div className="min-h-full flex flex-col">
          {view === "setup" && (
            <div className="max-w-3xl mx-auto w-full p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 dark:bg-white/5 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase rounded-full tracking-widest border border-indigo-100 dark:border-indigo-900/30 shadow-sm backdrop-blur-sm">
                  <Sparkles size={12} /> Matching Management
                </div>
                <h1
                  className={`text-4xl font-black ${textMain} tracking-tight`}
                >
                  Automatic Matching
                </h1>
                <p
                  className={`text-sm ${textSub} font-medium max-w-md mx-auto`}
                >
                  あなたの価値観やスキルに共鳴するパートナーを見つけ、
                  <br className="hidden sm:block" />
                  より良いクリエイティブ環境を構築しましょう。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setMatchMode("expand")}
                  className={`relative p-6 rounded-3xl border transition-all text-left space-y-4 overflow-hidden group ${
                    matchMode === "expand"
                      ? "bg-indigo-700 border-indigo-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none"
                      : `${cardGlass} ${textSub} hover:border-indigo-300 dark:hover:border-indigo-800`
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${matchMode === "expand" ? "bg-white/20" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"}`}
                  >
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <div
                      className={`font-black text-lg ${matchMode === "expand" ? "text-white" : textMain}`}
                    >
                      Expand Network
                    </div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wide opacity-80 mt-1`}
                    >
                      新規プロフィールの追加
                    </div>
                  </div>
                  {matchMode === "expand" && (
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  )}
                </button>

                <button
                  onClick={() => setMatchMode("refine")}
                  className={`relative p-6 rounded-3xl border transition-all text-left space-y-4 overflow-hidden group ${
                    matchMode === "refine"
                      ? "bg-slate-800 dark:bg-slate-700 border-slate-700 text-white shadow-xl shadow-slate-200/50 dark:shadow-none"
                      : `${cardGlass} ${textSub} hover:border-slate-300 dark:hover:border-slate-600`
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${matchMode === "refine" ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                  >
                    <ListFilter size={24} />
                  </div>
                  <div>
                    <div
                      className={`font-black text-lg ${matchMode === "refine" ? "text-white" : textMain}`}
                    >
                      Refine List
                    </div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wide opacity-80 mt-1`}
                    >
                      既存リストの整理
                    </div>
                  </div>
                  {matchMode === "refine" && (
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  )}
                </button>
              </div>

              <section className={`${cardGlass} rounded-3xl overflow-hidden`}>
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center px-6 bg-slate-50/50 dark:bg-white/5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                    Criteria
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedCategories(CATEGORIES.map((c) => c.id))
                      }
                      className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">
                      |
                    </span>
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/5 border-b border-slate-100 dark:border-white/5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group ${selectedCategories.includes(cat.id) ? textMain : "text-slate-400 dark:text-slate-600"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`transition-transform duration-300 group-hover:scale-110 ${selectedCategories.includes(cat.id) ? textAccentLight : "text-slate-400 dark:text-slate-600"}`}
                        >
                          {cat.icon}
                        </span>
                        <span className="text-sm font-bold">{cat.label}</span>
                      </div>
                      <div
                        className={`transition-all duration-200 ${selectedCategories.includes(cat.id) ? "scale-100 opacity-100" : "scale-90 opacity-50"}`}
                      >
                        {selectedCategories.includes(cat.id) ? (
                          <CheckSquare
                            size={20}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                        ) : (
                          <Square size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-8 space-y-8 bg-slate-50/30 dark:bg-black/20">
                  <div className="flex items-center justify-center p-1 bg-white/50 dark:bg-white/5 rounded-xl w-fit mx-auto ring-1 ring-black/5 dark:ring-white/10">
                    <button
                      onClick={() => setMatchCriterion("count")}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${matchCriterion === "count" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                    >
                      <Users size={14} /> By Count
                    </button>
                    <button
                      onClick={() => setMatchCriterion("score")}
                      className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${matchCriterion === "score" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
                    >
                      <Target size={14} /> By Score
                    </button>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        {matchMode === "expand"
                          ? matchCriterion === "count"
                            ? "Max additions"
                            : "Min score threshold"
                          : matchCriterion === "count"
                            ? "Max removals"
                            : "Max score below"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-white ${matchMode === "expand" ? "bg-indigo-600" : "bg-slate-800 dark:bg-slate-600"}`}
                      >
                        {matchCriterion === "count"
                          ? `${processLimit} People`
                          : `Score ${scoreThreshold}+`}
                      </span>
                    </div>

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
                          ? setProcessLimit(parseInt(e.target.value))
                          : setScoreThreshold(parseInt(e.target.value))
                      }
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 ${matchMode === "expand" ? "accent-indigo-600" : "accent-slate-800"}`}
                      aria-label="Filter Threshold"
                    />
                  </div>
                </div>
              </section>

              <button
                onClick={runMatching}
                disabled={
                  selectedCategories.length === 0 ||
                  (matchMode === "refine" && currentWatchList.length === 0)
                }
                className={`w-full py-6 rounded-2xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  matchMode === "expand"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200/50 dark:shadow-none"
                    : "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-200/50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:shadow-none"
                }`}
              >
                {matchMode === "expand" ? (
                  <>
                    <Play size={24} fill="currentColor" /> Run Auto-Match
                  </>
                ) : (
                  <>
                    <ListFilter size={24} /> Run Auto-Refine
                  </>
                )}
              </button>
            </div>
          )}

          {view === "matching" && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                <div
                  className={`w-32 h-32 border-[6px] rounded-full animate-spin relative z-10 ${matchMode === "expand" ? "border-indigo-100 border-t-indigo-600 dark:border-white/10 dark:border-t-indigo-500" : "border-slate-100 border-t-slate-800 dark:border-white/10 dark:border-t-slate-500"}`}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {matchMode === "expand" ? (
                    <Search
                      size={40}
                      className="text-indigo-600 dark:text-indigo-400 animate-pulse"
                    />
                  ) : (
                    <ListFilter
                      size={40}
                      className="text-slate-600 dark:text-slate-400 animate-pulse"
                    />
                  )}
                </div>
              </div>
              <div className="text-center relative z-10">
                <h2
                  className={`text-2xl font-black ${textMain} tracking-tighter uppercase mb-2`}
                >
                  Processing
                </h2>
                <p className={`text-sm ${textSub} font-medium`}>
                  Finding the best resonance matches...
                </p>
              </div>
            </div>
          )}

          {view === "result" && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
              <div
                className={`${cardGlass} p-12 rounded-[40px] text-center space-y-8 max-w-lg w-full relative overflow-hidden`}
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500" />

                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200/50 dark:shadow-none">
                  <Check size={48} strokeWidth={4} />
                </div>

                <div className="space-y-4">
                  <h2
                    className={`text-3xl font-black ${textMain} tracking-tight leading-tight`}
                  >
                    {matchMode === "expand"
                      ? "Matching Complete!"
                      : "Refinement Complete!"}
                  </h2>

                  <div className="flex justify-center py-4">
                    {matchMode === "expand" ? (
                      <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 text-center min-w-[200px] border border-indigo-100 dark:border-indigo-500/30">
                        <div className="text-indigo-600 dark:text-indigo-400 font-black text-5xl">
                          {lastMatchStats.added}
                        </div>
                        <div className="text-xs font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mt-2">
                          New Connections
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 text-center min-w-[200px] border border-slate-200 dark:border-slate-700">
                        <div className="text-slate-800 dark:text-white font-black text-5xl">
                          {lastMatchStats.removed}
                        </div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">
                          Removed
                        </div>
                      </div>
                    )}
                  </div>

                  <p className={`text-sm ${textSub} leading-relaxed`}>
                    処理が完了しました。右側のリストから詳細を確認できます。
                  </p>
                </div>

                <button
                  onClick={() => setView("setup")}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${buttonSecondary}`}
                >
                  <LayoutDashboard size={20} /> Back to Setup
                </button>
              </div>
            </div>
          )}

          {view === "detail" && viewingUser && (
            <div className="flex-1 flex flex-col p-4 sm:p-8 animate-in slide-in-from-right-4 duration-300">
              <div className="max-w-4xl mx-auto w-full space-y-6">
                {/* Navigation */}
                <div className="flex justify-between items-center px-2">
                  <button
                    onClick={() => setView(previousView)}
                    className={`inline-flex items-center gap-2 ${textSub} hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm transition-colors group`}
                  >
                    <ArrowLeft
                      size={18}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Back
                  </button>
                </div>

                <div className={`${cardGlass} rounded-[40px] overflow-hidden`}>
                  <div className="relative p-8 pb-0 flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
                    <div
                      className={`w-32 h-32 ${viewingUser.color} rounded-[32px] flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden group`}
                    >
                      <span className="relative z-10">
                        {viewingUser.name[0]}
                      </span>
                      <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">
                        Resonance Profile
                      </div>
                      <h3 className={`text-4xl font-black ${textMain}`}>
                        {viewingUser.name}
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                        <span className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-200/50 dark:shadow-none">
                          Match Score: {viewingUser.matchScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Background for Header */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100/50 to-transparent dark:from-indigo-900/20 blur-3xl pointer-events-none -z-0" />

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.id} className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-indigo-50 dark:border-white/5 pb-2">
                          {cat.icon} {cat.label}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {/* @ts-ignore */}
                          {viewingUser[cat.id]?.map((item) => (
                            <span
                              key={item}
                              className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${
                                // @ts-ignore
                                selectedProfile[cat.id]?.includes(item)
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200/50 dark:shadow-none scale-105"
                                  : "bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-indigo-100/50 dark:border-white/10"
                              }`}
                            >
                              {/* @ts-ignore */}
                              {selectedProfile[cat.id]?.includes(item) && (
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

                  <div className="p-6 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 flex gap-4">
                    {rightSidebarTab === "watch" ? (
                      <button
                        onClick={() => {
                          setWatchedUsersPerProfile((prev) => ({
                            ...prev,
                            [selectedProfileId]: prev[selectedProfileId].filter(
                              (u) => u.id !== viewingUser.id
                            ),
                          }));
                          setDriftedUsersPerProfile((prev) => ({
                            ...prev,
                            [selectedProfileId]: [
                              ...(prev[selectedProfileId] || []),
                              viewingUser,
                            ],
                          }));
                          setView(previousView);
                        }}
                        className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-base hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <UserMinus size={18} /> Remove from List
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleRestore(viewingUser);
                          setView(previousView);
                        }}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} /> Restore to Watchlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- 右：観測リストサイドバー --- */}
      <aside
        className={`${isRightSidebarCollapsed ? "w-20" : "w-80"} bg-white dark:bg-[#0B0F1A] border-l border-slate-200 dark:border-white/5 flex flex-col shrink-0 transition-all duration-300 relative shadow-xl z-20`}
      >
        <button
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm z-30 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
          aria-label="Toggle right sidebar"
        >
          {isRightSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        {!isRightSidebarCollapsed ? (
          <div className="p-3 bg-slate-50 dark:bg-[#111625] border-b border-slate-100 dark:border-white/5 flex gap-1">
            <button
              onClick={() => setRightSidebarTab("watch")}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${rightSidebarTab === "watch" ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 hover:text-slate-500"}`}
            >
              <Eye size={12} /> Watch{" "}
              {currentWatchList.length > 0 && `(${currentWatchList.length})`}
            </button>
            <button
              onClick={() => setRightSidebarTab("drift")}
              className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${rightSidebarTab === "drift" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-300 shadow-sm" : "text-slate-400 hover:text-slate-500"}`}
            >
              <UserMinus size={12} /> Excluded{" "}
              {currentDriftList.length > 0 && `(${currentDriftList.length})`}
            </button>
          </div>
        ) : (
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-center">
            <ListFilter size={16} className="text-slate-400" />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {(rightSidebarTab === "watch"
            ? currentWatchList
            : currentDriftList
          ).map((user, idx) => (
            <div
              key={`${user.id}-${idx}`}
              onClick={() => handleViewUser(user)}
              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 group cursor-pointer ${
                viewingUser?.id === user.id && view === "detail"
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/50"
                  : "bg-white dark:bg-white/5 border-transparent hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 shadow-sm"
              } ${isRightSidebarCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`w-10 h-10 ${user.color} rounded-xl flex items-center justify-center text-white font-black shrink-0 text-sm shadow-sm ${rightSidebarTab === "drift" ? "grayscale opacity-60" : ""}`}
              >
                {user.name[0]}
              </div>
              {!isRightSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-bold ${textMain} truncate`}>
                      {user.name}
                    </div>
                    <ChevronRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 transition-opacity"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-1.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      Score: {user.matchScore}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(rightSidebarTab === "watch" ? currentWatchList : currentDriftList)
            .length === 0 && (
            <div className="text-center py-20 opacity-50 px-6 flex flex-col items-center">
              <Search
                className="mb-3 text-slate-300 dark:text-slate-600"
                size={32}
              />
              {!isRightSidebarCollapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  No Profiles
                </p>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default AutoMatching2;
