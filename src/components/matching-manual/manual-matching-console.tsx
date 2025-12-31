/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Search,
  Filter,
  User,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  MoreHorizontal,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  AlertCircle,
  Moon,
  Sun,
  Loader2,
  Check,
  BookOpen,
  Tv,
  Music,
  Sparkles,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";

// --- Types & Interfaces (Based on Data Model) ---

type Work = {
  category: "comic" | "movie" | "book" | "music" | "game";
  title: string;
};

type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  location: string;
  occupation: string; // Keep for basic info, but deemphasize in comparison
  income: string;
  hobbies: string[];
  bio: string;
  photoUrl: string;
  tags: string[];
  matchStatus: "pending" | "matched" | "searching";
  compatibilityScore?: number;
  manualPriority: number;

  // New fields for deep comparison
  favoriteWorks: Work[];
  values: string[]; // e.g., "連絡はマメに", "一人の時間も大切"
};

type MatchRecord = {
  id: string;
  subjectId: string;
  targetId: string;
  status: "draft" | "approved" | "rejected";
  createdAt: string;
};

// --- Mock Data (Updated with Works and Values) ---

const MOCK_SUBJECTS: UserProfile[] = [
  {
    id: "sub-001",
    name: "佐藤 健太",
    age: 28,
    gender: "male",
    location: "東京都 渋谷区",
    occupation: "ITエンジニア",
    income: "600-800万円",
    hobbies: ["映画鑑賞", "キャンプ"],
    bio: "都内でエンジニアをしています。休日はカフェ巡りやキャンプに行くのが好きです。",
    photoUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Kenta&backgroundColor=b6e3f4",
    tags: ["初婚", "土日休み"],
    matchStatus: "searching",
    manualPriority: 1,
    favoriteWorks: [
      { category: "comic", title: "ONE PIECE" },
      { category: "comic", title: "宇宙兄弟" },
      { category: "movie", title: "インセプション" },
      { category: "game", title: "ゼルダの伝説" },
    ],
    values: [
      "仕事より家庭優先",
      "隠し事はしない",
      "週末はアクティブに",
      "金銭感覚は堅実",
    ],
  },
  {
    id: "sub-002",
    name: "田中 美咲",
    age: 32,
    gender: "female",
    location: "神奈川県 横浜市",
    occupation: "薬剤師",
    income: "500-700万円",
    hobbies: ["ヨガ", "旅行"],
    bio: "仕事も落ち着いてきたので、将来を見据えたパートナーを探しています。",
    photoUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Misaki&backgroundColor=ffdfbf",
    tags: ["初婚", "ペット可"],
    matchStatus: "searching",
    manualPriority: 2,
    favoriteWorks: [
      { category: "movie", title: "ラ・ラ・ランド" },
      { category: "book", title: "ハリー・ポッター" },
      { category: "comic", title: "スラムダンク" },
    ],
    values: [
      "一人の時間も大切",
      "食の好みが合う",
      "ありがとうを言葉にする",
      "記念日を祝う",
    ],
  },
];

const MOCK_CANDIDATES: UserProfile[] = [
  {
    id: "cand-101",
    name: "伊藤 麻衣",
    age: 26,
    gender: "female",
    location: "東京都 目黒区",
    occupation: "デザイナー",
    income: "400-600万円",
    hobbies: ["美術館巡り", "カフェ"],
    bio: "デザイン関係の仕事をしています。感性が合う方とお話したいです。",
    photoUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai&backgroundColor=ffdfbf",
    tags: ["初婚", "インドア派"],
    matchStatus: "searching",
    compatibilityScore: 88,
    manualPriority: 0,
    favoriteWorks: [
      { category: "comic", title: "宇宙兄弟" }, // Match with Kenta
      { category: "movie", title: "グレイテスト・ショーマン" },
      { category: "game", title: "あつまれ どうぶつの森" },
    ],
    values: [
      "仕事より家庭優先",
      "嘘をつかない",
      "週末はのんびり",
      "記念日を祝う",
    ], // Match partial
  },
  {
    id: "cand-102",
    name: "高橋 優子",
    age: 30,
    gender: "female",
    location: "東京都 新宿区",
    occupation: "看護師",
    income: "500-600万円",
    hobbies: ["料理", "ランニング"],
    bio: "明るい性格と言われます。一緒に美味しいご飯を食べられる人が好きです。",
    photoUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuko&backgroundColor=ffdfbf",
    tags: ["初婚", "料理好き"],
    matchStatus: "searching",
    compatibilityScore: 92,
    manualPriority: 0,
    favoriteWorks: [
      { category: "comic", title: "ONE PIECE" }, // Match with Kenta
      { category: "game", title: "ゼルダの伝説" }, // Match with Kenta
      { category: "movie", title: "ジブリ作品" },
    ],
    values: [
      "週末はアクティブに",
      "金銭感覚は堅実",
      "隠し事はしない",
      "食事が楽しみ",
    ], // High match with Kenta
  },
  {
    id: "cand-103",
    name: "渡辺 浩二",
    age: 35,
    gender: "male",
    location: "埼玉県 さいたま市",
    occupation: "公務員",
    income: "500-700万円",
    hobbies: ["読書", "ドライブ"],
    bio: "真面目な性格です。安定した家庭を築きたいと思っています。",
    photoUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Koji&backgroundColor=b6e3f4",
    tags: ["初婚", "誠実"],
    matchStatus: "searching",
    compatibilityScore: 75,
    manualPriority: 0,
    favoriteWorks: [
      { category: "book", title: "東野圭吾作品" },
      { category: "movie", title: "スターウォーズ" },
    ],
    values: ["仕事は真面目に", "一人の時間も大切", "記念日を祝う"],
  },
];

