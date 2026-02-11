import { Button } from "@/components/ui/button";
import { WorkCatalogHeader } from "@/components/works/work-catalog-header";
import { WorkList } from "@/components/works/work-list";
import Link from "next/link";
import { Suspense } from "react";
import { getWorks } from "./actions"; // Import from local actions

export default async function WorksPage(props: {
  searchParams?: Promise<{
    q?: string;
    tab?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || "official";
  const query = searchParams?.q || "";

  let is_official: boolean | undefined = undefined;
  if (tab === "official") is_official = true;
  else if (tab === "user") is_official = false;

  const works = await getWorks({ is_official, query, category: "all" });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        {/* Register button logic moved here for better UX */}
      </div>

      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/works/new">作品を登録する</Link>
        </Button>
      </div>

      <WorkCatalogHeader />

      <Suspense fallback={<div>Loading works...</div>}>
        <WorkList works={works} />
      </Suspense>
    </div>
  );
}
