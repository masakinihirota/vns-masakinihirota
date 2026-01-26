import { createClient } from "@/lib/supabase/server";

export async function hasRootAccount(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("root_accounts")
    .select("id")
    .eq("auth_user_id", userId)
    .single();
  return !!data;
}

export async function getRootAccountId(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("root_accounts")
    .select("id")
    .eq("auth_user_id", userId)
    .single();
  return data?.id || null;
}

export async function hasSelectedMode(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("root_accounts")
    .select("selected_mode")
    .eq("auth_user_id", userId)
    .single();
  return !!data?.selected_mode;
}
