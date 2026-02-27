"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getUserProfilesByAuthUserId } from "@/lib/db/user-profiles";

/**
 * 現在のログインユーザーに紐づくプロフィール一覧を取得する
 */
export async function getMyProfilesAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const profiles = await getUserProfilesByAuthUserId(session.user.id);
    return { success: true, data: profiles };
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
    return { success: false, error: "Failed to fetch profiles", data: [] };
  }
}
