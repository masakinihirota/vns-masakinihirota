import { createClient } from "@/lib/supabase/server";
import { isDrizzle } from "./adapter";
import {
  getBusinessCardByProfileIdDrizzle,
  upsertBusinessCardDrizzle,
} from "./drizzle";

export type BusinessCardContent = {
  trust?: {
    response_time?: string;
    completion_rate?: string;
    revision_policy?: string;
  };
  value?: {
    feedback_stance?: "artistic" | "commercial" | "balanced";
    ai_stance?: "no_ai" | "ai_assisted" | "ai_full";
    self_management?: string[]; // e.g., ["weekend_off", "no_politics"]
  };
  pr?: {
    promotion_level?: string;
    comm_style?: string;
  };
  oasis?: {
    enabled?: boolean;
    // score calculated server-side or checked via badge system separately
  };
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

export type UpsertBusinessCardData = {
  is_published?: boolean;
  display_config?: BusinessCardConfig;
  content?: BusinessCardContent;
};

/**
 * Get the business card for a specific profile.
 * Returns null if not found (and strict is false).
 */
export async function getBusinessCardByProfileId(profileId: string) {
  if (isDrizzle()) return getBusinessCardByProfileIdDrizzle(profileId);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_cards")
    .select("*")
    .eq("user_profile_id", profileId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching business card:", error);
    throw new Error("Failed to fetch business card");
  }

  return data as BusinessCard;
}

/**
 * Create or update a business card configuration.
 */
export async function upsertBusinessCard(
  profileId: string,
  data: UpsertBusinessCardData
) {
  if (isDrizzle()) return upsertBusinessCardDrizzle(profileId, data);

  const supabase = await createClient();

  const payload: any = {
    user_profile_id: profileId,
    updated_at: new Date().toISOString(),
  };

  if (data.is_published !== undefined) payload.is_published = data.is_published;
  if (data.display_config !== undefined)
    payload.display_config = data.display_config;
  if (data.content !== undefined) payload.content = data.content;

  const { data: result, error } = await supabase
    .from("business_cards")
    .upsert(payload, { onConflict: "user_profile_id" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting business card:", error);
    throw new Error("Failed to save business card settings");
  }

  return result as BusinessCard;
}
