import { createClient } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createGroupDrizzle,
  getGroupByIdDrizzle,
  joinGroupDrizzle,
} from "@/lib/db/drizzle/groups.drizzle";
import { createUserProfileDrizzle } from "@/lib/db/drizzle/user-profiles.drizzle";
import { db } from "@/lib/drizzle/client";

// Use Supabase Admin client to manage auth users
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:64321";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required for integration tests"
  );
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

describe("Groups Drizzle DAL Integration", () => {
  let leaderUserId: string;
  let leaderProfileId: string;
  let memberUserId: string;
  let memberProfileId: string;

  // Cleanup helper
  const cleanupUser = async (userId: string) => {
    if (userId) await adminClient.auth.admin.deleteUser(userId);
  };

  beforeAll(async () => {
    // 1. Create Leader User via Auth
    const leaderEmail = `drizzle-leader-${uuidv4()}@example.com`;
    const { data: leaderAuth, error: leaderError } =
      await adminClient.auth.admin.createUser({
        email: leaderEmail,
        password: "password123",
        email_confirm: true,
      });
    if (leaderError) throw leaderError;
    leaderUserId = leaderAuth.user.id;

    // Root account is created by trigger. We need to fetch it or wait for it.
    // Drizzle client can query it.
    // Wait slightly for trigger
    await new Promise((r) => setTimeout(r, 500));

    // Find root account
    const rootAccounts = await db.execute(
      sql`SELECT id FROM root_accounts WHERE auth_user_id = ${leaderUserId}`
    );
    const rootAccountId = rootAccounts[0]?.id;
    if (!rootAccountId) throw new Error("Leader root account not found");

    // Create Profile via Drizzle
    const leaderProfile = await createUserProfileDrizzle(
      rootAccountId as string,
      {
        display_name: "Drizzle Leader",
        role_type: "leader",
      }
    );
    leaderProfileId = leaderProfile.id;

    // 2. Create Member User
    const memberEmail = `drizzle-member-${uuidv4()}@example.com`;
    const { data: memberAuth, error: memberError } =
      await adminClient.auth.admin.createUser({
        email: memberEmail,
        password: "password123",
        email_confirm: true,
      });
    if (memberError) throw memberError;
    memberUserId = memberAuth.user.id;

    await new Promise((r) => setTimeout(r, 500));
    const memberRoots = await db.execute(
      sql`SELECT id FROM root_accounts WHERE auth_user_id = ${memberUserId}`
    );
    const memberRootId = memberRoots[0]?.id;
    if (!memberRootId) throw new Error("Member root account not found");

    const memberProfile = await createUserProfileDrizzle(
      memberRootId as string,
      {
        display_name: "Drizzle Member",
        role_type: "member",
      }
    );
    memberProfileId = memberProfile.id;
  });

  afterAll(async () => {
    await cleanupUser(leaderUserId);
    await cleanupUser(memberUserId);
  });

  it("should create a group via Drizzle", async () => {
    const groupName = `Drizzle Group ${uuidv4()}`;
    const newGroup = await createGroupDrizzle({
      name: groupName,
      leader_id: leaderProfileId,
      description: "Created by Drizzle",
    });

    expect(newGroup).toBeDefined();
    expect(newGroup.name).toBe(groupName);
    expect(newGroup.leaderId).toBe(leaderProfileId);

    // Verify retrieval
    const fetchedGroup = await getGroupByIdDrizzle(newGroup.id);
    expect(fetchedGroup).toBeDefined();
    expect(fetchedGroup!.name).toBe(groupName);
  });

  it("should allow a member to join a group", async () => {
    // Create a fresh group
    const groupName = `Joinable Group ${uuidv4()}`;
    const group = await createGroupDrizzle({
      name: groupName,
      leader_id: leaderProfileId,
    });

    // Join
    const membership = await joinGroupDrizzle(group.id, memberProfileId);
    expect(membership).toBeDefined();
    expect(membership.groupId).toBe(group.id);
    expect(membership.userProfileId).toBe(memberProfileId);
    expect(membership.role).toBe("member");
  });
});
