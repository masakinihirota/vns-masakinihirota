import { useState, useCallback, useEffect } from "react";
import { MOCK_DB_WORKS } from "../mock-data";
import { Work } from "../schema";

export function useWorkSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"manga" | "anime">("manga");
  const [isSearching, setIsSearching] = useState(false);

  // 原本の検索結果（全件 or フィルタ済み）
  const [dbResults, setDbResults] = useState<Work[]>(() =>
    MOCK_DB_WORKS.filter((w) => w.category === "manga")
  );

  // 表示用の結果（ページネーション適用後）
  const [displayedResults, setDisplayedResults] = useState<Work[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 50;

  const [aiResults, setAiResults] = useState<Work[]>([]);

  // dbResultsが変わったら、表示用リストをリセットして再構築
  useEffect(() => {
    setPage(1);
    setDisplayedResults(dbResults.slice(0, ITEMS_PER_PAGE));
    setHasMore(dbResults.length > ITEMS_PER_PAGE);
  }, [dbResults]);

  // もっと読み込む
  const loadMore = useCallback(() => {
    if (!hasMore) return;

    const nextPage = page + 1;
    const nextItems = dbResults.slice(0, nextPage * ITEMS_PER_PAGE);

    setDisplayedResults(nextItems);
    setPage(nextPage);
    setHasMore(dbResults.length > nextPage * ITEMS_PER_PAGE);
  }, [dbResults, hasMore, page]);

  const handleSearch = useCallback(
    async (searchQuery: string, searchCategory: "manga" | "anime") => {
      // クエリが空の場合、そのカテゴリの全件を表示（初期状態に戻す）
      if (!searchQuery.trim()) {
        const allMatches = MOCK_DB_WORKS.filter(
          (work) => work.category === searchCategory
        );
        setDbResults(allMatches);
        setAiResults([]);
        return;
      }

      setIsSearching(true);
      setDbResults([]);
      setAiResults([]);

      try {
        // DB検索シミュレーション
        const dbMatches = MOCK_DB_WORKS.filter(
          (work) =>
            work.category === searchCategory &&
            (work.title.includes(searchQuery) ||
              work.author.includes(searchQuery))
        );
        setDbResults(dbMatches);

        // すでに登録済み（DBヒット）ならWeb検索しない
        if (dbMatches.length > 0) {
          setAiResults([]);
          setIsSearching(false);
          return;
        }

        // AI検索シミュレーション
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // モックのAI検索結果
        if (searchQuery.includes("鬼滅")) {
          setAiResults([
            {
              id: `ai-kimetsu-${Date.now()}`,
              title: "鬼滅の刃",
              author: "吾峠呼世晴",
              publisher: "集英社",
              summary:
                "家族を鬼に殺された少年・炭治郎が、鬼になった妹を人間に戻すために戦う物語。",
              category: searchCategory,
              isNew: true,
              isAiGenerated: true,
              officialUrl: "https://kimetsu.com",
            },
          ]);
        } else {
          setAiResults([]);
        }
      } catch (_error) {
        // console.error("Search failed:", _error);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // カテゴリ変更時にリストを更新
  useEffect(() => {
    if (!query.trim()) {
      setDbResults(MOCK_DB_WORKS.filter((w) => w.category === category));
    } else {
      // カテゴリが変わったら今のクエリで再検索
      void handleSearch(query, category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    isSearching,
    dbResults, // オリジナル結果（件数表示などに使用可）
    displayedResults, // 表示用（無限スクロール適用）
    hasMore,
    loadMore,
    aiResults,
    handleSearch,
  };
}
