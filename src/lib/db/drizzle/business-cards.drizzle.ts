import { db } from "@/lib/drizzle/client";
import { businessCards } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import type {
  BusinessCard,
  BusinessCardConfig,
  BusinessCardContent,
  UpsertBusinessCardData,
} from "../business-cards";

/** Drizzle行データ → BusinessCard型への変換 */
function toBusinessCard(row: typeof businessCards.$inferSelect): BusinessCard {
  return {
    id: row.id,
    user_profile_id: row.userProfileId,
    is_published: row.isPublished,
    display_config: row.displayConfig as BusinessCardConfig,
    content: row.content as BusinessCardContent,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

/** Drizzle版: プロフィールIDでビジネスカード取得 */
export async function getBusinessCardByProfileIdDrizzle(
  profileId: string
): Promise<BusinessCard | null> {
  const rows = await db
    .select()
    .from(businessCards)
    .where(eq(businessCards.userProfileId, profileId))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return toBusinessCard(rows[0]);
}

/** Drizzle版: ビジネスカードのupsert */
export async function upsertBusinessCardDrizzle(
  profileId: string,
  data: UpsertBusinessCardData
): Promise<BusinessCard> {
  // Drizzleの onConflictDoUpdate でupsert実現
  const values: any = {
    userProfileId: profileId,
    updatedAt: new Date(),
  };

  if (data.is_published !== undefined) values.isPublished = data.is_published;
  if (data.display_config !== undefined) values.displayConfig = data.display_config;
  if (data.content !== undefined) values.content = data.content;

  const result = await db
    .insert(businessCards)
    .values(values)
    .onConflictDoUpdate({
      target: businessCards.userProfileId,
      set: values,
    })
    .returning();

  if (result.length === 0) {
    throw new Error("Failed to save business card settings");
  }

  return toBusinessCard(result[0]);
}
