"use server";

import * as worksDb from "@/lib/db/works";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type WorkInsert = TablesInsert<"works">;
type WorkUpdate = TablesUpdate<"works">;

export async function getWorksAction(limit = 20) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return worksDb.getWorks(supabase, limit);
}

export async function getWorkByIdAction(workId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return worksDb.getWorkById(supabase, workId);
}

export async function createWorkAction(workData: WorkInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return worksDb.createWork(supabase, workData);
}

export async function createWorkWithEntryAction(
  workData: WorkInsert,
  entryData: { status: string; tier?: number; memo?: string }
) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return worksDb.createWorkWithEntry(supabase, workData, entryData);
}

export async function updateWorkAction(workId: string, updateData: WorkUpdate) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return worksDb.updateWork(supabase, workId, updateData);
}
