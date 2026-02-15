"use server";

import type { UpsertBusinessCardData } from "@/lib/db/business-cards";
import * as bcDb from "@/lib/db/business-cards";

export async function getBusinessCardAction(profileId: string) {
  return bcDb.getBusinessCardByProfileId(profileId);
}

export async function upsertBusinessCardAction(
  profileId: string,
  data: UpsertBusinessCardData
) {
  return bcDb.upsertBusinessCard(profileId, data);
}
