"use client";

import {
  User,
  Users,
  Sparkles,
  Monitor,
  Smile,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Heart,
  MessageCircle,
  Search,
  Gamepad2,
  Star,
  Shield,
  BookOpen,
  Plus,
  Trash2,
  Trophy,
  Info,
  RefreshCw,
  HelpCircle,
  X,
  ExternalLink,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  generateUniqueCandidates,
  CONSTELLATIONS,
  getZodiacSymbol,
} from "@/lib/anonymous-name-generator";

// --- Data & Constants ---

const USER_TYPES = [
  {
    id: "SELF",
    title: "本人 (SELF)",
    subtitle: "「あなた自身の仮面」を作成します。",
    description:
      "最も標準的なプロフィールです。あなた自身の経歴、性格、ステータスを登録し、システム内でのあなたの「顔」となるプロフィールを作成します。",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: "INTERVIEW",
    title: "インタビュー (INTERVIEW)",
    subtitle: "直接対話を通じて、「相手の仮面」を作成します。",
    description:
      "実際に相手と話して本人から直接回答を得てプロフィールを作ります。(直接本人から聞いてない場合は心象プロフィール (IMAGINED)で作成してください。)",
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    id: "IMAGINED",
    title: "心象プロフィール (IMAGINED)",
    subtitle:
      "間接的な情報や想像から、人物像を構築し「相手の仮面」を作成します。",
    description:
      "ニュース、SNSなど間接的に得られる「断片的な外部情報」を元にあなたの解釈や想像力で「あなたから見たその人」のプロフィールを作ります。",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "IDEAL",
    title: "理想像 (IDEAL)",
    subtitle:
      "求めている人物像やこうありたいという理想をプロフィール化して「理想の仮面」を作成します",
    description: "理想的なプロフィールを作成します。",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "AI_DUMMY",
    title: "AIダミー生成 (AI DUMMY)",
    subtitle: "テスト用にランダムなデータで「ダミーの仮面」を生成します。",
    description:
      "デザインの確認や動作テストのために、AIが架空のプロフィール（名前、画像、設定）を自動生成してプロフィール項目を埋めます。",
    icon: <Monitor className="w-6 h-6" />,
  },
];

const PURPOSES = [
  {
    id: "create_work",
    label: "創る・働く",
    icon: <Briefcase className="w-4 h-4" />,
  },
  { id: "play", label: "遊ぶ", icon: <Gamepad2 className="w-4 h-4" /> },
  {
    id: "partner",
    label: "パートナー探し",
    icon: <Heart className="w-4 h-4" />,
  },
  { id: "consult", label: "相談", icon: <MessageCircle className="w-4 h-4" /> },
  { id: "other", label: "その他", icon: <Plus className="w-4 h-4" /> },
];

const WORK_CATEGORIES = ["漫画", "アニメ"];

const ERAS = ["2020年代", "2010年代", "2000年代", "1990年代以前"];

const VALUE_QUESTIONS = [
  {
    id: "v1",
    category: "基本",
    title: "人生で最も大切にしているものは？",
    relatedPurposes: [], // Common
    tags: ["人生観", "優先順位"],
    choices: [
      { id: "c1", label: "家族との時間" },
      { id: "c2", label: "仕事での成功" },
      { id: "c3", label: "個人の自由" },
      { id: "c4", label: "社会への貢献" },
      { id: "c5", label: "富・財産" },
    ],
    infoBlocks: [
      {
        title: "マズローの欲求5段階説",
        url: "https://example.com/maslow",
        comment: "自己実現欲求との関連性を考えてみましょう。",
      },
    ],
    relatedIds: ["v2", "v3"],
  },
  {
    id: "v2",
    category: "仕事",
    title: "仕事における理想の状態は？",
    relatedPurposes: ["create_work", "consult"],
    tags: ["キャリア", "働き方"],
    choices: [
      { id: "c1", label: "高い報酬を得ること" },
      { id: "c2", label: "やりがいを感じること" },
      { id: "c3", label: "ワークライフバランス" },
      { id: "c4", label: "スキルアップ・成長" },
    ],
    infoBlocks: [],
    relatedIds: ["v1"],
  },
  {
    id: "v3",
    category: "人間関係",
    title: "パートナーに求める最も重要な要素は？",
    relatedPurposes: ["partner", "consult"],
    tags: ["恋愛", "パートナーシップ"],
    choices: [
      { id: "c1", label: "価値観の一致" },
      { id: "c2", label: "経済的な安定" },
      { id: "c3", label: "優しさ・思いやり" },
      { id: "c4", label: "容姿・スタイル" },
    ],
    infoBlocks: [],
    relatedIds: ["v1"],
  },
  {
    id: "v4",
    category: "趣味",
    title: "休日の過ごし方で最も優先するものは？",
    relatedPurposes: ["play", "other"],
    tags: ["ライフスタイル", "趣味"],
    choices: [
      { id: "c1", label: "一人で没頭する時間" },
      { id: "c2", label: "友人とワイワイ過ごす" },
      { id: "c3", label: "新しい体験・旅行" },
      { id: "c4", label: "家でゆっくり休む" },
    ],
    infoBlocks: [],
    relatedIds: [],
  },
];

