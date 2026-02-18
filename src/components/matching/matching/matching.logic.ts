import { Heart, Briefcase, Tag, Zap } from "lucide-react";

// --- Types ---
export interface Category {
  id: "values" | "createdWorks" | "favoriteWorks" | "skills";
  label: string;
  icon: React.ElementType;
}

export interface UserStats {
  follows: number;
  watches: number;
  partners: number;
}

export interface UserProfile {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  purposes?: string[];
  values: string[];
  createdWorks: string[];
  favoriteWorks: string[];
  skills: string[];
  stats?: UserStats;
  matchScore?: number;
  // Index allow for category access
  [key: string]: any;
}

export interface MatchStats {
  added: number;
  removed: number;
}

// --- Constants ---
export const CATEGORIES: Category[] = [
  { id: "values", label: "価値観", icon: Heart },
  { id: "createdWorks", label: "作った作品", icon: Briefcase },
  { id: "favoriteWorks", label: "好きな作品", icon: Tag },
  { id: "skills", label: "スキル", icon: Zap },
];

// --- Mock Data ---
export const MY_PROFILES: UserProfile[] = [
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
];

export const CANDIDATE_POOL: UserProfile[] = [
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
];

// --- Logic Functions ---

export const calculateUserScore = (
  user: UserProfile,
  targetProfile: UserProfile,
  selectedCategories: string[]
): UserProfile => {
  let score = 0;
  selectedCategories.forEach((cat) => {
    const userItems = user[cat] as string[] | undefined;
    const targetItems = targetProfile[cat] as string[] | undefined;

    if (userItems && targetItems) {
      const matches = userItems.filter((item) => targetItems.includes(item));
      score += matches.length * 2;
    }
  });
  return { ...user, matchScore: score };
};

export const filterCandidates = (
  candidates: UserProfile[],
  watchList: UserProfile[],
  targetProfile: UserProfile,
  selectedCategories: string[],
  matchMode: "expand" | "refine",
  matchCriterion: "count" | "score",
  processLimit: number,
  scoreThreshold: number
) => {
  let addedUsers: UserProfile[] = [];
  let removedUsers: UserProfile[] = [];

  // Calculate score helper
  const calculateScore = (user: UserProfile) =>
    calculateUserScore(user, targetProfile, selectedCategories);

  if (matchMode === "expand") {
    const scoredCandidates = candidates
      .filter((p) => !watchList.find((w) => w.id === p.id))
      .map(calculateScore);

    if (matchCriterion === "count") {
      addedUsers = scoredCandidates
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, processLimit);
    } else {
      addedUsers = scoredCandidates.filter(
        (u) => (u.matchScore || 0) >= scoreThreshold
      );
    }

    return { addedUsers, removedUsers };
  } else {
    const scoredWatchList = watchList.map(calculateScore);

    if (matchCriterion === "count") {
      const sorted = scoredWatchList.sort(
        (a, b) => (a.matchScore || 0) - (b.matchScore || 0)
      );
      removedUsers = sorted.slice(0, processLimit);
      const kept = sorted.slice(processLimit);
      return { addedUsers, removedUsers, kept };
    } else {
      removedUsers = scoredWatchList.filter(
        (u) => (u.matchScore || 0) < scoreThreshold
      );
      const kept = scoredWatchList.filter(
        (u) => (u.matchScore || 0) >= scoreThreshold
      );
      return { addedUsers, removedUsers, kept };
    }
  }
};
