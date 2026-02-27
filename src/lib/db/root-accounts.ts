import { eq } from "drizzle-orm";
import { cache } from "react";

import { auth } from "@/lib/auth/helper";

import { db as database } from "./client";
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
/**
 *
 * @param ra
 */
function mapToRootAccountDomain(ra: unknown): RootAccount {
  const account = ra as Record<string, unknown>;
  return {
    id: account.id as string,
    auth_user_id: account.authUserId as string,
    points: account.points as number,
    level: account.level as number,
    trust_days: account.trustDays as number,
    data_retention_days: account.dataRetentionDays as number | null,
    created_at: account.createdAt as string,
    updated_at: account.updatedAt as string,
  };
}

export const getRootAccount = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const account = await database.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, session.user.id),
  });
  return account ? mapToRootAccountDomain(account) : null;
});
