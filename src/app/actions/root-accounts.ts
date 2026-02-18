"use server";

import * as rootDb from "@/lib/db/root-accounts";

export async function getRootAccountAction() {
  return rootDb.getRootAccount();
}
