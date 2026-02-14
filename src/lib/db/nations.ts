import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

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
