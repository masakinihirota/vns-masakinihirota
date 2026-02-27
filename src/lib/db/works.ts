import { eq } from "drizzle-orm";

import { db as database } from "./client";
import { userWorkEntries, works } from "./schema.postgres";

// Types
export type Work = {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  is_official: boolean | null;
  owner_user_id: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  description: string | null;
  tags: string[] | null;
  external_url: string | null;
  affiliate_url: string | null;
  release_year: string | number | null;
  scale: string | null;
  is_purchasable: boolean | null;
};

type WorkSelect = typeof works.$inferSelect;
type WorkDrizzleInsert = typeof works.$inferInsert;

// Mapper
/**
 *
 * @param w
 */
function mapToWorkDomain(w: WorkSelect): Work {
  return {
    id: w.id,
    title: w.title,
    author: w.author,
    category: w.category,
    is_official: w.isOfficial,
    owner_user_id: w.ownerUserId,
    status: w.status,
    created_at: w.createdAt,
    updated_at: w.updatedAt,
    description: w.description,
    tags: w.tags,
    external_url: w.externalUrl,
    affiliate_url: w.affiliateUrl,
    release_year: w.releaseYear ? Number.parseInt(w.releaseYear) : null,
    scale: w.scale,
    is_purchasable: w.isPurchasable,
  };
}

/**
 * Get works with optional limit
 * @param limit
 */
export const getWorks = async (limit = 20) => {
  const records = await database.query.works.findMany({
    limit,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
  return records.map(mapToWorkDomain);
};

import { isValidUUID } from "@/lib/utils";

/**
 * Get work by ID
 * @param workId
 */
export const getWorkById = async (workId: string) => {
  if (!isValidUUID(workId)) {
    return null;
  }

  const record = await database.query.works.findFirst({
    where: eq(works.id, workId),
  });
  return record ? mapToWorkDomain(record) : null;
};

/**
 * Create a new work
 * @param workData
 */
export const createWork = async (workData: Partial<Work>) => {
  const newWork: WorkDrizzleInsert = {
    title: workData.title!,
    author: workData.author,
    category: workData.category ?? "other",
    isOfficial: workData.is_official ?? false,
    ownerUserId: workData.owner_user_id ?? "",
    status: workData.status ?? "pending",
    description: workData.description,
    tags: workData.tags ?? [],
    externalUrl: workData.external_url,
    affiliateUrl: workData.affiliate_url,
    releaseYear: workData.release_year?.toString(),
    scale: workData.scale,
    isPurchasable: workData.is_purchasable ?? true,
  };

  const [inserted] = await database.insert(works).values(newWork).returning();
  return mapToWorkDomain(inserted);
};

/**
 * Create a new work with initial user entry
 * @param workData
 * @param entryData
 * @param entryData.status
 * @param entryData.tier
 * @param entryData.memo
 */
export const createWorkWithEntry = async (
  workData: Partial<Work>,
  entryData: { status: string; tier?: number; memo?: string }
) => {
  return await database.transaction(async (tx) => {
    const newWork: WorkDrizzleInsert = {
      title: workData.title!,
      author: workData.author,
      category: workData.category ?? "other",
      isOfficial: workData.is_official ?? false,
      ownerUserId: workData.owner_user_id ?? "",
      status: workData.status ?? "pending",
      description: workData.description,
      tags: workData.tags ?? [],
      externalUrl: workData.external_url,
      affiliateUrl: workData.affiliate_url,
      releaseYear: workData.release_year?.toString(),
      scale: workData.scale,
      isPurchasable: workData.is_purchasable ?? true,
    };

    const [insertedWork] = await tx.insert(works).values(newWork).returning();

    const newEntry = {
      userId: (workData.owner_user_id ?? "") as string,
      workId: insertedWork.id,
      status: entryData.status,
      tier: entryData.tier,
      memo: entryData.memo,
    };

    await tx.insert(userWorkEntries).values(newEntry);

    return mapToWorkDomain(insertedWork);
  });
};

/**
 * Update a work
 * @param workId
 * @param updateData
 */
export const updateWork = async (workId: string, updateData: Partial<Work>) => {
  const mappedData: Partial<WorkDrizzleInsert> = {};
  if (updateData.title !== undefined) mappedData.title = updateData.title;
  if (updateData.author !== undefined) mappedData.author = updateData.author;
  if (updateData.category !== undefined)
    mappedData.category = updateData.category ?? "other";
  if (updateData.is_official !== undefined)
    mappedData.isOfficial = updateData.is_official ?? undefined;
  if (updateData.status !== undefined)
    mappedData.status = updateData.status ?? "pending";
  if (updateData.description !== undefined)
    mappedData.description = updateData.description;
  if (updateData.tags !== undefined) mappedData.tags = updateData.tags;
  if (updateData.external_url !== undefined)
    mappedData.externalUrl = updateData.external_url;
  if (updateData.affiliate_url !== undefined)
    mappedData.affiliateUrl = updateData.affiliate_url;
  if (updateData.release_year !== undefined)
    mappedData.releaseYear = updateData.release_year?.toString();
  if (updateData.scale !== undefined) mappedData.scale = updateData.scale;
  if (updateData.is_purchasable !== undefined)
    mappedData.isPurchasable = updateData.is_purchasable ?? undefined;

  mappedData.updatedAt = new Date().toISOString();

  const [updated] = await database
    .update(works)
    .set(mappedData)
    .where(eq(works.id, workId))
    .returning();

  return updated ? mapToWorkDomain(updated) : null;
};
