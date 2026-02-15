"use server";

import { getPointHistory, grantPoints } from "@/lib/db/rewards";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimDailyBonusAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Login required" };
  }

  try {
    // Check if user already claimed today
    const history = await getPointHistory(supabase, user.id, 100);
    const today = new Date().toISOString().split('T')[0];
    const hasClaimed = history.some((h) =>
      h.type === 'daily_login' &&
      new Date(h.createdAt).toISOString().split('T')[0] === today
    );

    if (hasClaimed) {
      return { success: false, message: "Already claimed today" };
    }

    await grantPoints(supabase, user.id, 100, "daily_login", "Daily Login Bonus");

    revalidatePath("/rewards");
    revalidatePath("/", "layout"); // Update header points possibly
    return { success: true, message: "Daily bonus claimed!" };
  } catch (error) {
    console.error("Failed to claim bonus:", error);
    return { success: false, message: "Failed to claim bonus" };
  }
}

export async function getPointHistoryAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Pass supabase client for fallback
  return await getPointHistory(supabase, user.id);
}
