import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { isDrizzle } from "./adapter";
import {
  cancelEventParticipationDrizzle,
  createEventDrizzle,
  getEventDrizzle,
  joinEventDrizzle,
} from "./drizzle";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type ParticipantStatus = "going" | "cancelled" | "waitlist";

export const createEvent = async (
  supabase: SupabaseClient<Database>,
  eventData: {
    nation_id: string;
    organizer_id: string;
    title: string;
    description?: string;
    image_url?: string;
    start_at: string;
    end_at?: string;
    max_participants?: number;
    type: "free" | "product_required" | "other";
  }
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return createEventDrizzle(eventData);
  }

  const { data, error } = await supabase
    .from("nation_events")
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinEvent = async (
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return joinEventDrizzle(eventId, userId);
  }

  const { data, error } = await supabase
    .from("nation_event_participants")
    .insert({ event_id: eventId, user_profile_id: userId, status: "going" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelEventParticipation = async (
  supabase: SupabaseClient<Database>,
  eventId: string,
  userId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return cancelEventParticipationDrizzle(eventId, userId);
  }

  const { data, error } = await supabase
    .from("nation_event_participants")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_profile_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEvent = async (
  supabase: SupabaseClient<Database>,
  eventId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return getEventDrizzle(eventId);
  }

  const { data, error } = await supabase
    .from("nation_events")
    .select(`
      *,
      nation:nations(*),
      organizer:user_profiles(*)
    `)
    .eq("id", eventId)
    .single();

  if (error) throw error;
  return data;
};
