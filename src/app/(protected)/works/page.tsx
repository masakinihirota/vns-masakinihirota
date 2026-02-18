import { Suspense } from "react";
import { getWorksAction } from "@/app/actions/works";
import { Tables } from "@/types/types_db";
import { ClientWorksWrapper, UIWork } from "./client-works-wrapper";

function mapDbWorkToUI(work: Tables<"works">): UIWork {
  const urls: { type: string; value: string }[] = [];
  if (work.external_url) urls.push({ type: "link", value: work.external_url });
  if (work.affiliate_url)
    urls.push({ type: "affiliate", value: work.affiliate_url });

  let category: UIWork["category"] = "other";
  const catLower = work.category?.toLowerCase() || "other";
  if (["anime", "comic", "novel", "movie", "game"].includes(catLower)) {
    category = catLower as UIWork["category"];
  }

  return {
    id: work.id,
    title: work.title,
    category,
    period: work.release_year || "",
    tags: work.tags || [],
    urls,
    creatorName: work.author || undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const dbWorks = (await getWorksAction(100)) as Tables<"works">[];
  const uiWorks = dbWorks.map(mapDbWorkToUI);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/*
         Note: passing mock handlers for now as WorksList expects them.
         Ideally WorksList should accept a simple link or handle navigation internally.
         But keeping it simple to reuse existing component.
       */}
      <Suspense
        fallback={
          <div className="container mx-auto py-8">Loading works...</div>
        }
      >
        <ClientWorksWrapper works={uiWorks} />
      </Suspense>
    </div>
  );
}
