import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "./drizzle";
import { rootAccounts } from "./schema";

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

// Mapper Helper
function mapRootAccountToSupabase(ra: any): RootAccount {
  return {
    id: ra.id,
    auth_user_id: ra.authUserId,
    points: ra.points,
    level: ra.level,
    trust_days: ra.trustDays,
    data_retention_days: ra.dataRetentionDays,
    created_at: ra.createdAt,
    updated_at: ra.updatedAt,
  };
}

export const getRootAccount = cache(async () => {
  // We always need Supabase Auth to get the current user ID from the session (cookie).
  // Drizzle doesn't handle Auth state from cookies inherently.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  if (process.env.USE_DRIZZLE === "true") {
    const account = await db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.authUserId, user.id)
    });
    return account ? mapRootAccountToSupabase(account) : null;
  }

  const { data, error } = await supabase
    .from("root_accounts")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No root account found
      return null;
    }
    console.error("Error fetching root account:", error);
    return null;
  }

  return data as RootAccount;
});
