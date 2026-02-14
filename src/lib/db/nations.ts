import { Database } from "@/types/database.types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { desc, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { nations } from "./schema";

type Nation = Tables<"nations">;
type NationInsert = TablesInsert<"nations">;
type NationUpdate = TablesUpdate<"nations">;

// Mapper Helpers
function mapNationToSupabase(n: any): Nation {
  return {
    id: n.id,
    name: n.name,
    description: n.description,
    avatar_url: n.avatarUrl,
    cover_url: n.coverUrl,
    is_official: n.isOfficial,
    owner_user_id: n.ownerUserId,
    owner_group_id: n.ownerGroupId,
    transaction_fee_rate: n.transactionFeeRate,
    foundation_fee: n.foundationFee,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
  };
}

export const getNations = async (
  supabase: SupabaseClient<Database> | null,
  limit = 20
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const result = await db.query.nations.findMany({
      limit: limit,
      orderBy: [desc(nations.createdAt)],
    });
    return result.map(mapNationToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nations")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export const createNation = async (
  supabase: SupabaseClient<Database> | null,
  nationData: NationInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const drizzleInput = {
      name: nationData.name,
      description: nationData.description,
      avatarUrl: nationData.avatar_url,
      coverUrl: nationData.cover_url,
      isOfficial: nationData.is_official,
      ownerUserId: nationData.owner_user_id,
      ownerGroupId: nationData.owner_group_id,
      transactionFeeRate: nationData.transaction_fee_rate,
      foundationFee: nationData.foundation_fee,
    };

    // Note: RPC create_nation might handle more than just insert?
    // Usually it creates the nation and sets the owner.
    // It might also create a default group?
    // For now, simple insert, as schema has Owner User ID.
    // If specific RPC logic exists (e.g. creating a 'nation group'), we might need to verify.
    // But based on available info, we'll do simple insert first.

    // @ts-expect-error
    const [newNation] = await db.insert(nations).values(drizzleInput).returning();
    return mapNationToSupabase(newNation);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nations")
    .insert(nationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getNationById = async (
  supabase: SupabaseClient<Database> | null,
  nationId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const nation = await db.query.nations.findFirst({
      where: eq(nations.id, nationId),
    });
    return nation ? mapNationToSupabase(nation) : null;
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nations")
    .select("*")
    .eq("id", nationId)
    .single();

  if (error) throw error;
  return data;
};

export const updateNation = async (
  supabase: SupabaseClient<Database> | null,
  nationId: string,
  updateData: NationUpdate
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const drizzleUpdate: any = {};
    if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
    if (updateData.description !== undefined) drizzleUpdate.description = updateData.description;
    if (updateData.avatar_url !== undefined) drizzleUpdate.avatarUrl = updateData.avatar_url;
    if (updateData.cover_url !== undefined) drizzleUpdate.coverUrl = updateData.cover_url;
    // add other fields as needed

    const [updated] = await db.update(nations).set(drizzleUpdate).where(eq(nations.id, nationId)).returning();
    return mapNationToSupabase(updated);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nations")
    .update(updateData)
    .eq("id", nationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
