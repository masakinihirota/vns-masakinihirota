import { GroupsContainer } from "@/components/groups/groups.container";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <GroupsContainer groupId={id} />;
}
