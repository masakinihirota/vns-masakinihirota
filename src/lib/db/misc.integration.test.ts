import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import {
  getBusinessCardByProfileId,
  upsertBusinessCard,
} from "./business-cards";
import { db } from "./drizzle-postgres";
import {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
} from "./notifications";
import { businessCards, notifications } from "./schema.postgres";

describe("Misc Integration (Drizzle)", () => {
  let testProfileId: string;

  beforeAll(async () => {
    const profile = await db.query.userProfiles.findFirst();
    if (!profile) throw new Error("Need a profile");
    testProfileId = profile.id;
  });

  // Business Cards Tests
  it("should upsert and get a business card", async () => {
    const cardData = {
      is_published: true,
      display_config: { show_role_type: true },
      content: { value: { feedback_stance: "balanced" as const } },
    };

    const card = await upsertBusinessCard(testProfileId, cardData);
    expect(card).toBeDefined();
    expect(card.user_profile_id).toBe(testProfileId);
    expect(card.is_published).toBe(true);
    expect(card.content.value?.feedback_stance).toBe("balanced");

    // Fetch
    const fetched = await getBusinessCardByProfileId(testProfileId);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(card.id);
    expect(fetched?.is_published).toBe(true);

    // Cleanup card
    await db
      .delete(businessCards)
      .where(eq(businessCards.userProfileId, testProfileId));
  });

  // Notifications Tests
  let notificationId: string;

  it("should create a notification", async () => {
    const notifData = {
      user_profile_id: testProfileId,
      title: "Test Notification",
      message: "This is a test",
      type: "system" as const,
    };

    const notif = await createNotification(notifData as any);
    expect(notif).toBeDefined();
    expect(notif.title).toBe("Test Notification");
    expect(notif.is_read).toBe(false);

    notificationId = notif.id;
  });

  it("should list unread notifications", async () => {
    expect(notificationId).toBeDefined();

    const list = await getUnreadNotifications(testProfileId);
    expect(list).toBeDefined();
    const found = list.find((n: any) => n.id === notificationId);
    expect(found).toBeDefined();
  });

  it("should mark notification as read", async () => {
    expect(notificationId).toBeDefined();

    const updated = await markNotificationAsRead(notificationId);
    expect(updated.is_read).toBe(true);

    // Verify it's gone from unread
    const list = await getUnreadNotifications(testProfileId);
    const found = list.find((n: any) => n.id === notificationId);
    expect(found).toBeUndefined();

    // Cleanup
    await db.delete(notifications).where(eq(notifications.id, notificationId));
  });
});
