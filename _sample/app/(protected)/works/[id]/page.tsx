import { notFound } from "next/navigation";

import { getWorkByIdAction } from "@/app/actions/works";
import { WorkDetail } from "@/components/works/work-detail";
import { authClient } from "@/lib/auth-client";
import { isValidUUID } from "@/lib/utils";

// UI Type Definition (matching WorkDetail component)
interface UIWorkDetail {
  id: string;
  title: string;
  category: string;
  period: string;
  tags: string[];
  urls: { type: string; value: string }[];
  creatorName?: string;
  description?: string;
  scale?: string;
  isPurchasable?: boolean;
  status?: string;
  createdAt: string;
}

/**
 *
 * @param work
 */
function mapDatabaseWorkToUIDetail(work: any): UIWorkDetail {
  const urls: { type: string; value: string }[] = [];
  if (work.externalUrl) urls.push({ type: "link", value: work.externalUrl });
  if (work.affiliateUrl)
    urls.push({ type: "affiliate", value: work.affiliateUrl });

  return {
    id: work.id,
    title: work.title,
    category: work.category || "other",
    period: work.releaseYear || "",
    tags: work.tags || [],
    urls,
    creatorName: work.author || undefined,
    description: work.description || undefined,
    scale: work.scale || undefined,
    isPurchasable: work.isPurchasable ?? false,
    status: work.status || "unknown",
    createdAt: work.createdAt,
  };
}

interface PageProperties {
  params: Promise<{ id: string }>;
}

/**
 *
 * @param root0
 * @param root0.params
 */
export default async function WorkDetailPage({ params }: PageProperties) {
  const { id } = await params;

  if (!isValidUUID(id)) {
    notFound();
  }

  const work = (await getWorkByIdAction(id)) as any;

  if (!work) {
    notFound();
  }

  const { data: session } = (await authClient.getSession()) as any;
  const isOwner = session?.user?.id === work.ownerUserId;

  const uiWork = mapDatabaseWorkToUIDetail(work);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <WorkDetail work={uiWork} isOwner={isOwner} />
    </div>
  );
}
