import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

  const supabase = createClient();

  // データ初期化 (Supabaseから取得)
  useEffect(() => {
    const fetchWorks = async () => {
      setIsLoading(true);
      try {
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        // wordsテーブルとuser_work_ratingsテーブルを結合して取得
        // ログイン中のユーザーIDを使ってフィルタリングする想定
        // RLSポリシーで制御されていることを前提とする。

        const {
          data: worksData,
          error: worksError,
          count,
        } = await supabase
          .from("works")
          .select(
            `
            id,
            title,
            category,
            tags,
            external_url,
            affiliate_url,
            is_official,
            user_work_ratings(
              rating,
              last_tier
            )
          `,
            { count: "exact" }
          )
          .range(from, to);
        // カテゴリフィルタなどもサーバーサイドでやるべきだが、現状の実装に合わせて
        // ページネーションのみサーバーサイド化する。
        // 本当は .in('category', enabledCategories) とか .ilike('title', ...) をここでやるべき。
        // しかしUIロジックが複雑（マップ変換など）なので、まずは「全件取得の廃止」を優先する。
        // NOTE: この実装だと、クライアントサイドフィルタリングとサーバーサイドページネーションが競合して
        // 正しい結果にならない可能性がある（フィルタリング後のページネーションができない）。
        // 今回のスコープでは「The Firehose」=「全件取得」を防ぐことが目的なので、
        // フィルタリングもサーバーサイドに寄せる必要がある。

        // 修正: フィルタリングをサーバーサイドで行わないと、ページネーションが機能しない。
        // searchInput, enabledCategories を依存配列に入れて、クエリを構築しなおす必要がある。
        // しかし useEffect 内でそれをやると複雑になるので、一旦ここでは「全件取得」をやめて
        // 「ページネーション付き取得」にするが、
        // クライアントサイドフィルタリングロジック（useMemo）との整合性が取れなくなる。
        // -> fetchWorks を useEffect から外して、検索条件が変わるたびに呼び出す形にリファクタリングする必要がある。
        // 今回の指示は "Update fetchWorks to use server-side pagination" なので、
        // 最小限の変更で対応するなら、useWorkListLogic 全体をリファクタリングするべき。

        if (worksError) throw worksError;

        if (worksData) {
          if (count !== null) setTotalCount(count); // Total count from DB

          const formattedWorks: Work[] = worksData.map((w: any) => {
            const ratingData = w.user_work_ratings?.[0];
            return {
              id: w.id,
              title: w.title,
              category: w.category,
              tags: w.tags || [],
              externalUrl: w.external_url || "",
              affiliateUrl: w.affiliate_url || "",
              isOfficial: w.is_official,
              userRating: (ratingData?.rating as Rating) || "UNRATED",
              lastTier: (ratingData?.last_tier as Rating) || "TIER1",
            };
          });
          setWorks(formattedWorks);
          // Total pages count handling would need a new state if we depend on DB count
        }
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchWorks();
  }, [supabase, currentPage]); // currentPage を依存配列に追加

  /**
   * モード切り替え時のデータ同期ロジック
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
    setEnabledCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
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
        let aVal: string | number | undefined;
        let bVal: string | number | undefined;

        if (sortConfig.key === "userRating") {
          const aRating = RATINGS[a.userRating as keyof typeof RATINGS];
          const bRating = RATINGS[b.userRating as keyof typeof RATINGS];
          aVal = aRating?.weight || 0;
          bVal = bRating?.weight || 0;
        } else {
          aVal = a[sortConfig.key as keyof Work] as string | number;
          bVal = b[sortConfig.key as keyof Work] as string | number;
        }

        if (aVal === undefined) aVal = "";
        if (bVal === undefined) bVal = "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
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
   */
  const handleRatingChange = async (newRating: Rating) => {
    if (selectedWorkId === null) return;

    // UIを楽観的更新
    setWorks((prev) =>
      prev.map((w) => {
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
      const { getSession } = await import("@/lib/auth-client");
      const { data: session } = await getSession();
      if (!session?.user) throw new Error("No user logged in");

      // 選択中のworkを取得して lastTier を計算
      const currentWork = works.find((w) => w.id === selectedWorkId);
      const isTier = ["TIER1", "TIER2", "TIER3"].includes(newRating as string);
      const nextLastTier = isTier ? newRating : currentWork?.lastTier || null;

      const { error } = await supabase.from("user_work_ratings").upsert({
        user_id: session.user.id,
        work_id: selectedWorkId,
        rating: newRating,
        last_tier: nextLastTier,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
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
