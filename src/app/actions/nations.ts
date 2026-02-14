"use server";

import * as nationsDb from "@/lib/db/nations";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type NationInsert = TablesInsert<"nations">;
type NationUpdate = TablesUpdate<"nations">;

export async function getNationsAction(limit = 20) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return nationsDb.getNations(supabase, limit);
}

export async function createNationAction(nationData: NationInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return nationsDb.createNation(supabase, nationData);
}

export async function getNationByIdAction(nationId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return nationsDb.getNationById(supabase, nationId);
}

export async function updateNationAction(nationId: string, updateData: NationUpdate) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return nationsDb.updateNation(supabase, nationId, updateData);
}
