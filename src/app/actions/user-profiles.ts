"use server";

import * as userProfilesDb from "@/lib/db/user-profiles";
import type { CreateProfileData } from "@/lib/types/user-profile";

// Note: getUserProfiles requires rootAccountId.
// In client components, usually we get rootAccountId from usage context or auth.
// But mostly we might want to fetch "my profiles".
// getUserProfiles in db/user-profiles.ts takes rootAccountId.

export async function getUserProfilesAction(rootAccountId: string) {
  return userProfilesDb.getUserProfiles(rootAccountId);
}

export async function createUserProfileAction(
  rootAccountId: string,
  data: CreateProfileData
) {
  return userProfilesDb.createUserProfile(rootAccountId, data);
}

export async function getUserProfileByIdAction(id: string) {
  return userProfilesDb.getUserProfileById(id);
}
