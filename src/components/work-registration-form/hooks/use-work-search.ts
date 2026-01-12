import { useState, useCallback } from "react";
import { MOCK_DB_WORKS } from "../mock-data";
import { Work } from "../schema";

export function useWorkSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"manga" | "anime">("manga");
  const [isSearching, setIsSearching] = useState(false);
  const [dbResults, setDbResults] = useState<Work[]>([]);
  const [aiResults, setAiResults] = useState<Work[]>([]);

  const handleSearch = useCallback(
    async (searchQuery: string, searchCategory: "manga" | "anime") => {
      if (!searchQuery.trim()) {
        setDbResults([]);
        setAiResults([]);
        return;
      }

      setIsSearching(true);
      setDbResults([]);
      setAiResults([]);

      try {
        // DB検索シミュレーション
        // 実際にはAPIを叩く
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
      } catch (error) {
        // console.error("Search failed:", error);
        // エラーハンドリング（通知など）
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  return {
    query,
    setQuery,
    category,
    setCategory,
    isSearching,
    dbResults,
    aiResults,
    handleSearch,
  };
}
