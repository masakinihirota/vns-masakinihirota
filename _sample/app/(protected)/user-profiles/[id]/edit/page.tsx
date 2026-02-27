import { notFound } from "next/navigation";

import { ProfileEditContainer } from "@/components/profile-edit";
import { isValidUUID } from "@/lib/utils";

/**
 *
 * @param root0
 * @param root0.params
 */
export default async function ProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidUUID(id)) {
    notFound();
  }
  return <ProfileEditContainer profileId={id} />;
}
