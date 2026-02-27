"use client";

import useSWR from "swr";

import { Group } from "./groups.types";

const fetcher = async () => {
  const response = await fetch("/api/groups/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching groups: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch groups");
  }

  return data.data as Group[];
};

export const useGroups = () => {
  const { data, error, isLoading } = useSWR<Group[]>("groups", fetcher);

  return {
    groups: data,
    isLoading,
    isError: error,
  };
};
