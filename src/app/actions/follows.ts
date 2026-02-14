"use server";

import * as followsDb from "@/lib/db/follows";
import { createClient } from "@/lib/supabase/server";

export async function followProfileAction(
  followedProfileId: string,
  status: "watch" | "follow" = "follow"
) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return followsDb.followProfile(supabase, user.id, followedProfileId, status);
}

export async function unfollowProfileAction(
  followedProfileId: string
) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return followsDb.unfollowProfile(supabase, user.id, followedProfileId);
}
