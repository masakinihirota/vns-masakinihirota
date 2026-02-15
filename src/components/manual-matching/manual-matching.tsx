"use client";

import {
  ArrowRightLeft,
  Briefcase,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Eye,
  Globe,
  Heart,
  Layers,
  LayoutDashboard,
  Play,
  Plus,
  Search,
  Settings2,
  Split,
  Tag,
  UserCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";

interface MyProfile {
  id: string;
  name: string;
  icon: string;
  role: string;
  purposes: string[];
  values: string[];
  createdWorks: string[];
  favoriteWorks: string[];
  skills: string[];
  stats: {
    follows: number;
    watches: number;
    partners: number;
  };
}

interface Candidate {
  id: string;
  name: string;
  color: string;
  values: string[];
  createdWorks: string[];
  favoriteWorks: string[];
  skills: string[];
  bio: string;
}

type CategoryKey = "values" | "createdWorks" | "favoriteWorks" | "skills";

// --- モックデータ ---
const MY_PROFILES = [
  {
    id: "p1",
    name: "プロフェッショナル",
    icon: "💼",
    role: "エンジニア",
    purposes: ["創る・働く", "相談"],
    values: ["効率", "論理", "成長"],
    createdWorks: ["システムA", "ライブラリB"],
    favoriteWorks: ["技術書X", "SF映画Y"],
    skills: ["React", "Go", "AWS"],
    stats: { follows: 12, watches: 45, partners: 3 },
  },
  {
    id: "p2",
    name: "自由人",
    icon: "🎮",
    role: "ゲーマー",
    purposes: ["全部"],
    values: ["没入感", "物語", "共闘"],
    createdWorks: ["Modツール", "攻略Wiki"],
    favoriteWorks: ["RPG Z", "アニメM"],
    skills: ["エイム", "チームビルド"],
    stats: { follows: 5, watches: 128, partners: 1 },
  },
  {
    id: "p3",
    name: "創作活動",
    icon: "🎨",
    role: "絵描き",
    purposes: ["創る・働く", "遊ぶ", "パートナー探し"],
    values: ["美", "独創性", "感情"],
    createdWorks: ["イラスト集Z", "漫画本W"],
    favoriteWorks: ["映画P", "画集Q"],
    skills: ["Photoshop", "デッサン"],
    stats: { follows: 89, watches: 340, partners: 12 },
  },
];

const CANDIDATE_POOL = [
  {
    id: "u1",
    name: "アリス",
    color: "bg-blue-500",
    values: ["効率", "美", "誠実"],
    createdWorks: ["デザインツール"],
    favoriteWorks: ["技術書X", "SF映画Y"],
    skills: ["React", "Figma"],
    bio: "技術と美学の融合を求めています。",
  },
  {
    id: "u2",
    name: "ボブ",
    color: "bg-green-500",
    values: ["没入感", "共闘", "誠実"],
    createdWorks: ["インディーゲーム"],
    favoriteWorks: ["RPG Z", "アクション映画"],
    skills: ["チームビルド", "Discord運用"],
    bio: "一緒に冒険できる仲間を探しています。",
  },
  {
    id: "u3",
    name: "キャロル",
    color: "bg-purple-500",
    values: ["物語", "美", "繊細"],
    createdWorks: ["短編小説"],
    favoriteWorks: ["アニメM", "映画P"],
    skills: ["シナリオ作成"],
    bio: "静かな創作の時間を大切にしています。",
  },
  {
    id: "u4",
    name: "デイビッド",
    color: "bg-orange-500",
    values: ["論理", "成長", "挑戦"],
    createdWorks: ["サービスC"],
    favoriteWorks: ["技術書X", "ビジネス書V"],
    skills: ["Go", "Rust"],
    bio: "常に限界を超えていきたい。",
  },
  {
    id: "u5",
    name: "エレン",
    color: "bg-pink-500",
    values: ["独創性", "感情", "美"],
    createdWorks: ["写真集"],
    favoriteWorks: ["画集Q", "映画P"],
    skills: ["デッサン", "写真撮影"],
    bio: "感情を形にするのが好きです。",
  },
];

const CATEGORIES = [
  { id: "values", label: "価値観", icon: <Heart size={14} /> },
  { id: "createdWorks", label: "作った作品", icon: <Briefcase size={14} /> },
  { id: "favoriteWorks", label: "好きな作品", icon: <Tag size={14} /> },
  { id: "skills", label: "スキル", icon: <Zap size={14} /> },
];

export const ManualMatching = () => {
  // 状態管理
  const [selectedProfileId, setSelectedProfileId] = useState(MY_PROFILES[0].id);
  const [selectedMatchedUserId, setSelectedMatchedUserId] = useState<
    string | null
  >(null);
  const [matchCount, setMatchCount] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState(
    CATEGORIES.map((c) => c.id)
  );

  // プロフィールごとの状態管理 { [profileId]: User[] }
  const [candidatesPerProfile, setCandidatesPerProfile] = useState<
    Record<string, Candidate[]>
  >({});

  const [view, setView] = useState("setup");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  // 計算値
  const selectedProfile = useMemo(
    () => MY_PROFILES.find((p) => p.id === selectedProfileId) || MY_PROFILES[0],
    [selectedProfileId]
  );

  const currentCandidates = useMemo(
    () => candidatesPerProfile[selectedProfileId] || [],
    [candidatesPerProfile, selectedProfileId]
  );

  const comparingUser = useMemo(
    () => currentCandidates.find((u) => u.id === selectedMatchedUserId),
    [currentCandidates, selectedMatchedUserId]
  );

  // ハンドラー
  const startMatching = () => {
    // setIsMatching(true);
    setView("matching");

    setTimeout(() => {
      const pool = [...CANDIDATE_POOL].sort(() => 0.5 - Math.random());
      const picked = pool.slice(0, matchCount);

      setCandidatesPerProfile((prev) => ({
        ...prev,
        [selectedProfileId]: picked,
      }));

      // setIsMatching(false);
      setView("prompt");
    }, 1500);
  };

  const handleProfileSwitch = (id: string) => {
    setSelectedProfileId(id);
    setSelectedMatchedUserId(null);
    const hasCandidates = (candidatesPerProfile[id] || []).length > 0;
    setView(hasCandidates ? "compare" : "setup");
    if (hasCandidates) {
      setSelectedMatchedUserId(candidatesPerProfile[id][0].id);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const setAllCategories = (on: boolean) => {
    setSelectedCategories(on ? CATEGORIES.map((c) => c.id) : []);
  };

  const compareItems = (
    myItems: string[] = [],
    partnerItems: string[] = []
  ) => {
    const common = myItems.filter((item) => partnerItems.includes(item));
    const onlyMe = myItems.filter((item) => !partnerItems.includes(item));
    const onlyPartner = partnerItems.filter((item) => !myItems.includes(item));
    return { common, onlyMe, onlyPartner };
  };

  const handleConfirmAction = (userId: string, _type: "watch" | "follow") => {
    // const userToMove = currentCandidates.find((u: any) => u.id === userId);
    setCandidatesPerProfile((prev) => ({
      ...prev,
      [selectedProfileId]: prev[selectedProfileId].filter(
        (u) => u.id !== userId
      ),
    }));

    /*
    // Unused state logic removed
    if (type === "watch") {
      setWatchedPerProfile((prev) => ({
        ...prev,
        [selectedProfileId]: [...(prev[selectedProfileId] || []), userToMove],
      }));
    } else if (type === "follow") {
      setFollowedPerProfile((prev) => ({
        ...prev,
        [selectedProfileId]: [...(prev[selectedProfileId] || []), userToMove],
      }));
    }
    */

    if (selectedMatchedUserId === userId) setSelectedMatchedUserId(null);
  };

  const handleAllAction = (_type: "watch" | "follow") => {
    /*
    // Unused state logic removed
    if (type === "watch") {
      setWatchedPerProfile((prev) => ({
        ...prev,
        [selectedProfileId]: [
          ...(prev[selectedProfileId] || []),
          ...currentCandidates,
        ],
      }));
    } else if (type === "follow") {
      setFollowedPerProfile((prev) => ({
        ...prev,
        [selectedProfileId]: [
          ...(prev[selectedProfileId] || []),
          ...currentCandidates,
        ],
      }));
    }
    */
    setCandidatesPerProfile((prev) => ({ ...prev, [selectedProfileId]: [] }));
    setView("setup");
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden text-base">
      {/* --- 左：プロフィールリスト (折りたたみ可能) --- */}
      <aside
        className={`${isSidebarCollapsed ? "w-20" : "w-72"} bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 relative`}
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm z-10 hover:bg-slate-50 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        <div
          className={`p-4 border-b border-slate-100 bg-slate-50/50 ${isSidebarCollapsed ? "text-center" : ""}`}
        >
          <h2
            className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 ${isSidebarCollapsed ? "justify-center" : "mb-1"}`}
          >
            <Layers size={14} /> {!isSidebarCollapsed && "My Profiles"}
          </h2>
          {!isSidebarCollapsed && (
            <p className="text-xs text-slate-400 font-medium">
              独立した観測点（千の仮面）
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MY_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSwitch(profile.id)}
              className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-start gap-3 ${
                selectedProfileId === profile.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
              } ${isSidebarCollapsed ? "justify-center items-center" : ""}`}
            >
              <span className="text-2xl shrink-0 mt-1">{profile.icon}</span>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate leading-tight">
                    {profile.name}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.purposes.includes("全部") ? (
                      <span
                        className={`text-[9px] px-1.5 py-0 rounded font-black border ${selectedProfileId === profile.id ? "bg-indigo-500 border-indigo-400 text-white" : "bg-indigo-50 border-indigo-100 text-indigo-600"}`}
                      >
                        全部
                      </span>
                    ) : (
                      profile.purposes.map((p) => (
                        <span
                          key={p}
                          className={`text-[9px] px-1 py-0 rounded font-bold border ${selectedProfileId === profile.id ? "bg-white/20 border-white/30 text-white" : "bg-slate-100 border-slate-200 text-slate-500"}`}
                        >
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-3 mt-1.5 text-xs font-semibold ${selectedProfileId === profile.id ? "text-indigo-100" : "text-slate-500"}`}
                  >
                    <span
                      className="flex items-center gap-1"
                      title="フォロー数"
                    >
                      <UserCheck size={11} /> {profile.stats.follows}
                    </span>
                    <span
                      className="flex items-center gap-1"
                      title="ウォッチ数"
                    >
                      <Eye size={11} /> {profile.stats.watches}
                    </span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* --- 中央：メインエリア --- */}
      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative text-base">
        {view === "setup" && (
          <div className="max-w-xl mx-auto w-full p-6 space-y-6 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-indigo-600 text-xs font-black uppercase rounded-full mb-2 tracking-widest border border-indigo-100 shadow-sm">
                <Globe size={12} /> {selectedProfile.name} Mode
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-1">
                手動マッチング設定
              </h1>
              <p className="text-sm text-slate-500 font-medium tracking-tight">
                項目を選択して、あなたの仮面に共鳴する相手を手動で探しましょう。
              </p>
            </div>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center px-6">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  マッチングで比較する項目
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAllCategories(true)}
                    className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    全部ON
                  </button>
                  <button
                    onClick={() => setAllCategories(false)}
                    className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    全部OFF
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-50">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full group flex items-center justify-between p-3.5 px-6 hover:bg-slate-50 transition-colors text-left"
                    title={`${cat.label}を比較対象に含める`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg transition-colors ${selectedCategories.includes(cat.id) ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}
                      >
                        {React.cloneElement(cat.icon, { size: 16 })}
                      </div>
                      <span
                        className={`text-sm font-bold ${selectedCategories.includes(cat.id) ? "text-slate-800" : "text-slate-400"}`}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div
                      className={
                        selectedCategories.includes(cat.id)
                          ? "text-indigo-600"
                          : "text-slate-200"
                      }
                    >
                      {selectedCategories.includes(cat.id) ? (
                        <CheckSquare
                          size={20}
                          fill="currentColor"
                          className="text-white fill-indigo-600"
                        />
                      ) : (
                        <Circle size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4 px-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    マッチ人数設定
                  </label>
                  <span className="bg-white px-3 py-0.5 rounded-full border border-slate-200 text-sm font-black text-indigo-600 shadow-sm">
                    {matchCount}人
                  </span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={matchCount}
                    onChange={(e) => setMatchCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </section>

            <button
              onClick={startMatching}
              disabled={selectedCategories.length === 0}
              className={`w-full py-4 rounded-xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95 ${
                selectedCategories.length > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Play fill="currentColor" size={20} /> マッチングを開始
            </button>
          </div>
        )}

        {view === "matching" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 tracking-tighter uppercase mb-1">
                Analyzing...
              </h2>
              <p className="text-sm text-slate-400 font-medium italic">
                「{selectedProfile.name}」として最適な相手を手動探索中
              </p>
            </div>
          </div>
        )}

        {view === "prompt" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-8 max-w-lg w-full">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Search size={32} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  {currentCandidates.length}人が候補として見つかりました
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setView("compare");
                    if (currentCandidates.length > 0)
                      setSelectedMatchedUserId(currentCandidates[0].id);
                  }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  <ArrowRightLeft size={18} /> 一人一人見ていく
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAllAction("watch")}
                    className="py-3.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all border border-indigo-100"
                  >
                    <Eye size={18} /> 全員ウォッチに追加
                  </button>
                  <button
                    onClick={() => handleAllAction("follow")}
                    className="py-3.5 bg-green-50 text-green-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-all border border-green-100"
                  >
                    <UserCheck size={18} /> 全員フォローする
                  </button>
                </div>
                <button
                  onClick={() => setView("setup")}
                  className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <LayoutDashboard size={18} /> トップに戻る
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "compare" && (
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
            {/* 比較操作パネル */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col gap-3 shrink-0 shadow-sm z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => setView("setup")}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-indigo-600 shrink-0"
                    title="トップに戻る"
                  >
                    <LayoutDashboard size={20} />
                  </button>
                  <h2 className="font-black text-slate-800 flex items-center gap-2 text-xl tracking-tight truncate">
                    <Split className="text-indigo-600 shrink-0" size={18} />{" "}
                    手動比較
                  </h2>
                </div>

                {comparingUser && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        handleConfirmAction(comparingUser.id, "follow")
                      }
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow shadow-indigo-100 whitespace-nowrap shrink-0"
                    >
                      <UserPlus size={16} /> <span>フォローする</span>
                    </button>
                    <button
                      onClick={() =>
                        handleConfirmAction(comparingUser.id, "watch")
                      }
                      className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm border border-indigo-200 transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
                    >
                      <Eye size={16} /> <span>ウォッチする</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 比較フィルタ：選択状態をさらに目立たせるように変更 */}
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-fit">
                <div className="flex items-center gap-2 px-3 border-r border-slate-200">
                  <Settings2 size={12} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    比較フィルタ
                  </span>
                </div>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCategory(c.id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                      selectedCategories.includes(c.id)
                        ? "bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-100"
                        : "bg-slate-100 text-slate-400 border-transparent hover:bg-slate-200 hover:text-slate-600"
                    }`}
                  >
                    {/* アイコンを表示して識別しやすく */}
                    {React.cloneElement(c.icon, { size: 14 })}
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {comparingUser ? (
                <div className="flex flex-col gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-lg max-w-5xl mx-auto">
                  <div className="grid grid-cols-2 bg-slate-50">
                    <div className="p-6 border-r border-slate-200 flex items-center gap-4">
                      <div className="text-6xl drop-shadow-sm transition-transform hover:scale-110 duration-300">
                        {selectedProfile.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 bg-indigo-50 w-fit px-2 py-0.5 rounded-full truncate">
                          YOUR PERSONA
                        </div>
                        <div className="text-xl font-black text-slate-900 truncate">
                          {selectedProfile.name}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white flex items-center gap-4">
                      <div
                        className={`w-16 h-16 ${comparingUser.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner transition-transform hover:rotate-3 duration-300`}
                      >
                        👤
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em] mb-1 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                          MATCH CANDIDATE
                        </div>
                        <div className="text-xl font-black text-slate-900 truncate">
                          {comparingUser.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((catId) => {
                      const { common, onlyMe, onlyPartner } = compareItems(
                        selectedProfile[catId as CategoryKey],
                        comparingUser[catId as CategoryKey]
                      );
                      const catInfo = CATEGORIES.find((c) => c.id === catId);
                      if (!catInfo) return null;

                      return (
                        <div
                          key={catId}
                          className="grid grid-cols-2 bg-slate-100 group"
                        >
                          <div className="bg-slate-50/80 p-6 border-r border-slate-200 space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                              {catInfo.icon} {catInfo.label}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {common.map((item) => (
                                <span
                                  key={item}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                >
                                  <Check size={12} /> {item}
                                </span>
                              ))}
                              {onlyMe.map((item) => (
                                <span
                                  key={item}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-semibold"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white p-6 space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-green-600 transition-colors flex items-center gap-2">
                              {catInfo.icon} {catInfo.label}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {common.map((item) => (
                                <span
                                  key={item}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                                >
                                  <Check size={12} /> {item}
                                </span>
                              ))}
                              {onlyPartner.map((item) => (
                                <span
                                  key={item}
                                  className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm"
                                >
                                  <Plus size={12} /> {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 py-16 bg-white text-center text-slate-300 font-bold italic text-sm">
                      表示する項目を上のフィルターから選択してください
                    </div>
                  )}
                </div>
              ) : currentCandidates.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle size={48} className="text-slate-200" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-slate-800 mb-2">
                      ALL MATCHED
                    </h3>
                    <p className="text-sm font-bold text-slate-400">
                      全ての候補者の確認が完了しました
                    </p>
                  </div>
                  <button
                    onClick={() => setView("setup")}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                  >
                    <LayoutDashboard size={20} /> トップに戻る
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <ArrowRightLeft size={64} className="mb-4 opacity-10" />
                  <p className="font-bold text-sm tracking-widest uppercase text-slate-400">
                    右側の候補リストから相手を選択して比較を開始
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- 右：マッチング候補リスト (折りたたみ可能) --- */}
      <aside
        className={`${isRightSidebarCollapsed ? "w-20" : "w-72"} bg-white border-l border-slate-200 flex flex-col shrink-0 transition-all duration-300 relative`}
      >
        <button
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          className="absolute -left-3 top-6 bg-white border border-slate-200 rounded-full p-1 shadow-sm z-10 hover:bg-slate-50 transition-colors"
        >
          {isRightSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>

        <div
          className={`p-4 border-b border-slate-100 bg-slate-50/50 ${isRightSidebarCollapsed ? "text-center" : ""}`}
        >
          <div
            className={`flex items-center gap-2 ${isRightSidebarCollapsed ? "justify-center" : "justify-between"} mb-0.5`}
          >
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={14} />{" "}
              {!isRightSidebarCollapsed && "Candidate List"}
            </h2>
            {currentCandidates.length > 0 && (
              <span
                className={`text-[10px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full ${isRightSidebarCollapsed ? "hidden" : ""}`}
              >
                {currentCandidates.length}
              </span>
            )}
          </div>
          {!isRightSidebarCollapsed && (
            <p className="text-xs text-slate-400 font-medium truncate tracking-tight italic">
              Matched with {selectedProfile.name}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {currentCandidates.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setSelectedMatchedUserId(user.id);
                if (view !== "compare") setView("compare");
              }}
              className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-start gap-3 ${
                selectedMatchedUserId === user.id
                  ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm"
                  : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
              } ${isRightSidebarCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`w-8 h-8 ${user.color} rounded-lg flex items-center justify-center text-white text-sm shrink-0 shadow-sm`}
              >
                👤
              </div>
              {!isRightSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{user.name}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.values.slice(0, 2).map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};
