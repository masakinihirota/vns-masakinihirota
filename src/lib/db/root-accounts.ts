import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type RootAccount = {
  id: string;
  auth_user_id: string;
  points: number;
  level: number;
  trust_days: number;
  data_retention_days: number | null;
  created_at: string;
  updated_at: string;
};

export const getRootAccount = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("root_accounts")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No root account found, might be race condition with trigger or old user?
      // Should handle gracefully or return null
      return null;
    }
    console.error("Error fetching root account:", error);
    return null;
  }

  return data as RootAccount;
});
