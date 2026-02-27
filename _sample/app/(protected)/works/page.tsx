import { Suspense } from "react";

import { getWorksAction } from "@/app/actions/works";
import { Work } from "@/lib/db/types";

import { ClientWorksWrapper, UIWork } from "./client-works-wrapper";

/**
 *
 * @param work
 */
function mapDatabaseWorkToUI(work: Work): UIWork {
  const urls: { type: string; value: string }[] = [];
  if (work.externalUrl) urls.push({ type: "link", value: work.externalUrl });
  if (work.affiliateUrl)
    urls.push({ type: "affiliate", value: work.affiliateUrl });

  let category: UIWork["category"] = "other";
  const catLower = work.category?.toLowerCase() || "other";
  if (["anime", "comic", "novel", "movie", "game"].includes(catLower)) {
    category = catLower as UIWork["category"];
  }

  return {
    id: work.id,
    title: work.title,
    category,
    period: work.releaseYear || "",
    tags: work.tags || [],
    urls,
    creatorName: work.author || undefined,
  };
}

/**
 *
 */
export default async function WorksPage() {
  const databaseWorks = (await getWorksAction(100)) as any[];
  const uiWorks = databaseWorks.map(mapDatabaseWorkToUI);

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
