import { eq } from "drizzle-orm";

import { db as database } from "./client";
import { businessCards } from "./schema.postgres";

export type BusinessCardContent = {
  trust?: {
    response_time?: string;
    completion_rate?: string;
    revision_policy?: string;
  };
  value?: {
    feedback_stance?: "artistic" | "commercial" | "balanced";
    ai_stance?: "no_ai" | "ai_assisted" | "ai_full";
    self_management?: string[];
  };
  pr?: {
    promotion_level?: string;
    comm_style?: string;
  };
  oasis?: {
    enabled?: boolean;
  };
};

export type BusinessCardConfig = {
  show_display_name?: boolean;
  show_role_type?: boolean;
  show_purposes?: boolean;
  show_skills?: boolean;
  show_external_links?: boolean;
  selected_works_ids?: string[];
  custom_title?: string;
  custom_bio?: string;
};

export type BusinessCard = {
  id: string;
  user_profile_id: string;
  is_published: boolean;
  display_config: BusinessCardConfig;
  content: BusinessCardContent;
  created_at: string;
  updated_at: string;
};

export type UpsertBusinessCardData = {
  is_published?: boolean;
  display_config?: BusinessCardConfig;
  content?: BusinessCardContent;
};

// Mapper Helper
/**
 *
 * @param bc
 */
function mapToCardDomain(bc: unknown): BusinessCard {
  if (typeof bc !== 'object' || bc === null) throw new Error('Invalid business card');
  const card = bc as Record<string, unknown>;
  return {
    id: String(card.id),
    user_profile_id: String(card.userProfileId),
    is_published: Boolean(card.isPublished),
    display_config: card.displayConfig as BusinessCardConfig,
    content: card.content as BusinessCardContent,
    created_at: card.createdAt ? String(card.createdAt) : "",
    updated_at: card.updatedAt ? String(card.updatedAt) : "",
  };
}

/**
 * Get the business card for a specific profile.
 * @param profileId
 */
export async function getBusinessCardByProfileId(profileId: string) {
  const card = await database.query.businessCards.findFirst({
    where: eq(businessCards.userProfileId, profileId),
  });
  return card ? mapToCardDomain(card) : null;
}

/**
 * Create or update a business card configuration.
 * @param profileId
 * @param data
 */
export async function upsertBusinessCard(
  profileId: string,
  data: UpsertBusinessCardData
) {
  const insertValues: Record<string, unknown> = {
    userProfileId: profileId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Record<string, unknown>;

  const updateValues: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (data.is_published !== undefined)
    insertValues.isPublished = updateValues.isPublished = data.is_published;
  if (data.display_config !== undefined)
    insertValues.displayConfig = updateValues.displayConfig = data.display_config;
  if (data.content !== undefined) {
    insertValues.content = data.content;
    updateValues.content = data.content;
  }

  const [result] = await database
    .insert(businessCards)
    .values(insertValues as typeof businessCards.$inferInsert)
    .onConflictDoUpdate({
      target: businessCards.userProfileId,
      set: updateValues,
    })
    .returning();

  return mapToCardDomain(result);
}
