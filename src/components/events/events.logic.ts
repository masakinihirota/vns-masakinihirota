"use client";

import {
  cancelEventParticipationAction,
  createEventAction,
  getEventsAction,
  joinEventAction,
} from "@/app/actions/events";
import { NationEvent } from "@/components/groups/groups.types";
import { createEvent } from "@/lib/db/events"; // Import for type definition only if needed, or use Parameters
import useSWR from "swr";

const fetcher = async (key: string) => {
  const [, nationId] = key.split(":");
  return (await getEventsAction(nationId)) as unknown as NationEvent[];
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
    return await createEventAction(eventData);
  };
  return { createEvent: create };
};

export const useJoinEvent = () => {
  const join = async (eventId: string, userId: string) => {
    return await joinEventAction(eventId, userId);
  };
  return { joinEvent: join };
};

export const useCancelEvent = () => {
  const cancel = async (eventId: string, userId: string) => {
    return await cancelEventParticipationAction(eventId, userId);
  };
  return { cancelEvent: cancel };
};
