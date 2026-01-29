import { Search, Loader2 } from "lucide-react";
import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkSearch } from "../hooks/use-work-search";
import { Work } from "../schema";
import { WorkCard } from "../ui/work-card";

interface SearchScreenProps {
  onSelect: (work: Work) => void;
  onManualCreate: (title?: string, category?: "manga" | "anime") => void;
}

export function SearchScreen({ onSelect, onManualCreate }: SearchScreenProps) {
  const {
    query,
    setQuery,
    category,
    setCategory,
    isSearching,
    dbResults,
    displayedResults,
    hasMore,
    loadMore,
    aiResults,
    handleSearch,
  } = useWorkSearch();

  // Simple infinite scroll trigger using callback ref
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isSearching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isSearching, hasMore, loadMore]
  );

  return (
    <div className="animate-in fade-in duration-500 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Search & AI Results */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Introduction Message */}
          <div className="text-sm text-slate-600">
            <p>
              あなたの好きな作品のみ登録してください、自動的にあなたのプロフィールに登録されます。
            </p>
          </div>

          <div className="space-y-6">
            {/* 1. Category Selection (Top Priority) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3">
              <h2 className="text-sm font-bold tracking-tight text-slate-700">
                1. 登録するカテゴリを選択
              </h2>
              <Tabs
                value={category}
                onValueChange={(v) => setCategory(v as "manga" | "anime")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manga">マンガ</TabsTrigger>
                  <TabsTrigger value="anime">アニメ</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 2. Manual Registration (Primary Action) */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h2 className="text-sm font-bold tracking-tight text-slate-700 mb-2">
                2. 手動で登録する
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                検索で見つからない場合や、すぐに登録したい場合
              </p>
              <Button
                variant="outline"
                onClick={() => onManualCreate(undefined, category)}
                className="w-full justify-start text-left h-auto py-3 px-4 border-dashed border-2 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors group"
              >
                <span className="flex items-center gap-2 font-bold">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {category === "manga" ? "📖" : "🎬"}
                  </span>
                  {category === "manga" ? "マンガ" : "アニメ"}を手動で登録する
                </span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-500">OR</span>
              </div>
            </div>

            {/* 3. Search Section (Secondary Action) */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-tight text-slate-700">
                3. {category === "manga" ? "マンガ" : "アニメ"}を検索して登録
              </h2>
              <p className="text-slate-500 text-sm">
                作品名・作者名で検索してください。
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
            {/* Input field matches implementation below */}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="作品名・作者名を入力..."
                  className="pl-10 h-10 bg-slate-50 border-slate-200"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleSearch(query, category);
                  }}
                />
              </div>
              <Button
                onClick={() => void handleSearch(query, category)}
                disabled={isSearching || !query.trim()}
                className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "検索"
                )}
              </Button>
            </div>
          </div>

          {/* AI / Web Search Results */}
          <div className="flex-1 overflow-auto min-h-[300px]">
            {isSearching ? (
              <div className="grid gap-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : query && dbResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  登録済みの作品が見つかりました
                </h3>
                <div className="grid gap-4">
                  {dbResults.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onClick={() => onSelect(work)}
                      source="db"
                    />
                  ))}
                </div>
              </div>
            ) : aiResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Web検索結果
                </h3>
                <div className="grid gap-4">
                  {aiResults.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onClick={() => onSelect(work)}
                      source="ai"
                    />
                  ))}
                </div>
              </div>
            ) : query &&
              !isSearching &&
              aiResults.length === 0 &&
              dbResults.length === 0 ? (
              <div className="text-center py-10 text-slate-500 space-y-4">
                <p>Web検索結果は見つかりませんでした。</p>
                <Button
                  onClick={() => onManualCreate(query, category)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  『{query}』を手動で登録する
                </Button>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-sm">
                検索するとここに結果が表示されます
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registered Works */}
        <div className="space-y-6 flex flex-col h-full border-l pl-8 border-slate-100">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              登録済みの作品
            </h2>
            <p className="text-slate-500 text-sm">
              すでに登録されている作品から選ぶこともできます。
            </p>
          </div>

          <div className="flex-1 overflow-auto">
            {/* If query exists, we might want to show filtered list.
                             Based on current mock/hook implementation, dbResults likely contains matches.
                             We simply display what we have. */}
            {displayedResults.length > 0 ? (
              <div className="grid gap-4 pb-4">
                {displayedResults.map((work, index) => {
                  if (index === displayedResults.length - 1) {
                    return (
                      <div key={work.id} ref={lastElementRef}>
                        <WorkCard
                          work={work}
                          onClick={() => onSelect(work)}
                          source="db"
                        />
                      </div>
                    );
                  }
                  return (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onClick={() => onSelect(work)}
                      source="db"
                    />
                  );
                })}
                {hasMore && (
                  <div className="flex justify-center py-4 text-slate-400">
                    <Loader2 className="animate-spin w-5 h-5" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <p>登録済みの作品はありません。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
