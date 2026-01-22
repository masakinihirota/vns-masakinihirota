"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkCatalogHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const defaultTab = searchParams.get("tab") || "official";

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">作品カタログ</h1>
        <div className="w-full sm:w-auto">
          {/* Add Register Button Link here if needed */}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="作品名で検索..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("q")?.toString()}
          className="max-w-sm"
        />

        <Tabs value={defaultTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="official">公式作品</TabsTrigger>
            <TabsTrigger value="user">ユーザー投稿</TabsTrigger>
            <TabsTrigger value="all">すべて</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
