/* eslint-disable no-console */

import { useEffect, useMemo, useState } from "react";
// --- 型定義 ---

export type Rating =
  | "TIER1"
  | "TIER2"
  | "TIER3"
  | "LIKE1"
  | "NORMAL_OR_NOT"
  | "UNRATED"
  | "NO_INTEREST";

export type Category = "アニメ" | "漫画" | "その他";

export interface Work {
  id: number | string;
  title: string;
  category: string;
  tags: string[];
  externalUrl: string;
  affiliateUrl: string;
  isOfficial: boolean;
  userRating: Rating;
  lastTier: Rating; // TIER1 | TIER2 | TIER3
}

export interface Profile {
  id: string;
  name: string;
  color: string;
}

export type SortKey = "title" | "userRating" | "category";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export type RatingMode = "tier" | "like";

// --- 定数 ---

export const RATINGS = {
  TIER1: { label: "Tier 1", value: "TIER1", weight: 10, color: "text-red-600" },
  TIER2: {
    label: "Tier 2",
    value: "TIER2",
    weight: 9,
    color: "text-orange-500",
  },
  TIER3: {
    label: "Tier 3",
    value: "TIER3",
    weight: 8,
    color: "text-yellow-600",
  },
  LIKE1: {
    label: "好き(1)",
    value: "LIKE1",
    weight: 7,
    color: "text-pink-500",
  },
  NORMAL_OR_NOT: {
    label: "普通or自分には合わない",
    value: "NORMAL_OR_NOT",
    weight: 4,
    color: "text-gray-600",
  },
  UNRATED: {
    label: "未評価",
    value: "UNRATED",
    weight: 1,
    color: "text-gray-400",
  },
  NO_INTEREST: {
    label: "興味がない",
    value: "NO_INTEREST",
    weight: 0,
    color: "text-slate-300",
  },
} as const;

export const PROFILES: Profile[] = [
  { id: "p1", name: "masakinihirota", color: "bg-blue-600" },
  { id: "p2", name: "guest_user_01", color: "bg-emerald-600" },
  { id: "p3", name: "reviewer_alpha", color: "bg-purple-600" },
  { id: "p4", name: "anime_otaku_99", color: "bg-pink-600" },
];

export const ITEMS_PER_PAGE = 50;
export const AVAILABLE_CATEGORIES = ["アニメ", "漫画", "その他"];

// --- カスタムフック ---

