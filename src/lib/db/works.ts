import { eq } from "drizzle-orm";
import { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { db } from "./drizzle-postgres";
import { userWorkEntries, works } from "./schema.postgres";

// Types
type Work = Tables<"works">;
type WorkInsert = TablesInsert<"works">;
type WorkUpdate = TablesUpdate<"works">;

// Mapper
function mapWorkToSupabase(w: any): Work {
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
    release_year: w.releaseYear,
    scale: w.scale,
    is_purchasable: w.isPurchasable,
  };
}

/**
 * Get works with optional limit
 */
export const getWorks = async (limit = 20) => {
  const records = await db.query.works.findMany({
    limit,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
  return records.map(mapWorkToSupabase);
};

import { isValidUUID } from "@/lib/utils";

/**
 * Get work by ID
 */
export const getWorkById = async (workId: string) => {
  if (!isValidUUID(workId)) {
    return null;
  }

  const record = await db.query.works.findFirst({
    where: eq(works.id, workId),
  });
  return record ? mapWorkToSupabase(record) : null;
};

/**
 * Create a new work
 */
export const createWork = async (workData: WorkInsert) => {
  // Map snake_case to camelCase for Drizzle
  const newWork = {
    title: workData.title,
    author: workData.author,
    category: workData.category,
    isOfficial: workData.is_official ?? false,
    ownerUserId: workData.owner_user_id,
    status: workData.status ?? "pending",
    description: workData.description,
    tags: workData.tags ?? [],
    externalUrl: workData.external_url,
    affiliateUrl: workData.affiliate_url,
    releaseYear: workData.release_year,
    scale: workData.scale,
    isPurchasable: workData.is_purchasable ?? true,
  };

  // @ts-ignore: Drizzle types might be strict about exact shape match, but this mapping is correct
  const [inserted] = await db.insert(works).values(newWork).returning();
  return mapWorkToSupabase(inserted);
};

/**
 * Create a new work with initial user entry
 */
export const createWorkWithEntry = async (
  workData: WorkInsert,
  entryData: { status: string; tier?: number; memo?: string }
) => {
  return await db.transaction(async (tx) => {
    // 1. Create Work
    const newWork = {
      title: workData.title,
      author: workData.author,
      category: workData.category,
      isOfficial: workData.is_official ?? false,
      ownerUserId: workData.owner_user_id,
      status: workData.status ?? "pending",
      description: workData.description,
      tags: workData.tags ?? [],
      externalUrl: workData.external_url,
      affiliateUrl: workData.affiliate_url,
      releaseYear: workData.release_year,
      scale: workData.scale,
      isPurchasable: workData.is_purchasable ?? true,
    };

    // @ts-ignore
    const [insertedWork] = await tx.insert(works).values(newWork).returning();

    // 2. Create User Entry
    const newEntry = {
      userId: workData.owner_user_id as string,
      workId: insertedWork.id,
      status: entryData.status,
      tier: entryData.tier,
      memo: entryData.memo,
    };

    // @ts-ignore
    await tx.insert(userWorkEntries).values(newEntry);

    return mapWorkToSupabase(insertedWork);
  });
};

/**
 * Update a work
 */
export const updateWork = async (workId: string, updateData: WorkUpdate) => {
  // Map snake_case to camelCase for Drizzle update
  const mappedData: any = {};
  if (updateData.title !== undefined) mappedData.title = updateData.title;
  if (updateData.author !== undefined) mappedData.author = updateData.author;
  if (updateData.category !== undefined)
    mappedData.category = updateData.category;
  if (updateData.is_official !== undefined)
    mappedData.isOfficial = updateData.is_official;
  if (updateData.status !== undefined) mappedData.status = updateData.status;
  if (updateData.description !== undefined)
    mappedData.description = updateData.description;
  if (updateData.tags !== undefined) mappedData.tags = updateData.tags;
  if (updateData.external_url !== undefined)
    mappedData.externalUrl = updateData.external_url;
  if (updateData.affiliate_url !== undefined)
    mappedData.affiliateUrl = updateData.affiliate_url;
  if (updateData.release_year !== undefined)
    mappedData.releaseYear = updateData.release_year;
  if (updateData.scale !== undefined) mappedData.scale = updateData.scale;
  if (updateData.is_purchasable !== undefined)
    mappedData.isPurchasable = updateData.is_purchasable;

  mappedData.updatedAt = new Date().toISOString();

  const [updated] = await db
    .update(works)
    .set(mappedData)
    .where(eq(works.id, workId))
    .returning();

  return updated ? mapWorkToSupabase(updated) : null;
};
