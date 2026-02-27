"use server";

import type { NewWork } from "@/lib/db/types";
import * as worksDb from "@/lib/db/works";

type WorkInsert = NewWork;
type WorkUpdate = Partial<NewWork>;

/**
 *
 * @param limit
 */
export async function getWorksAction(limit = 20) {
  return worksDb.getWorks(limit);
}

/**
 *
 * @param workId
 */
export async function getWorkByIdAction(workId: string) {
  return worksDb.getWorkById(workId);
}

/**
 *
 * @param workData
 */
export async function createWorkAction(workData: WorkInsert) {
  return worksDb.createWork(workData);
}

/**
 *
 * @param workData
 * @param entryData
 * @param entryData.status
 * @param entryData.tier
 * @param entryData.memo
 */
export async function createWorkWithEntryAction(
  workData: WorkInsert,
  entryData: { status: string; tier?: number; memo?: string }
) {
  return worksDb.createWorkWithEntry(workData, entryData);
}

/**
 *
 * @param workId
 * @param updateData
 */
export async function updateWorkAction(workId: string, updateData: WorkUpdate) {
  return worksDb.updateWork(workId, updateData);
}
