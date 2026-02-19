import { auth } from "@/lib/auth/helper";
import * as matchingDb from "@/lib/db/matching";

export async function getMatchingCandidatesAction(limit = 10) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  return matchingDb.getMatchingCandidates(userId, limit);
}

export async function createMatchingRequestAction(targetProfileId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  return matchingDb.createMatchingRequest(userId, targetProfileId);
}

