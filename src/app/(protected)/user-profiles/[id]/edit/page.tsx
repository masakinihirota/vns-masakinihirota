import { ProfileEditContainer } from "@/components/profile-edit";

export default function ProfileEditPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProfileEditContainer profileId={params.id} />;
}
