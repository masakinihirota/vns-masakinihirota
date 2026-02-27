import { notFound } from "next/navigation";

import { GroupsContainer } from "@/components/groups/groups.container";
import { isValidUUID } from "@/lib/utils";

interface PageProperties {
  params: Promise<{ id: string }>;
}

/**
 *
 * @param root0
 * @param root0.params
 */
export default async function GroupDetailPage({ params }: PageProperties) {
  const { id } = await params;
  if (!isValidUUID(id)) {
    notFound();
  }
  return <GroupsContainer groupId={id} />;
}
