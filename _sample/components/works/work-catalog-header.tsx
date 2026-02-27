"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 *
 */
export function WorkCatalogHeader() {
  const searchParameters = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const parameters = new URLSearchParams(searchParameters);
    if (term) {
      parameters.set("q", term);
    } else {
      parameters.delete("q");
    }
    router.replace(`${pathname}?${parameters.toString()}`);
  }, 300);

  const handleTabChange = (value: string) => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", value);
    router.replace(`${pathname}?${parameters.toString()}`);
  };

  const defaultTab = searchParameters.get("tab") || "official";

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
          defaultValue={searchParameters.get("q")?.toString()}
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
