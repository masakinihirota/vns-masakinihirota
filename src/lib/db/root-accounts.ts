import { eq } from "drizzle-orm";
import { cache } from "react";
import { auth } from "@/lib/auth/helper";
import { db } from "./drizzle-postgres";
import { rootAccounts } from "./schema.postgres";

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
  const session = await auth();
  if (!session?.user?.id) return null;

  const account = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, session.user.id),
  });
  return account ? mapRootAccountToSupabase(account) : null;
});
