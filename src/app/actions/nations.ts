"use server";

import * as nationsDb from "@/lib/db/nations";
import type { TablesInsert, TablesUpdate } from "@/types/types_db";

type NationInsert = TablesInsert<"nations">;
type NationUpdate = TablesUpdate<"nations">;

export async function getNationsAction(limit = 20) {
  return nationsDb.getNations(limit);
}

export async function createNationAction(nationData: NationInsert) {
  return nationsDb.createNation(nationData);
}

export async function getNationByIdAction(nationId: string) {
  return nationsDb.getNationById(nationId);
}

export async function updateNationAction(nationId: string, updateData: NationUpdate) {
  return nationsDb.updateNation(nationId, updateData);
}
