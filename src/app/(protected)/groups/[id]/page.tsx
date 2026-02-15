import { GroupsContainer } from "@/components/groups/groups.container";
import { isValidUUID } from "@/lib/utils";
import { notFound } from "next/navigation";


interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!isValidUUID(id)) {
    notFound();
  }
  return <GroupsContainer groupId={id} />;
}