// --- Simulated Supabase Client Wrapper ---

const supabase = {
  from: (table: string) => {
    return {
      select: async (query: string = "*") => {
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (table === "match_candidates_view") {
          return { data: MOCK_SUBJECTS, error: null };
        }
        if (table === "candidates_pool") {
          return { data: MOCK_CANDIDATES, error: null };
        }
        return { data: [], error: null };
      },
      insert: async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        // console.log("Insert to", table, data);
        return { data: { ...data, id: "new-id-" + Date.now() }, error: null };
      },
    };
  },
};

// --- Components ---

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive" | "success";
  className?: string;
}) => {
  const variants = {
    default:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200",
    secondary:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-200",
    outline:
      "bg-transparent text-slate-600 dark:text-slate-400 border-slate-300",
    destructive:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const UserCard = ({
  user,
  isSelected,
  onClick,
  compact = false,
}: {
  user: UserProfile;
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border cursor-pointer transition-all duration-200
        ${
          isSelected
            ? "bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-400"
            : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <img
          src={user.photoUrl}
          alt={user.name}
          className="w-12 h-12 rounded-full bg-slate-100 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.name}
            </h4>
            {user.compatibilityScore && (
              <span
                className={`text-xs font-bold ${user.compatibilityScore > 90 ? "text-green-600" : "text-slate-500"}`}
              >
                {user.compatibilityScore}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.age}歳 • {user.location}
          </p>
          {!compact && (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              <span className="font-medium mr-1">好き:</span>
              {user.favoriteWorks.map((w) => w.title).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Icon helper for works
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "book":
      return <BookOpen size={14} />;
    case "movie":
      return <Tv size={14} />;
    case "music":
      return <Music size={14} />;
    case "game":
      return <Zap size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
  </div>
);

export default function ManualMatchingConsole() {
  const [darkMode, setDarkMode] = useState(false);

  // State: Data
  const [subjects, setSubjects] = useState<UserProfile[]>([]);
  const [candidates, setCandidates] = useState<UserProfile[]>([]);

  // State: Selection
  const [selectedSubject, setSelectedSubject] = useState<UserProfile | null>(
    null
  );
  const [selectedCandidate, setSelectedCandidate] =
    useState<UserProfile | null>(null);

  // State: Loading & UI
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchComment, setMatchComment] = useState("");
  const [isProcessingMatch, setIsProcessingMatch] = useState(false);

  // Effect: Fetch Subjects on Mount
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const { data } = await supabase
          .from("match_candidates_view")
          .select("*");
        if (data) setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    void fetchSubjects();
  }, []);

  // Effect: Fetch Candidates when Subject selected
  useEffect(() => {
    if (!selectedSubject) {
      setCandidates([]);
      return;
    }

    const fetchCandidates = async () => {
      setIsLoadingCandidates(true);
      try {
        const { data } = await supabase.from("candidates_pool").select("*");
        if (data) {
          // Simple filter for demo
          const filtered = data.filter(
            (c) =>
              (selectedSubject.gender === "male" && c.gender === "female") ||
              (selectedSubject.gender === "female" && c.gender === "male")
          );
          setCandidates(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch candidates", error);
      } finally {
        setIsLoadingCandidates(false);
      }
    };
    void fetchCandidates();
  }, [selectedSubject]);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Logic: Calculate intersections
  const comparisonData = useMemo(() => {
    if (!selectedSubject || !selectedCandidate) return null;

    // Common works
    const commonWorks = selectedSubject.favoriteWorks.filter((sWork) =>
      selectedCandidate.favoriteWorks.some(
        (cWork) => cWork.title === sWork.title
      )
    );

    const subjectUniqueWorks = selectedSubject.favoriteWorks.filter(
      (sWork) =>
        !selectedCandidate.favoriteWorks.some(
          (cWork) => cWork.title === sWork.title
        )
    );

    const candidateUniqueWorks = selectedCandidate.favoriteWorks.filter(
      (cWork) =>
        !selectedSubject.favoriteWorks.some(
          (sWork) => sWork.title === cWork.title
        )
    );

    // Common values
    const commonValues = selectedSubject.values.filter((sVal) =>
      selectedCandidate.values.includes(sVal)
    );

    const subjectUniqueValues = selectedSubject.values.filter(
      (sVal) => !selectedCandidate.values.includes(sVal)
    );
    const candidateUniqueValues = selectedCandidate.values.filter(
      (cVal) => !selectedSubject.values.includes(cVal)
    );

    return {
      commonWorks,
      subjectUniqueWorks,
      candidateUniqueWorks,
      commonValues,
      subjectUniqueValues,
      candidateUniqueValues,
    };
  }, [selectedSubject, selectedCandidate]);

  // Handle Match Execution
  const handleExecuteMatch = async () => {
    if (!selectedSubject || !selectedCandidate) return;
    setIsProcessingMatch(true);
    try {
      await supabase.from("manual_matches").insert({
        subject_id: selectedSubject.id,
        target_id: selectedCandidate.id,
        comment: matchComment,
        status: "draft",
        created_at: new Date().toISOString(),
      });
      alert(
        `マッチング成功!\n${selectedSubject.name} さんと ${selectedCandidate.name} さんをマッチングしました。`
      );
      setIsMatchModalOpen(false);
      setMatchComment("");
    } catch (error) {
      console.error("Match failed", error);
      alert("マッチング処理に失敗しました。");
    } finally {
      setIsProcessingMatch(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Header */}
      <header className="h-16 border-b px-6 flex items-center justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-lg font-bold tracking-tight">
            Manual Matching Console
          </h1>
          <Badge variant="secondary" className="ml-2">
            Deep Match Mode
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Column 1: Subject Selection */}
        <section className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <User size={16} />
              対象会員
            </h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="名前検索..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {isLoadingSubjects ? (
              <LoadingSpinner />
            ) : (
              subjects.map((subject) => (
                <UserCard
                  key={subject.id}
                  user={subject}
                  isSelected={selectedSubject?.id === subject.id}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedCandidate(null);
                  }}
                />
              ))
            )}
          </div>
        </section>

        {/* Column 2: Candidate Search */}
        <section className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-950/30">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Filter size={16} />
              候補者リスト
            </h2>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border rounded hover:bg-slate-50">
                全表示
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-sm">
                作品一致
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {!selectedSubject ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                対象を選択してください
              </div>
            ) : isLoadingCandidates ? (
              <LoadingSpinner />
            ) : (
              candidates.map((candidate) => (
                <UserCard
                  key={candidate.id}
                  user={candidate}
                  isSelected={selectedCandidate?.id === candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  compact
                />
              ))
            )}
          </div>
        </section>

        {/* Column 3: Value & Work Comparison (The Main Update) */}
        <section className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto">
          {!selectedSubject || !selectedCandidate || !comparisonData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                価値観・作品マッチング
              </h3>
              <p className="text-sm">両者を選択して共通点を確認します</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-950 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">共通の作品</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {comparisonData.commonWorks.length}{" "}
                      <span className="text-xs text-slate-400">件</span>
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">
                      一致した価値観
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {comparisonData.commonValues.length}{" "}
                      <span className="text-xs text-slate-400">個</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMatchModalOpen(true)}
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  このペアで確定
                </button>
              </div>

              <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
                {/* 1. Header with Photos */}
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <img
                      src={selectedSubject.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 mb-2"
                    />
                    <div className="font-bold text-sm">
                      {selectedSubject.name}
                    </div>
                  </div>
                  <div className="text-slate-300 dark:text-slate-700 text-2xl font-light">
                    ×
                  </div>
                  <div className="text-center">
                    <img
                      src={selectedCandidate.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border-2 border-pink-500 mb-2"
                    />
                    <div className="font-bold text-sm">
                      {selectedCandidate.name}
                    </div>
                  </div>
                </div>

                {/* 2. Work Compatibility Section (Emphasis on Shared) */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BookOpen size={16} /> 好きな作品・コンテンツ
                  </h3>

                  {/* Common Works (Center Stage) */}
                  {comparisonData.commonWorks.length > 0 ? (
                    <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
                      <div className="text-center text-xs font-bold text-indigo-500 mb-3 uppercase tracking-wide">
                        二人の共通点
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {comparisonData.commonWorks.map((work, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 rounded-lg border border-indigo-200 dark:border-indigo-800"
                          >
                            {getCategoryIcon(work.category)}
                            <span className="font-bold">{work.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 text-sm mb-6 py-4 border-b border-dashed border-slate-300 dark:border-slate-700">
                      共通の作品はまだ見つかっていません
                    </div>
                  )}

                  {/* Individual Works (Side by Side) */}
                  <div className="grid grid-cols-2 gap-8 relative">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 dark:bg-slate-700 transform -translate-x-1/2"></div>

                    {/* Subject Works */}
                    <div className="pr-4">
                      <div className="text-xs text-blue-500 font-bold mb-2 text-right">
                        {selectedSubject.name} のお気に入り
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        {comparisonData.subjectUniqueWorks.map((work, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300"
                          >
                            <span className="opacity-50">
                              {getCategoryIcon(work.category)}
                            </span>
                            {work.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Works */}
                    <div className="pl-4">
                      <div className="text-xs text-pink-500 font-bold mb-2">
                        {selectedCandidate.name} のお気に入り
                      </div>
                      <div className="flex flex-wrap justify-start gap-2">
                        {comparisonData.candidateUniqueWorks.map((work, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-600 dark:text-slate-300"
                          >
                            <span className="opacity-50">
                              {getCategoryIcon(work.category)}
                            </span>
                            {work.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Values Section (Visual Comparison) */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Heart size={16} /> 大切にしている価値観
                  </h3>

                  <div className="flex flex-col gap-6">
                    {/* Matched Values */}
                    <div className="flex items-start">
                      <div className="w-24 text-xs font-bold text-green-600 pt-2">
                        一致
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {comparisonData.commonValues.length > 0 ? (
                          comparisonData.commonValues.map((val, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-sm font-bold border border-green-200 dark:border-green-800"
                            >
                              {val}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-sm py-1.5">
                            完全一致する価値観タグはありません
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subject Values */}
                    <div className="flex items-start">
                      <div className="w-24 text-xs font-bold text-blue-500 pt-2 truncate pr-2">
                        {selectedSubject.name}
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {comparisonData.subjectUniqueValues.map((val, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-sm border border-slate-200 dark:border-slate-700"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Candidate Values */}
                    <div className="flex items-start">
                      <div className="w-24 text-xs font-bold text-pink-500 pt-2 truncate pr-2">
                        {selectedCandidate.name}
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {comparisonData.candidateUniqueValues.map((val, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-sm border border-slate-200 dark:border-slate-700"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Basic Info (De-emphasized) */}
                <div className="opacity-60 hover:opacity-100 transition-opacity">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    基本情報の確認
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-white dark:bg-slate-900 p-4 border rounded-lg">
                    <div className="text-right border-r pr-4">
                      <div className="text-slate-500">
                        {selectedSubject.occupation}
                      </div>
                      <div className="text-slate-500">
                        {selectedSubject.income}
                      </div>
                    </div>
                    <div className="pl-4">
                      <div className="text-slate-500">
                        {selectedCandidate.occupation}
                      </div>
                      <div className="text-slate-500">
                        {selectedCandidate.income}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Match Confirmation Modal */}
      {isMatchModalOpen && selectedSubject && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-indigo-600" />
                マッチングの確定
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                共通の作品{" "}
                <strong className="text-indigo-600">
                  {comparisonData?.commonWorks.length}件
                </strong>
                、 一致する価値観{" "}
                <strong className="text-green-600">
                  {comparisonData?.commonValues.length}個
                </strong>
                <br />
                このペアリングを確定しますか？
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  コンシェルジュコメント
                </label>
                <textarea
                  className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-24 resize-none"
                  placeholder="「〇〇（作品名）の話で盛り上がれそうです」など..."
                  value={matchComment}
                  onChange={(e) => setMatchComment(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
                disabled={isProcessingMatch}
              >
                キャンセル
              </button>
              <button
                onClick={handleExecuteMatch}
                disabled={isProcessingMatch}
                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm flex items-center gap-2"
              >
                {isProcessingMatch ? "処理中..." : "確定する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
