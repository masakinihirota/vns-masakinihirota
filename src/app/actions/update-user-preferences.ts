"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { userPreferences } from "@/lib/db/schema.postgres";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateUserPreferences(data: {
  adsEnabled?: boolean;
  locale?: string;
  theme?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "Authentication required", success: false };
  }

  const userId = session.user.id;

  try {
    // Upsert equivalent in Drizzle
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userPreferences)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values({
        userId,
        adsEnabled: data.adsEnabled ?? true,
        locale: data.locale ?? "ja",
        theme: data.theme ?? "system",
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return { error: "Failed to update preferences", success: false };
  }
}

export async function getUserPreferences() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  try {
    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    return prefs[0] || null;
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return null;
  }
}
