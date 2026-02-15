import { Database, Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { userWorkEntries, works } from "./schema";

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
export const getWorks = async (
  supabase: SupabaseClient<Database> | null,
  limit = 20
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const records = await db.query.works.findMany({
      limit,
      orderBy: (table, { desc }) => [desc(table.createdAt)],
    });
    return records.map(mapWorkToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

import { isValidUUID } from "@/lib/utils";

/**
 * Get work by ID
 */
export const getWorkById = async (
  supabase: SupabaseClient<Database> | null,
  workId: string
) => {
  if (!isValidUUID(workId)) {
    return null;
  }

  if (process.env.USE_DRIZZLE === "true") {
    const record = await db.query.works.findFirst({
      where: eq(works.id, workId),
    });
    return record ? mapWorkToSupabase(record) : null;
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new work
 */
export const createWork = async (
  supabase: SupabaseClient<Database> | null,
  workData: WorkInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("works")
    .insert(workData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new work with initial user entry
 */
export const createWorkWithEntry = async (
  supabase: SupabaseClient<Database> | null,
  workData: WorkInsert,
  entryData: { status: string; tier?: number; memo?: string }
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  // Supabase implementation (no transaction support in client)
  const { data: work, error: workError } = await supabase
    .from("works")
    .insert(workData)
    .select()
    .single();

  if (workError) throw workError;

  const { error: entryError } = await supabase
    .from("user_work_entries")
    .insert({
      user_id: workData.owner_user_id!,
      work_id: work.id,
      status: entryData.status,
      tier: entryData.tier ?? null,
      memo: entryData.memo ?? null,
    });

  if (entryError) {
    // Basic rollback attempt
    await supabase.from("works").delete().eq("id", work.id);
    throw entryError;
  }

  return work;
};

/**
 * Update a work
 */
export const updateWork = async (
  supabase: SupabaseClient<Database> | null,
  workId: string,
  updateData: WorkUpdate
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // Map snake_case to camelCase for Drizzle update
    const mappedData: any = {};
    if (updateData.title !== undefined) mappedData.title = updateData.title;
    if (updateData.author !== undefined) mappedData.author = updateData.author;
    if (updateData.category !== undefined) mappedData.category = updateData.category;
    if (updateData.is_official !== undefined) mappedData.isOfficial = updateData.is_official;
    if (updateData.status !== undefined) mappedData.status = updateData.status;
    if (updateData.description !== undefined) mappedData.description = updateData.description;
    if (updateData.tags !== undefined) mappedData.tags = updateData.tags;
    if (updateData.external_url !== undefined) mappedData.externalUrl = updateData.external_url;
    if (updateData.affiliate_url !== undefined) mappedData.affiliateUrl = updateData.affiliate_url;
    if (updateData.release_year !== undefined) mappedData.releaseYear = updateData.release_year;
    if (updateData.scale !== undefined) mappedData.scale = updateData.scale;
    if (updateData.is_purchasable !== undefined) mappedData.isPurchasable = updateData.is_purchasable;

    mappedData.updatedAt = new Date().toISOString();

    const [updated] = await db
      .update(works)
      .set(mappedData)
      .where(eq(works.id, workId))
      .returning();

    return updated ? mapWorkToSupabase(updated) : null;
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("works")
    .update(updateData)
    .eq("id", workId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
