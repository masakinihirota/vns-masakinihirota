import { ProfileCreationStep2 } from "@/components/user-profiles/new";

export default function ProfileCreateDetailsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ProfileCreationStep2 initialData={searchParams} />;
}
