import { notFound } from "next/navigation";
import { getWorkByIdAction } from "@/app/actions/works";
import { WorkDetail } from "@/components/works/work-detail"; // Import the detail component
import { getSession } from "@/lib/auth/helper";
import { isValidUUID } from "@/lib/utils";
import { Tables } from "@/types/types_db";

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

function mapDbWorkToUIDetail(work: Tables<"works">): UIWorkDetail {
  const urls: { type: string; value: string }[] = [];
  if (work.external_url) urls.push({ type: "link", value: work.external_url });
  if (work.affiliate_url)
    urls.push({ type: "affiliate", value: work.affiliate_url });
  // if (work.official_url) ... (removed per schema)

  return {
    id: work.id,
    title: work.title,
    category: work.category || "other",
    period: work.release_year || "",
    tags: work.tags || [],
    urls,
    creatorName: work.author || undefined,
    description: work.description || undefined,
    scale: work.scale || undefined,
    isPurchasable: work.is_purchasable ?? false,
    status: work.status || "unknown",
    createdAt: work.created_at,
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isValidUUID(id)) {
    notFound();
  }

  const work = (await getWorkByIdAction(id)) as Tables<"works">;

  if (!work) {
    notFound();
  }

  const session = await getSession();
  const isOwner = session?.user?.id === work.owner_user_id;

  const uiWork = mapDbWorkToUIDetail(work);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <WorkDetail work={uiWork} isOwner={isOwner} />
    </div>
  );
}
