"use server";

import * as worksDb from "@/lib/db/works";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type WorkInsert = TablesInsert<"works">;
type WorkUpdate = TablesUpdate<"works">;

export async function getWorksAction(limit = 20) {
  return worksDb.getWorks(limit);
}

export async function getWorkByIdAction(workId: string) {
  return worksDb.getWorkById(workId);
}

export async function createWorkAction(workData: WorkInsert) {
  return worksDb.createWork(workData);
}

export async function createWorkWithEntryAction(
  workData: WorkInsert,
  entryData: { status: string; tier?: number; memo?: string }
) {
  return worksDb.createWorkWithEntry(workData, entryData);
}

export async function updateWorkAction(workId: string, updateData: WorkUpdate) {
  return worksDb.updateWork(workId, updateData);
}