// --- Dummy Data Generator ---
const generateDummyWorks = () => {
  const dummyWorks = [];
  const titles = [
    "冒険の旅",
    "未来戦記",
    "青春白書",
    "魔法学園",
    "宇宙開拓史",
    "日常の風景",
    "猫とロボット",
    "無限回廊",
    "英雄伝説",
    "星の記憶",
  ];
  const modifiers = [
    "ZERO",
    "GT",
    "改",
    "Re:",
    "Another",
    "Final",
    "Origins",
    "2024",
    "X",
    "SS",
  ];
  const authors = [
    "山田太郎",
    "鈴木一郎",
    "佐藤花子",
    "スタジオA",
    "Project B",
    "田中次郎",
    "高橋美咲",
    "W.Smith",
    "Team X",
    "Unknown",
  ];
  const tagsList = [
    "感動",
    "バトル",
    "恋愛",
    "日常",
    "SF",
    "ファンタジー",
    "ホラー",
    "ミステリー",
    "スポーツ",
    "歴史",
  ];

  for (let i = 1; i <= 100; i++) {
    const titleBase = titles[Math.floor(Math.random() * titles.length)];
    const modifier =
      Math.random() > 0.5
        ? modifiers[Math.floor(Math.random() * modifiers.length)]
        : "";
    const title = `${titleBase} ${modifier} ${i}`;
    const category = Math.random() > 0.5 ? "漫画" : "アニメ";
    const author = authors[Math.floor(Math.random() * authors.length)];
    const era = ERAS[Math.floor(Math.random() * ERAS.length)];

    // Pick 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const workTags = [];
    const availableTags = [...tagsList];
    for (let j = 0; j < numTags; j++) {
      if (availableTags.length === 0) break;
      const tagIndex = Math.floor(Math.random() * availableTags.length);
      workTags.push(availableTags[tagIndex]);
      availableTags.splice(tagIndex, 1);
    }

    dummyWorks.push({
      id: i,
      title: title,
      category: category,
      isBest: false,
      author: author,
      tags: workTags,
      era: era,
    });
  }
  return dummyWorks;
};

// --- Components ---

interface Step {
  id: number;
  label: string;
  desc: string;
}

