import { ProfileEditContainer } from "@/components/profile-edit";

export default function ProfileCreateDetailsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <ProfileEditContainer profileId="new" initialData={searchParams} />;
}
