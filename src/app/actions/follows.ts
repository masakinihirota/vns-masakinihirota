"use server";

import { auth } from "@/lib/auth/helper";
import * as followsDb from "@/lib/db/follows";

export async function followProfileAction(
  followedProfileId: string,
  status: "watch" | "follow" = "follow"
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return followsDb.followProfile(session.user.id, followedProfileId, status);
}

export async function unfollowProfileAction(followedProfileId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return followsDb.unfollowProfile(session.user.id, followedProfileId);
}

