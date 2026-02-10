"use client";

import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { Group } from "./groups.types";

const fetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .range(0, 99)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Group[];
};

export const useGroups = () => {
  const { data, error, isLoading } = useSWR<Group[]>("groups", fetcher);

  return {
    groups: data,
    isLoading,
    isError: error,
  };
};
