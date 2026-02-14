"use server";

import * as matchingDb from "@/lib/db/matching";
import { createClient } from "@/lib/supabase/server";

export async function getMatchingCandidatesAction(limit = 10) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  if (!isDrizzle && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return matchingDb.getMatchingCandidates(supabase, user.id, limit);
  }

  // Drizzle path (need to get user ID from auth via supabase client even if passing null to db)
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return [];

  // For Drizzle, we don't pass supabase client to db function if we rely on internal logic,
  // but my db function signature expects it or null.
  return matchingDb.getMatchingCandidates(null, user.id, limit);
}

export async function createMatchingRequestAction(targetProfileId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  // Auth check
  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return matchingDb.createMatchingRequest(supabase, user.id, targetProfileId);
}
