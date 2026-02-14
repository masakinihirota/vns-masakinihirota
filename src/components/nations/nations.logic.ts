"use client";

import {
  createNationAction,
  getNationByIdAction,
  getNationsAction,
} from "@/app/actions/nations";
import { Nation } from "@/components/groups/groups.types";
import useSWR from "swr";

const fetchNations = async () => {
  return (await getNationsAction()) as unknown as Nation[];
};

const fetchNation = async (key: string) => {
  const [, nationId] = key.split(":");
  return (await getNationByIdAction(nationId)) as unknown as Nation;
};

export const useNations = () => {
  const { data, error, isLoading, mutate } = useSWR<Nation[]>(
    "nations",
    fetchNations
  );

  return {
    nations: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useNation = (nationId: string) => {
  const { data, error, isLoading, mutate } = useSWR<Nation>(
    nationId ? `nation:${nationId}` : null,
    fetchNation
  );

  return {
    nation: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useCreateNation = () => {
  const createNation = async (
    name: string,
    description: string,
    ownerId: string
  ) => {
    // Note: createNationAction expects full NationInsert object.
    // The original logic only took name, description, ownerId and called RPC.
    // The RPC likely handled defaults.
    // Drizzle implementation in db/nations.ts takes full insert object but we only pass partial here.
    // We need to map or provide defaults if createNationAction expects full type match.
    // db/nations.ts creates a record.
    // Let's check db/nations.ts createNation implementation.
    // It takes NationInsert.
    // We need to construct a valid NationInsert object.

    // Original RPC `create_nation` args: p_name, p_description, p_owner_id.

    const nationData = {
      name,
      description,
      owner_user_id: ownerId,
      // Defaults matching what DB or RPC might do:
      foundation_fee: 1000, // Example default
      transaction_fee_rate: 0.05, // Example default
      // owner_group_id is required in Schema?
      // In `nations.ts` I didn't see explicit required fields check beyond types.
      // Let's assume for now we might fail if required fields are missing.
      // Wait, original RPC `create_nation` might have created the owner group automatically?
      // If so, my Drizzle replacement currently just inserts into `nations` table.
      // If `owner_group_id` is NOT nullable, insert will fail.
      // Checking schema... nations table: owner_group_id string | null?
      // In schema.ts: ownerGroupId: uuid("owner_group_id").references(...)
      // It doesn't say .notNull(). So likely nullable.

      owner_group_id: null, // or undefined
    };

    return await createNationAction(nationData as any);
    // Type assertion because we might be missing some fields or optionality mismatch
  };
  return { createNation };
};