const StepIndicator = ({
  currentStep,
  steps,
  onStepClick,
}: {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepId: number) => void;
}) => {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full shrink-0 pt-10 px-6 hidden md:flex">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          プロフィールの作成
        </h1>
        <p className="text-xs text-slate-500 mt-1">New User Registration</p>
      </div>
      <div className="space-y-8 relative">
        {/* Connection Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 -z-10" />

        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div
              key={step.id}
              className="flex items-start group cursor-pointer"
              onClick={() => onStepClick(step.id)}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-300 z-10
                  ${
                    isActive
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-slate-300 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-400"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="ml-4 pt-1">
                <p
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : isCompleted
                        ? "text-green-600"
                        : "text-slate-500 group-hover:text-slate-700"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface MasterWork {
  id: number;
  title: string;
  category: string;
  author: string;
  tags: string[];
  era: string;
}

type Period = "LIFE" | "NOW" | "FUTURE";

interface FavWork extends MasterWork {
  period: Period;
  isBest: boolean;
  tier: 1 | 2 | 3 | "normal" | null;
}

const RatingHelpModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">評価の基準について</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-600 text-white font-bold text-xs shadow-sm">
                T1
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">
                  最も好きな作品
                </p>
                <p className="text-xs text-slate-500">
                  人生に影響を与えた、特別な作品。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-indigo-500 text-white font-bold text-xs shadow-sm">
                T2
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">
                  非常に好きな作品
                </p>
                <p className="text-xs text-slate-500">
                  何度も見返したくなる作品
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-teal-500 text-white font-bold text-xs shadow-sm">
                T3
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">好きな作品</p>
                <p className="text-xs text-slate-500">
                  普通に面白い、また見たい作品。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-slate-400 text-white font-bold text-xs shadow-sm">
                普通
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">
                  普通 / 合わない
                </p>
                <p className="text-xs text-slate-500">
                  普通もしくは自分に合わなかった作品。LIKE対象外。
                </p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function UserProfileCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [masterWorks, setMasterWorks] = useState<MasterWork[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [ratingType, setRatingType] = useState<"LIKE" | "TIER">("LIKE");
  const [activePeriod, setActivePeriod] = useState<Period>("NOW");
  const [showRatingHelp, setShowRatingHelp] = useState(false);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hideAnswered, setHideAnswered] = useState(false); // Toggle to hide answered questions
  const [showAllQuestions, setShowAllQuestions] = useState(false); // Toggle to ignore purpose filter
  const [valueSelections, setValueSelections] = useState<
    Record<string, string[]>
  >({}); // questionId -> choiceIds
  const [valueTiers, setValueTiers] = useState<Record<string, number>>({}); // questionId -> tier (1,2,3)
  const [activePurposeFilter, setActivePurposeFilter] = useState("RECOMMENDED"); // Deprecated, but keeping line for replacement target match if needed? No, just replacing.
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Accordion state for Step 5

  // Step 5: Manual Add/Remove State
  const [addedQuestionIds, setAddedQuestionIds] = useState<string[]>([]);
  const [removedQuestionIds, setRemovedQuestionIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    role: "Leader",
    type: "SELF",
    purposes: ["create_work"] as string[],
    zodiac: "獅子座",
    displayName: "",
    nameCandidates: [] as string[],
    ownWorks: [] as { id: number; title: string; url: string }[],
    favWorks: [] as FavWork[],
    valuesAnswer: "",
  });

  // Initialize Master DB
  useEffect(() => {
    setMasterWorks(generateDummyWorks());
  }, []);

  // Update formData.favWorks when masterWorks changes (if we want to sync edits? Maybe not needed for simple proto)
  // For now, let's keep them separate, but when adding from Master, we copy.

  // History Management for Candidates
  const [candidateHistory, setCandidateHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Helper for form updates
  const handleValueSelection = (questionId: string, choiceId: string) => {
    setValueSelections((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(choiceId)) {
        return {
          ...prev,
          [questionId]: current.filter((id) => id !== choiceId),
        };
      } else {
        return { ...prev, [questionId]: [...current, choiceId] };
      }
    });
  };

  const toggleValueTier = (questionId: string, tier?: number) => {
    setValueTiers((prev) => {
      const currentTier = prev[questionId];
      // If specific tier request
      if (tier !== undefined) {
        if (currentTier === tier) {
          const { [questionId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [questionId]: tier };
      }
      // Toggle Heart (Tier 1) logic
      if (currentTier) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      } else {
        return { ...prev, [questionId]: 1 };
      }
    });
  };

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Effect to generate initial candidates when zodiac is selected
  useEffect(() => {
    if (formData.zodiac) {
      // Reset history when Zodiac changes
      const initialCandidates = generateUniqueCandidates(formData.zodiac, 3);
      updateForm("nameCandidates", initialCandidates);
      // Auto-select first
      if (initialCandidates.length > 0) {
        updateForm("displayName", initialCandidates[0]);
      }
      setCandidateHistory([initialCandidates]);
      setHistoryIndex(0);
    }
  }, [formData.zodiac]);

  const handleGenerateCandidates = (zodiac: string) => {
    // Collect all generated names in history to avoid immediate duplicates
    const recentNames = candidateHistory.flat();

    // Generate 3 new ones excluding recentNames
    const newCandidates = generateUniqueCandidates(zodiac, 3, recentNames);

    updateForm("nameCandidates", newCandidates);
    if (newCandidates.length > 0) updateForm("displayName", newCandidates[0]);

    // Update History:
    // If we are in the middle of history (due to Undo), we discard the "future"
    const newHistory = candidateHistory.slice(0, historyIndex + 1);

    setCandidateHistory([...newHistory, newCandidates]);
    setHistoryIndex(newHistory.length); // Index of the new item
  };

  const handleUndoCandidates = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevCandidates = candidateHistory[prevIndex];
      updateForm("nameCandidates", prevCandidates);
      // Restore selection to first of previous set just to be safe, or keep current if it matches?
      // Better to select the first one again or keep logical selection if available.
      // For simplicity, select the first one of the restored set.
      if (prevCandidates.length > 0)
        updateForm("displayName", prevCandidates[0]);

      setHistoryIndex(prevIndex);
    }
  };

  const togglePurpose = (id: string) => {
    setFormData((prev) => {
      const exists = prev.purposes.includes(id);
      if (exists && prev.purposes.length <= 1) return prev; // Cannot deselect last one
      return {
        ...prev,
        purposes: exists
          ? prev.purposes.filter((p) => p !== id)
          : [...prev.purposes, id],
      };
    });
  };

  const addOwnWork = () => {
    setFormData((prev) => {
      // Prevent adding if there are empty titles
      if (prev.ownWorks.some((w) => !w.title.trim())) {
        return prev;
      }
      return {
        ...prev,
        ownWorks: [...prev.ownWorks, { id: Date.now(), title: "", url: "" }],
      };
    });
  };

  const updateOwnWork = (id: number, field: "title" | "url", value: string) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.map((w) =>
        w.id === id ? { ...w, [field]: value } : w
      ),
    }));
  };

  const removeOwnWork = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      ownWorks: prev.ownWorks.filter((w) => w.id !== id),
    }));
  };

  const addFavWorkFromMaster = (work: MasterWork) => {
    const periods: Period[] = ["LIFE", "NOW", "FUTURE"];
    const newWorks: FavWork[] = [];

    periods.forEach((p) => {
      // Check duplication within THIS period
      if (formData.favWorks.some((w) => w.id === work.id && w.period === p))
        return;

      const isActive = p === activePeriod;

      newWorks.push({
        ...work,
        period: p,
        // Active Period: Like (isBest=true) AND Tier 1
        // Other Periods: Undefined (isBest=false, tier=null)
        isBest: isActive,
        tier: isActive ? 1 : null,
      });
    });

    if (newWorks.length > 0) {
      setFormData((prev) => ({
        ...prev,
        favWorks: [...prev.favWorks, ...newWorks],
      }));
    }
  };

  const removeFavWork = (id: number, period: Period) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.filter(
        (w) => !(w.id === id && w.period === period)
      ),
    }));
  };

  const toggleBestWork = (id: number, period: Period) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) => {
        if (w.id === id && w.period === period) {
          // Refined Logic:
          // If isBest (Tier 1/2/3) -> Switch to "normal" (isBest: false)
          // If NOT isBest (Normal or Null) -> Switch to Tier 1 (isBest: true)
          const isBest = w.isBest;
          return { ...w, tier: isBest ? "normal" : 1, isBest: !isBest };
        }
        return w;
      }),
    }));
  };

  const setWorkTier = (
    id: number,
    period: Period,
    tier: 1 | 2 | 3 | "normal" | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      favWorks: prev.favWorks.map((w) =>
        w.id === id && w.period === period
          ? { ...w, tier, isBest: tier !== null && tier !== "normal" }
          : w
      ),
    }));
  };

  // Registration Form State
  const [newWorkData, setNewWorkData] = useState<Omit<MasterWork, "id">>({
    title: "",
    category: "漫画",
    author: "",
    tags: [],
    era: "2000年代",
  });
  const [newWorkTagsInput, setNewWorkTagsInput] = useState("");

  const handleRegisterNewWork = () => {
    if (!newWorkData.title) return;
    const newId = Date.now();
    const newWork: MasterWork = {
      id: newId,
      ...newWorkData,
      tags: newWorkTagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    setMasterWorks((prev) => [newWork, ...prev]); // Add to Global DB
    addFavWorkFromMaster(newWork); // Add to User List

    // Reset
    setNewWorkData({
      title: "",
      category: "漫画",
      author: "",
      tags: [],
      era: "2000年代",
    });
    setNewWorkTagsInput("");
    setIsRegistering(false);
  };

  // Search & Filter State
  const [masterSearch, setMasterSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterEras, setFilterEras] = useState<string[]>([]);

  const searchedMasterWorks = React.useMemo(() => {
    let result = masterWorks;

    // 1. Text Search
    if (masterSearch) {
      const searchLower = masterSearch.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(searchLower) ||
          w.author.toLowerCase().includes(searchLower)
      );
    }

    // 2. Tag Filter
    if (filterTag) {
      const tagLower = filterTag.toLowerCase();
      result = result.filter((w) =>
        w.tags.some((t) => t.toLowerCase().includes(tagLower))
      );
    }

    // 3. Era Filter (Multi-select)
    if (filterEras.length > 0) {
      result = result.filter((w) => filterEras.includes(w.era));
    }

    return result.slice(0, 50);
  }, [masterWorks, masterSearch, filterTag, filterEras]);

  // --- Step Content Renderers ---

  // STEP 1: Role & Type
  const renderStep1 = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Role Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">1. 役割 (Role)</h2>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Fixed
            </span>
            <h3 className="text-lg font-bold text-slate-800">
              リーダー (Leader)
            </h3>
          </div>

          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-white/50 p-4 rounded-lg border border-indigo-50/50">
            <p className="font-medium text-indigo-900 mb-2">
              VNS masakinihirotaでは各ユーザーがリーダー役を担います。
            </p>
            <p>
              VNS
              masakinihirotaにおけるリーダーは、価値観を共有する最小単位である「組織（グループ）」の創設者かつ運営責任者です。
              主な役割は、組織の目的やルールの設定、メンバーの招待、役割の任命です。また、リーダーはコミュニティの文化を守り、価値観の合う居場所を維持する調整役として役割を担ってもらいます。
            </p>
          </div>
        </div>
      </section>

      {/* 2. Type Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            2. プロフィールのタイプ (Profile type)
          </h2>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            <strong>仮面（プロフィール）について</strong>
            <br />
            VNS masakinihirotaでは、プロフィールを「仮面」と定義しています。
            本来の自分（ルートアカウント）とは別に、対人関係や目的に応じた「仮面」を作成し、使い分けます。プロフィールを使い分けることで目的別にマッチングをしやすくします。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {USER_TYPES.map((t) => (
            <div
              key={t.id}
              onClick={() => updateForm("type", t.id)}
              className={`
                cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                ${
                  formData.type === t.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-1"
                    : "border-slate-200 bg-white hover:border-blue-300"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    formData.type === t.id
                      ? "bg-blue-200 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {t.icon}
                </div>
                {formData.type === t.id && (
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{t.title}</h3>
              <p className="text-sm font-medium text-slate-600 mb-2">
                {t.subtitle}
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // STEP 2: Purpose & Identity
  const renderStep2 = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 3. Purpose Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            3. プロフィールの活動目的
          </h2>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 leading-relaxed">
            <strong>目的を選ぶ理由</strong>
            <br />
            このプロフィールの主な活動目的を選択してください。
            設定した目的に合わせて、同じ志を持つユーザーと優先的にマッチングされます。「仕事」「趣味」など、VNSでは目的ごとにプロフィール（仮面）を使い分けることが可能です。このプロフィールでは誰と何をして過ごしたいか、最適なものを選んでください。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {PURPOSES.map((p) => {
            const isActive = formData.purposes.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePurpose(p.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all text-sm
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-md transform scale-105"
                      : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                {p.icon}
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Display Name Section (Constellation & Candidates) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Smile className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            4. 匿名表示名 (Identity)
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8">
          {/* Zodiac Selection (Read Only) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                あなたの星座 (Root Account Info)
              </h3>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-2 text-purple-600">
                {getZodiacSymbol(formData.zodiac)}
              </div>
              <h4 className="text-xl font-bold text-purple-900 mb-1">
                {formData.zodiac}
              </h4>
              <p className="text-xs text-purple-500">
                ルートアカウントで設定された星座です
              </p>
            </div>
          </div>

          {/* Candidates Selection */}
          {formData.zodiac && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  候補から選択してください
                </h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUndoCandidates}
                    disabled={historyIndex <= 0}
                    className={`
                      flex items-center gap-1 text-xs font-medium transition-colors px-3 py-2 rounded-md
                      ${
                        historyIndex > 0
                          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          : "text-slate-300 cursor-not-allowed"
                      }
                    `}
                    title="前の候補に戻る"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    戻す
                  </button>

                  <button
                    onClick={() => handleGenerateCandidates(formData.zodiac)}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200 px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    更新して別の候補を見る
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-4">
                <div className="flex flex-col gap-3">
                  {formData.nameCandidates.map((candidate) => (
                    <label
                      key={candidate}
                      className={`
                      flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all bg-white
                      ${
                        formData.displayName === candidate
                          ? "border-purple-500 shadow-md transform scale-[1.01]"
                          : "border-slate-100 hover:border-purple-200"
                      }
                    `}
                    >
                      <input
                        type="radio"
                        name="displayName"
                        value={candidate}
                        checked={formData.displayName === candidate}
                        onChange={(e) =>
                          updateForm("displayName", e.target.value)
                        }
                        className="w-5 h-5 text-purple-600 border-slate-300 focus:ring-purple-500 mr-4"
                      />
                      <span
                        className={`font-bold text-lg ${
                          formData.displayName === candidate
                            ? "text-purple-700"
                            : "text-slate-700"
                        }`}
                      >
                        {candidate}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  // STEP 3: Own Works (Standalone)
  const renderStep3 = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
        <p className="text-blue-800 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          入力したい項目だけ埋めてください。すべて任意です。
        </p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            自己的作品 (Own Works)
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl">
          {formData.ownWorks.map((work) => (
            <div
              key={work.id}
              className="flex flex-col gap-2 p-4 border border-slate-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-left-2"
            >
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">
                      作品名・活動名
                    </label>
                    <input
                      type="text"
                      placeholder="例: オリジナル漫画「〇〇」、個人ブログ、YouTubeチャンネルなど"
                      value={work.title}
                      onChange={(e) =>
                        updateOwnWork(work.id, "title", e.target.value)
                      }
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">
                      URL (任意)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={work.url}
                      onChange={(e) =>
                        updateOwnWork(work.id, "url", e.target.value)
                      }
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none text-sm text-slate-700 bg-slate-50"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeOwnWork(work.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-6"
                  title="削除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addOwnWork}
            disabled={formData.ownWorks.some((w) => !w.title.trim())}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-colors ${
              formData.ownWorks.some((w) => !w.title.trim())
                ? "text-slate-400 bg-slate-100 cursor-not-allowed"
                : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Plus className="w-4 h-4" />
            作品を追加する
          </button>
        </div>
      </section>
    </div>
  );

  // --- Step 4 Renderers ---

  // STEP 4: Favorite Works Main
  const renderStep4 = () => {
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
              <h2 className="text-xl font-bold text-slate-800 leading-tight">
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
              className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                activePeriod === p
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300"
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
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner flex flex-col h-full overflow-hidden">
            <div className="shrink-0 mb-3 flex items-center justify-end gap-2">
              {/* Rating Type Toggle - Moved Here */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setRatingType("LIKE")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${ratingType === "LIKE" ? "bg-white text-pink-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Heart className="w-3 h-3 inline mr-1 mb-0.5" /> LIKE
                </button>
                <button
                  onClick={() => setRatingType("TIER")}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${ratingType === "TIER" ? "bg-white text-indigo-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
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
                  className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-slate-700 text-sm truncate"
                        title={work.title}
                      >
                        {work.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-hidden text-[10px] text-slate-400">
                      <span className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-slate-500 shrink-0">
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
                      <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-bold shadow-sm">
                        未評価
                      </span>
                    )}

                    {/* Rating Controls */}
                    {ratingType === "LIKE" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBestWork(work.id, activePeriod)}
                          className="focus:outline-none p-1 rounded-full hover:bg-slate-50 transition-colors"
                        >
                          <Heart
                            className={`w-6 h-6 transition-colors ${work.isBest ? "text-pink-500 fill-pink-500" : "text-slate-300 hover:text-pink-300"}`}
                          />
                        </button>
                        <button
                          onClick={() =>
                            setWorkTier(work.id, activePeriod, "normal")
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            work.tier === "normal"
                              ? "bg-slate-400 text-white shadow-sm"
                              : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                          }`}
                        >
                          普通
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1 bg-slate-100 p-0.5 rounded-md">
                        {[1, 2, 3, "normal"].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              setWorkTier(work.id, activePeriod, t as any)
                            }
                            className={`h-6 px-2 text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                              work.tier === t
                                ? t === 1
                                  ? "bg-purple-600 text-white shadow-sm"
                                  : t === 2
                                    ? "bg-indigo-500 text-white"
                                    : t === 3
                                      ? "bg-teal-500 text-white"
                                      : "bg-slate-400 text-white"
                                : "text-slate-300 hover:bg-slate-200"
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
          <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="shrink-0 mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
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
              <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="作品名、作者名で検索..."
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                    value={masterSearch}
                    onChange={(e) => setMasterSearch(e.target.value)}
                  />
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="タグで絞り込み"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                  />
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
                        className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                          isSelected
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-bold shadow-sm"
                            : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-500"
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
                      className={`flex items-start justify-between p-2 rounded border transition-all group ${
                        isAdded
                          ? "bg-slate-100 border-slate-200 opacity-60 cursor-default"
                          : "bg-white border-transparent hover:bg-indigo-50 hover:border-indigo-100 cursor-pointer shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="min-w-0 pr-2 pointer-events-none">
                        <div className="font-bold text-slate-700 text-sm truncate">
                          {work.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {isAdded && (
                            <span className="inline-block bg-slate-200 text-slate-500 text-[10px] px-1.5 rounded mr-1.5 font-bold">
                              登録済
                            </span>
                          )}
                          <span
                            className={`${isAdded ? "bg-slate-200" : "bg-slate-100"} px-1.5 rounded mr-1.5`}
                          >
                            {work.category}
                          </span>
                          {work.author}
                        </div>
                      </div>
                      <button
                        disabled={isAdded}
                        className={`shrink-0 p-1.5 rounded-full transition-all pointer-events-none ${
                          isAdded
                            ? "text-slate-400 bg-slate-200"
                            : "text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-100"
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

  // STEP 5: Values (Standalone)
  const renderStep5 = () => {
    // List Logic: Separation of Concerns
    // 1. Registered List (Left Column):
    //    (Interacted OR Purpose-Related OR Manually Added) AND (NOT Manually Removed)
    const registeredValues = VALUE_QUESTIONS.filter((q) => {
      // If manually removed, exclude (even if purpose-related or answered)
      // Note: Data is kept in valueSelections, just hidden from "Registered List"
      if (removedQuestionIds.includes(q.id)) return false;

      // If manually added, include
      if (addedQuestionIds.includes(q.id)) return true;

      // 1. Explicitly interacted with (Answered or Tiered)
      // We keep this enabling condition for now, unless "Remove" should hide even answered ones.
      // Yes, "Remove" explicitly hides it.
      const hasInteraction =
        (valueSelections[q.id]?.length || 0) > 0 || (valueTiers[q.id] || 0) > 0;
      if (hasInteraction) return true;

      // 2. Related to selected Purpose (Auto-register)
      if (
        q.relatedPurposes &&
        q.relatedPurposes.some((p) => formData.purposes.includes(p))
      ) {
        return true;
      }

      return false;
    });

    // 2. Candidate List (Right Column): All questions (Library Mode)
    // Display ALL existing values EXCEPT those already registered (Left) to simulate "Moving".
    const candidateQuestions = VALUE_QUESTIONS.filter(
      (q) => !registeredValues.some((r) => r.id === q.id)
    );

    // Pagination for Candidate List
    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.ceil(candidateQuestions.length / ITEMS_PER_PAGE);
    const safePage = Math.min(
      Math.max(1, currentPage),
      Math.max(1, totalPages)
    );

    const paginatedCandidates = candidateQuestions.slice(
      (safePage - 1) * ITEMS_PER_PAGE,
      safePage * ITEMS_PER_PAGE
    );

    // Purpose Toggle Handler
    const togglePurpose = (purposeId: string) => {
      setFormData((prev) => {
        const current = prev.purposes;
        // Prevent removal if it is the last one
        if (current.includes(purposeId) && current.length <= 1) return prev;

        const newPurposes = current.includes(purposeId)
          ? current.filter((id) => id !== purposeId)
          : [...current, purposeId];
        return { ...prev, purposes: newPurposes };
      });
      // Close any open detail and Reset Page
      setOpenQuestionId(null);
      setCurrentPage(1);
    };

    // Handlers for Add/Remove
    const handleAddValue = (id: string) => {
      setAddedQuestionIds((prev) => [...prev, id]);
      setRemovedQuestionIds((prev) => prev.filter((rid) => rid !== id)); // Clear removal if re-added
    };

    const handleRemoveValue = (id: string) => {
      setRemovedQuestionIds((prev) => [...prev, id]);
      setAddedQuestionIds((prev) => prev.filter((aid) => aid !== id)); // Clear addition if removed
      setOpenQuestionId(null); // Close if open
    };

    // Helper: Render Question Card (Shared between Left/Right columns)
    const renderQuestionCard = (
      q: (typeof VALUE_QUESTIONS)[0],
      idx: number,
      source: "REGISTERED" | "CANDIDATE"
    ) => {
      const isOpen = openQuestionId === q.id;
      const isAnswered = (valueSelections[q.id]?.length || 0) > 0;
      const myTier = valueTiers[q.id];
      const selectedChoices = valueSelections[q.id] || [];

      // Visual distinction for Registered vs Candidate
      const isRegistered = source === "REGISTERED";
      const baseBorderColor = isRegistered
        ? "border-indigo-200"
        : "border-slate-200";
      const baseBgColor = isRegistered ? "bg-indigo-50/20" : "bg-white";

      if (!isRegistered) {
        // --- CANDIDATE (Right Column) ---
        // Click to ADD
        return (
          <div
            key={q.id}
            onClick={() => handleAddValue(q.id)}
            className="rounded-xl border border-dashed border-slate-300 bg-white p-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group flex items-start gap-3"
          >
            <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200 mb-1 inline-block">
                {q.category}
              </span>
              <h3 className="font-bold text-sm text-slate-600 group-hover:text-indigo-700 transition-colors">
                {q.title}
              </h3>
            </div>
            <div className="text-indigo-600 opacity-0 group-hover:opacity-100 text-xs font-bold self-center transition-opacity">
              追加
            </div>
          </div>
        );
      }

      // --- REGISTERED (Left Column) ---
      // Accordion + Delete
      return (
        <div
          key={q.id}
          className={`rounded-xl border transition-all overflow-hidden ${
            isOpen
              ? "shadow-lg border-indigo-300 ring-1 ring-indigo-200 bg-white"
              : `${baseBorderColor} ${baseBgColor} hover:border-indigo-300`
          }`}
        >
          {/* Header */}
          <div
            onClick={(e) => {
              // Toggle Open
              setOpenQuestionId(isOpen ? null : q.id);
            }}
            className={`p-4 cursor-pointer flex items-start gap-3 transition-colors ${
              isOpen ? "bg-indigo-50/40" : "hover:bg-indigo-50/20"
            }`}
          >
            <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-slate-100 text-slate-400">
              {isAnswered ? (
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
              ) : (
                "Q"
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-500 border border-slate-200">
                  {q.category}
                </span>
                {myTier === 1 && (
                  <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                )}
                {myTier === 2 && (
                  <span className="text-[10px] font-bold text-indigo-500">
                    T2
                  </span>
                )}
                {myTier === 3 && (
                  <span className="text-[10px] font-bold text-teal-500">
                    T3
                  </span>
                )}
              </div>
              <h3
                className={`font-bold text-sm md:text-base leading-snug ${
                  isOpen || isAnswered ? "text-indigo-900" : "text-slate-700"
                }`}
              >
                {q.title}
              </h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveValue(q.id);
                }}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="リストから削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {/* Accordion Indicator */}
              <div className="text-slate-400 mt-1">
                <div
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          {isOpen && (
            <div className="p-4 md:p-5 border-t border-slate-100 bg-white space-y-5 animate-in slide-in-from-top-1">
              {/* Rating Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  重要度:
                </span>
                {ratingType === "LIKE" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValueTier(q.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-sm text-sm ${
                      myTier === 1
                        ? "bg-pink-100 text-pink-600 ring-1 ring-pink-300"
                        : "bg-white text-slate-400 border border-slate-200 hover:bg-pink-50 hover:text-pink-400"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        myTier === 1 ? "fill-pink-500" : ""
                      }`}
                    />
                    {myTier === 1 ? "重視する" : "普通"}
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((t) => (
                      <button
                        key={t}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValueTier(q.id, t as any);
                        }}
                        className={`w-9 h-8 text-xs font-bold rounded flex items-center justify-center transition-all ${
                          myTier === t
                            ? t === 1
                              ? "bg-purple-600 text-white shadow-md"
                              : t === 2
                                ? "bg-indigo-500 text-white shadow-md"
                                : "bg-teal-500 text-white shadow-md"
                            : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        T{t}
                      </button>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValueTier(q.id, undefined);
                      }}
                      className="px-2 py-1 text-xs text-slate-400 underline hover:text-slate-600 ml-2"
                    >
                      クリア
                    </button>
                  </div>
                )}
              </div>

              {/* Choices */}
              <div className="space-y-2.5">
                {q.choices.map((choice) => (
                  <label
                    key={choice.id}
                    onClick={() => handleValueSelection(q.id, choice.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedChoices.includes(choice.id)
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          selectedChoices.includes(choice.id)
                            ? "bg-teal-500 border-teal-500"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {selectedChoices.includes(choice.id) && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`font-bold text-sm ${
                          selectedChoices.includes(choice.id)
                            ? "text-teal-900"
                            : "text-slate-700"
                        }`}
                      >
                        {choice.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Info Blocks */}
              {q.infoBlocks.map((info, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs"
                >
                  <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <Info className="w-3 h-3" /> {info.title}
                  </h4>
                  <p className="text-slate-600">{info.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-12">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            価値観セットの確認
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            左側で「活動目的」を選ぶと、答えるべき価値観がリストアップされます。
            <br />
            まずは左側のリストに回答してプロフィールを完成させましょう。
            <br />
            右側のライブラリは、さらに項目を追加したい場合に使ってください。
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Registered Values (Output/Profile) */}
          <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-4">
            {/* Purpose Selector (Added to Profile) */}
            <div className="bg-white border border-indigo-200 rounded-xl shadow-sm p-4 ring-1 ring-indigo-50">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  あなたの目的
                </span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                目的を選ぶと、関連する価値観がリストに追加されます。
              </p>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map((p) => {
                  const isActive = formData.purposes.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePurpose(p.id)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-md hover:bg-indigo-700"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                      }`}
                    >
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Type Toggle (Moved to Left Top) */}
            <div className="bg-white border border-indigo-200 rounded-xl shadow-sm p-3 ring-1 ring-indigo-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                評価モード:
              </span>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setRatingType("LIKE")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${ratingType === "LIKE" ? "bg-white text-pink-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Heart className="w-3.5 h-3.5" /> LIKE
                </button>
                <button
                  onClick={() => setRatingType("TIER")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${ratingType === "TIER" ? "bg-white text-indigo-500 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Trophy className="w-3.5 h-3.5" /> TIER
                </button>
                <button
                  onClick={() => setShowRatingHelp(true)}
                  className="p-1 ml-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  title="評価の基準について"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-indigo-200 rounded-xl shadow-sm p-4 overflow-hidden ring-1 ring-indigo-50">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />{" "}
                  プロフィール (登録済)
                </span>
                <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full">
                  {registeredValues.length}
                </span>
              </h3>

              {registeredValues.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 text-xs">
                  まだ登録がありません
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {registeredValues.map((q, idx) =>
                    renderQuestionCard(q, idx, "REGISTERED")
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs text-slate-500 text-center">
                現在 {registeredValues.length} 個の価値観を登録中
              </div>
            </div>
          </div>

          {/* Right Column: Candidate Pool (Input/Library) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Context / Filters */}
            {/* Context / Filters (Moved to Left, Keeping 'Show All' here? Or simplify?) */}
            {/* Just Show All Toggle and Count */}
            {/* Library Header */}
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-slate-500">
                <span className="text-xs font-normal mr-2">
                  ライブラリから探す:
                </span>
                {candidateQuestions.length}
                <span className="text-xs font-normal ml-1">件のお題</span>
              </div>
            </div>

            {/* Questions List (Right Column - Candidates) */}
            <div className="space-y-4 min-h-[400px]">
              {paginatedCandidates.map((q, idx) =>
                renderQuestionCard(q, idx, "CANDIDATE")
              )}
            </div>

            {candidateQuestions.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 mt-4">
                <p className="text-slate-500 text-sm">
                  現在表示できるお題はありません。
                  <br />
                  「その他すべて」をONにするか、登録済みを確認してください。
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-100">
                <button
                  disabled={safePage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    setOpenQuestionId(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  前へ
                </button>

                <span className="text-sm font-bold text-slate-600">
                  {safePage} / {totalPages}
                </span>

                <button
                  disabled={safePage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    setOpenQuestionId(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  次へ
                  <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // STEP 6: Confirmation (Previously Step 4)
  const renderStep6 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          プロフィールの最終確認
        </h2>
        <p className="text-slate-500">
          以下の内容でプロフィールを作成します。よろしければ作成ボタンを押してください。
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
        {/* Cover-like Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-8">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {getZodiacSymbol(formData.zodiac) ||
                  (formData.displayName ? formData.displayName[0] : "G")}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-slate-800">
                  {formData.displayName || "未設定"}
                </h1>
                <p className="text-indigo-600 font-medium">{formData.role}</p>
              </div>
            </div>
            <div className="flex gap-2 mb-1">
              {formData.purposes.map((pid) => {
                const p = PURPOSES.find((item) => item.id === pid);
                return p ? (
                  <span
                    key={pid}
                    className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200"
                  >
                    {p.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Identity
              </h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Type</dt>
                  <dd className="font-medium text-slate-800 flex items-center gap-2">
                    {USER_TYPES.find((t) => t.id === formData.type)?.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">Zodiac</dt>
                  <dd className="font-medium text-slate-800 flex items-center gap-2">
                    {formData.zodiac || "未選択"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 mb-1">
                    Values (Basic)
                  </dt>
                  <dd className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm italic">
                    {formData.valuesAnswer || "（未回答）"}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Portfolio / Favorites
              </h4>
              <div className="space-y-6">
                <div>
                  <dt className="text-sm text-slate-500 mb-2">Own Works</dt>
                  {formData.ownWorks.length > 0 ? (
                    <ul className="space-y-2">
                      {formData.ownWorks.map((w) => (
                        <li key={w.id} className="flex flex-col text-sm">
                          <span className="text-slate-700">{w.title}</span>
                          {w.url && (
                            <a
                              href={w.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-500 hover:underline"
                            >
                              {w.url}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>

                <div>
                  <dt className="text-sm text-slate-500 mb-2">
                    Favorite Works
                  </dt>
                  {formData.favWorks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.favWorks.map((w) => (
                        <span
                          key={w.id}
                          className={`text-sm px-3 py-1 rounded-full border ${
                            w.isBest
                              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          {w.isBest && (
                            <Star className="inline w-3 h-3 mr-1 -mt-0.5 fill-current" />
                          )}
                          {w.title}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">なし</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-white font-sans text-slate-800 overflow-hidden text-left">
      {/* Sidebar Navigation */}
      <StepIndicator
        currentStep={currentStep}
        steps={[
          { id: 1, label: "Role & Type", desc: "役割とタイプ" },
          { id: 2, label: "Purpose & Identity", desc: "目的と匿名名" },
          { id: 3, label: "Own Works", desc: "自分の作品" },
          { id: 4, label: "Favorite Works", desc: "私の好きな作品" },
          { id: 5, label: "Values", desc: "価値観" },
          { id: 6, label: "Confirm", desc: "最終確認" },
        ]}
        onStepClick={setCurrentStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Right Navigation */}
        <div className="absolute top-6 right-6 md:right-12 z-10">
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all hover:scale-105 active:scale-95 text-sm"
            >
              次へ進む
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm ${
                formData.purposes.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95"
              }`}
              disabled={formData.purposes.length === 0}
              onClick={() => alert("Profile Created!")}
            >
              プロフィール作成
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scroll-smooth">
          <div
            className={`mx-auto pb-24 ${currentStep === 4 ? "w-full max-w-full" : "max-w-5xl"}`}
          >
            {" "}
            {/* pb-24 for footer space */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
          </div>
        </div>

        {/* Floating Footer Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 md:px-12 py-4 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
                ${
                  currentStep === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                次へ進む
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold shadow-lg transition-all ${
                  formData.purposes.length === 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-green-200 hover:scale-105 active:scale-95"
                }`}
                disabled={formData.purposes.length === 0}
                onClick={() => alert("Profile Created!")}
              >
                プロフィール作成
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showRatingHelp && (
        <RatingHelpModal onClose={() => setShowRatingHelp(false)} />
      )}
    </div>
  );
}
