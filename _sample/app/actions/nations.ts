"use server";

import * as nationsDb from "@/lib/db/nations";
import type { NewNation } from "@/lib/db/types";

type NationInsert = NewNation;
type NationUpdate = Partial<NewNation>;

/**
 *
 * @param limit
 */
export async function getNationsAction(limit = 20) {
  return nationsDb.getNations(limit);
}

/**
 *
 * @param nationData
 */
export async function createNationAction(nationData: NationInsert) {
  return nationsDb.createNation(nationData);
}

/**
 *
 * @param nationId
 */
export async function getNationByIdAction(nationId: string) {
  return nationsDb.getNationById(nationId);
}

/**
 *
 * @param nationId
 * @param updateData
 */
export async function updateNationAction(
  nationId: string,
  updateData: NationUpdate
) {
  return nationsDb.updateNation(nationId, updateData);
}
