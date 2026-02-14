import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isDrizzle } from "./adapter";
import { createNationDrizzle, getNationByIdDrizzle } from "./drizzle";

export const createNation = async (
  supabase: SupabaseClient<Database>,
  nationData: {
    name: string;
    description?: string;
    avatar_url?: string;
    cover_url?: string;
    owner_user_id: string;
    owner_group_id: string;
    transaction_fee_rate: number;
    foundation_fee: number;
  }
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return createNationDrizzle(nationData);
  }

  const { data, error } = await supabase
    .from("nations")
    .insert(nationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNationById = async (
  supabase: SupabaseClient<Database>,
  nationId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return getNationByIdDrizzle(nationId);
  }

  const { data, error } = await supabase
    .from("nations")
    .select("*")
    .eq("id", nationId)
    .single();

  if (error) throw error;
  return data;
};

// ... other functions (join, update roles, etc.)
// ... we'll need to handle Citizen vs Group roles differently
