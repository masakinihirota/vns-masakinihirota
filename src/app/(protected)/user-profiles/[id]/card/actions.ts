"use server";

import { auth } from "@/lib/auth";
import {
  upsertBusinessCard,
  UpsertBusinessCardData,
} from "@/lib/db/business-cards";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function saveBusinessCardSettings(
  profileId: string,
  data: UpsertBusinessCardData
) {
  // Better-Auth による認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // プロフィールの存在確認
  // 注意: RLS が upsertBusinessCard の Supabase クエリを保護する
  try {
    await upsertBusinessCard(profileId, data);
    revalidatePath(`/user-profiles/${profileId}/card`);
    revalidatePath(`/user-profiles/${profileId}`);
    return { success: true };
  } catch (error) {
    console.error("ビジネスカード設定の保存に失敗しました:", error);
    return { success: false, error: "設定の保存に失敗しました" };
  }
}
