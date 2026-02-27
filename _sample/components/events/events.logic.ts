"use client";

import useSWR from "swr";

import {
  cancelEventParticipationAction,
  createEventAction,
  getEventsAction,
  joinEventAction,
} from "@/app/actions/events";
import { Event, NewEvent } from "@/lib/db/types";

type NationEvent = Event;
type NationEventInsert = NewEvent;

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
  const create = async (eventData: NationEventInsert) => {
    return await createEventAction(eventData as any);
  };
  return { createEvent: create };
};

export const useJoinEvent = () => {
  const join = async (eventId: string) => {
    return await joinEventAction(eventId);
  };
  return { joinEvent: join };
};

export const useCancelEvent = () => {
  const cancel = async (eventId: string) => {
    return await cancelEventParticipationAction(eventId);
  };
  return { cancelEvent: cancel };
};