export const useWorkListLogic = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [adVisible, setAdVisible] = useState(true);
  const [selectedWorkId, setSelectedWorkId] = useState<number | string | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "title",
    direction: "asc",
  });
  const [ratingMode, setRatingMode] = useState<RatingMode>("tier");

  // 検索・カテゴリ用ステート
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [enabledCategories, setEnabledCategories] = useState<string[]>([
    "アニメ",
    "漫画",
  ]);

  // プロフィール選択用のステート
  const [activeProfile, setActiveProfile] = useState<Profile>(PROFILES[0]);
  const [isProfileAccordionOpen, setIsProfileAccordionOpen] = useState(false);

  // データ初期化 (Hono APIから取得)
  useEffect(() => {
    const fetchWorks = async () => {
      setIsLoading(true);
      try {
        const url = new URL("/api/works/list", globalThis.location.origin);
        url.searchParams.set("page", currentPage.toString());
        url.searchParams.set("limit", ITEMS_PER_PAGE.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching works: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setTotalCount(data.count || 0);

          const formattedWorks: Work[] = data.data.map((w: { id: string; title: string; category?: string; tags?: string[]; externalUrl?: string; affiliateUrl?: string; isOfficial?: boolean; userWorkRatings?: { rating?: string; lastTier?: string }[] }) => {
            const ratingData = w.userWorkRatings?.[0]; // Drizzle relations will map this way
            return {
              id: w.id,
              title: w.title,
              category: w.category,
              tags: w.tags || [],
              externalUrl: w.externalUrl || "",
              affiliateUrl: w.affiliateUrl || "",
              isOfficial: w.isOfficial,
              userRating: (ratingData?.rating as Rating) || "UNRATED",
              lastTier: (ratingData?.lastTier as Rating) || "TIER1",
            };
          });
          setWorks(formattedWorks);
        }
      } catch (error) {
        console.error("Error fetching works:", error);
        // エラーハンドリング: ユーザーにはジェネリックメッセージを表示
      } finally {
        setIsLoading(false);
      }
    };

    void fetchWorks();
  }, [currentPage]); // currentPage を依存配列に追加

  /**
   * モード切り替え時のデータ同期ロジック
   * @param newMode
   */
  const handleRatingModeToggle = (newMode: RatingMode) => {
    if (newMode === ratingMode) return;
    setRatingMode(newMode);

    // 表示モードが変わっただけでデータ自体を変える必要はないが、
    // UI上の「現在の評価」表示を更新するために再計算が必要な場合がある。
    // 今回は `userRating` はそのままで、表示側で解釈を変えるアプローチをとるため、
    // work.userRating を書き換える処理は削除する（DBの値が正）。
    // ただし、Tier -> Like モード切替時に、Like1相当かどうかを判定するロジックは必要かも？
    // シンプルにするため、モード切替のみ行う。
  };

  // カテゴリトグル
  const toggleCategory = (cat: string) => {
    setEnabledCategories((previous) =>
      previous.includes(cat) ? previous.filter((c) => c !== cat) : [...previous, cat]
    );
    setCurrentPage(1);
  };

  const [totalCount, setTotalCount] = useState(0);

  // 検索・カテゴリフィルタ・ソート処理
  const filteredAndSortedWorks = useMemo(() => {
    let result = [...works];

    // NOTE: サーバーサイドでフィルタリングしていないため、
    // 現在のページ（DBから取得した50件）に対してのみフィルタが適用されます。
    // 本来はサーバーサイドでフィルタリングすべきですが、
    // 今回の修正範囲は「全件取得の廃止」に留めます。

    // 1. カテゴリフィルタ
    result = result.filter((w) => {
      const catMap: Record<string, string> = {
        anime: "アニメ",
        manga: "漫画",
        other: "その他",
      };
      const displayCat = catMap[w.category] || w.category;
      return enabledCategories.includes(displayCat);
    });

    // 2. 検索フィルタ
    if (appliedSearch) {
      const lowerSearch = appliedSearch.toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(lowerSearch) ||
          w.tags.some((t) => t.toLowerCase().includes(lowerSearch))
      );
    }

    // 3. ソート
    // NOTE: サーバーサイドでソートしていないため、現在のページ内でのみソートされます。
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: string | number | undefined;
        let bValue: string | number | undefined;

        if (sortConfig.key === "userRating") {
          const aRating = RATINGS[a.userRating as keyof typeof RATINGS];
          const bRating = RATINGS[b.userRating as keyof typeof RATINGS];
          aValue = aRating?.weight || 0;
          bValue = bRating?.weight || 0;
        } else {
          aValue = a[sortConfig.key as keyof Work] as string | number;
          bValue = b[sortConfig.key as keyof Work] as string | number;
        }

        if (aValue === undefined) aValue = "";
        if (bValue === undefined) bValue = "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [works, sortConfig, appliedSearch, enabledCategories]);

  // ページネーション処理
  // サーバーサイドページネーション済みなので、works は現在のページ分のみ。
  // totalCount をDBから取得したものに依存させる。
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // クライアントサイドでの再スライスは不要（すでに現在のページ）
  const currentItems = filteredAndSortedWorks;

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  /**
   * 評価変更時の処理 (DB更新)
   * @param newRating
   */
  const handleRatingChange = async (newRating: Rating) => {
    if (selectedWorkId === null) return;

    // UIを楽観的更新
    setWorks((previous) =>
      previous.map((w) => {
        if (w.id === selectedWorkId) {
          const isTier = ["TIER1", "TIER2", "TIER3"].includes(
            newRating as string
          );
          return {
            ...w,
            userRating: newRating,
            lastTier: isTier ? newRating : w.lastTier,
          };
        }
        return w;
      })
    );

    try {
      // 選択中のworkを取得して lastTier を計算
      const currentWork = works.find((w) => w.id === selectedWorkId);
      const isTier = ["TIER1", "TIER2", "TIER3"].includes(newRating as string);
      let nextLastTier = isTier ? newRating : currentWork?.lastTier || null;

      if (typeof nextLastTier === "string") {
        nextLastTier = Number.parseInt(nextLastTier.replace("TIER", ""), 10) as any;
      }

      // サーバー側の期待する形式に変換（like/dislike/noneなど）
      let apiRating = "none";
      if (isTier || newRating === "LIKE1") apiRating = "like";
      if (newRating === "NORMAL_OR_NOT" || newRating === "NO_INTEREST")
        apiRating = "dislike";

      const response = await fetch(`/api/works/${selectedWorkId}/rating`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: apiRating,
          tier: nextLastTier || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rating");
      }
    } catch (error) {
      console.error("Failed to update rating:", error);
      // ロールバック処理等が理想だが省略
      alert("評価の保存に失敗しました");
    }
  };

  // 検索実行
  const handleSearchExecute = () => {
    setAppliedSearch(searchInput);
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  const selectedWork = works.find((w) => w.id === selectedWorkId);

  return {
    // データ
    works,
    filteredAndSortedWorks,
    currentItems,
    totalPages,
    selectedWork,

    // UI状態
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

    // アクション
    setAdVisible,
    setSelectedWorkId,
    setCurrentPage,
    setSearchInput,
    setActiveProfile,
    setIsProfileAccordionOpen,

    // イベントハンドラ
    handleRatingModeToggle,
    toggleCategory,
    requestSort,
    handleRatingChange,
    handleSearchExecute,
    handleSearchClear,
  };
};
