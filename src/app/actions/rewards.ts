"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/helper";
import { getPointHistory, grantPoints } from "@/lib/db/rewards";

export async function claimDailyBonusAction() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return { success: false, message: "Login required" };
  }

  try {
    // Check if user already claimed today
    const history = await getPointHistory(user.id, 100);
    const today = new Date().toISOString().split("T")[0];
    const hasClaimed = history.some(
      (h) =>
        h.type === "daily_login" &&
        new Date(h.createdAt).toISOString().split("T")[0] === today
    );

    if (hasClaimed) {
      return { success: false, message: "Already claimed today" };
    }

    await grantPoints(user.id, 100, "daily_login", "Daily Login Bonus");

    revalidatePath("/rewards");
    revalidatePath("/", "layout"); // Update header points possibly
    return { success: true, message: "Daily bonus claimed!" };
  } catch (error) {
    console.error("Failed to claim bonus:", error);
    return { success: false, message: "Failed to claim bonus" };
  }
}

export async function getPointHistoryAction() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) return [];

  return await getPointHistory(user.id);
}

