"use client";

import useSWR from "swr";
import { NationEvent } from "@/components/groups/groups.types";
import {
  cancelEventParticipation,
  createEvent,
  joinEvent,
} from "@/lib/db/events";
import { createClient } from "@/lib/supabase/client";

const fetcher = async (key: string) => {
  const [, nationId] = key.split(":");
  const supabase = createClient();
  let query = supabase
    .from("nation_events")
    .select("*")
    .eq("status", "published");

  if (nationId && nationId !== "all") {
    query = query.eq("nation_id", nationId);
  }

  const { data, error } = await query.order("start_at", { ascending: true });
  if (error) throw error;
  return data as NationEvent[];
};

export const useEvents = (nationId: string = "all") => {
  const { data, error, isLoading, mutate } = useSWR<NationEvent[]>(
    `events:${nationId}`,
    fetcher
  );

  return {
    events: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useCreateEvent = () => {
  const create = async (eventData: Parameters<typeof createEvent>[1]) => {
    const supabase = createClient();
    return await createEvent(supabase, eventData);
  };
  return { createEvent: create };
};

export const useJoinEvent = () => {
  const join = async (eventId: string, userId: string) => {
    const supabase = createClient();
    return await joinEvent(supabase, eventId, userId);
  };
  return { joinEvent: join };
};

export const useCancelEvent = () => {
  const cancel = async (eventId: string, userId: string) => {
    const supabase = createClient();
    return await cancelEventParticipation(supabase, eventId, userId);
  };
  return { cancelEvent: cancel };
};
