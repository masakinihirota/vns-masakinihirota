#!/usr/bin/env tsx

import 'dotenv/config';

import { and, eq } from 'drizzle-orm';
import { db } from '../src/lib/db/client';
import {
  groupMembers,
  groups,
  nationCitizens,
  nations,
  rootAccounts,
  userPreferences,
  userProfiles,
  users,
} from '../src/lib/db/schema.postgres';
import { userInsertSchema, userPreferencesInsertSchema } from '../src/lib/db/schema.zod';
import { logger } from '../src/lib/logger';

const seedUser = {
  id: 'seed-user-001',
  email: 'seed-user@example.com',
  name: 'Seed User',
};

async function upsertUser(): Promise<string> {
  const userPayload = userInsertSchema.parse({
    id: seedUser.id,
    email: seedUser.email,
    name: seedUser.name,
    role: 'member',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db
    .insert(users)
    .values(userPayload)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: seedUser.email,
        name: seedUser.name,
        updatedAt: new Date(),
      },
    });

  try {
    const preferencesPayload = userPreferencesInsertSchema.parse({
      userId: seedUser.id,
      adsEnabled: true,
      locale: 'ja',
      theme: 'system',
      updatedAt: new Date(),
    });

    await db
      .insert(userPreferences)
      .values(preferencesPayload)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          adsEnabled: true,
          locale: 'ja',
          theme: 'system',
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    logger.warn('[SEED] Failed to seed user preferences. Continuing with core seed data.', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return seedUser.id;
}

async function ensureRootAccount(authUserId: string): Promise<string> {
  const existing = await db
    .select({ id: rootAccounts.id })
    .from(rootAccounts)
    .where(eq(rootAccounts.authUserId, authUserId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const inserted = await db
    .insert(rootAccounts)
    .values({
      authUserId,
      trustDays: 0,
      dataRetentionDays: 30,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: rootAccounts.id });

  return inserted[0].id;
}

async function ensureProfile(rootAccountId: string): Promise<string> {
  const existing = await db
    .select({ id: userProfiles.id })
    .from(userProfiles)
    .where(eq(userProfiles.rootAccountId, rootAccountId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const inserted = await db
    .insert(userProfiles)
    .values({
      rootAccountId,
      displayName: 'シードユーザー',
      roleType: 'member',
      isActive: true,
      isDefault: false,
      maskCategory: 'persona',
      points: 0,
      level: 1,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: userProfiles.id });

  await db
    .update(rootAccounts)
    .set({
      activeProfileId: inserted[0].id,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(rootAccounts.id, rootAccountId));

  return inserted[0].id;
}

async function ensureGroup(profileId: string): Promise<string> {
  const existing = await db
    .select({ id: groups.id })
    .from(groups)
    .where(and(eq(groups.name, 'seed-group'), eq(groups.leaderId, profileId)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const inserted = await db
    .insert(groups)
    .values({
      name: 'seed-group',
      description: '開発用シードグループ',
      isOfficial: false,
      leaderId: profileId,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: groups.id });

  await db.insert(groupMembers).values({
    groupId: inserted[0].id,
    userProfileId: profileId,
    role: 'leader',
  }).onConflictDoNothing();

  return inserted[0].id;
}

async function ensureNation(profileId: string): Promise<string> {
  const existing = await db
    .select({ id: nations.id })
    .from(nations)
    .where(and(eq(nations.name, 'seed-nation'), eq(nations.ownerUserId, profileId)))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].id;
  }

  const inserted = await db
    .insert(nations)
    .values({
      name: 'seed-nation',
      description: '開発用シード国家',
      isOfficial: false,
      ownerUserId: profileId,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: nations.id });

  await db
    .insert(nationCitizens)
    .values({
      nationId: inserted[0].id,
      userProfileId: profileId,
      role: 'official',
    })
    .onConflictDoNothing();

  return inserted[0].id;
}

async function runSeed(): Promise<void> {
  logger.info('[SEED] Start seeding development data');

  const authUserId = await upsertUser();
  let rootAccountId: string | null = null;
  let profileId: string | null = null;
  let groupId: string | null = null;
  let nationId: string | null = null;

  try {
    rootAccountId = await ensureRootAccount(authUserId);
    profileId = await ensureProfile(rootAccountId);
    groupId = await ensureGroup(profileId);
    nationId = await ensureNation(profileId);
  } catch (error) {
    logger.warn('[SEED] Optional domain seed failed. Core auth user seed is completed.', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  logger.info('[SEED] Seeding completed', {
    authUserId,
    rootAccountId,
    profileId,
    groupId,
    nationId,
  });
}

runSeed().catch((error) => {
  logger.error('[SEED] Failed to seed data', error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
});
