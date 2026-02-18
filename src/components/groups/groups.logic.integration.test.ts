import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/types/types_db";
import {
  createGroup,
  deleteGroup,
  getGroupMembers,
  joinGroup,
  leaveGroup,
} from "./groups.logic";

// Use environment variables or defaults for local development
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:64321";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJFUzI1NiIsImtpZCI6IjRhYmE0Zjk5LTlmYjYtNGM0Yi1iNDEwLThhOGY0ODhkOWRiYSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODYwODkzNzd9.ng2SjvD6lmnqN6E7rwsemfF2fw7AHyzlA5FSl_7VzDkzIUuNWuoWuDzKXHz_g6DDa_O9OuAXGAvDoKMwt4jShg";

// Helper to create a client with a clean session
function createTestClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

describe("Groups Logic Integration", () => {
  let leaderClient: ReturnType<typeof createClient<Database>>;
  let leaderUserId: string;
  let leaderProfileId: string;

  let memberClient: ReturnType<typeof createClient<Database>>;
  let memberUserId: string;
  let memberProfileId: string;

  beforeAll(async () => {
    // 1. Setup Leader
    leaderClient = createTestClient();
    const leaderEmail = `leader-${uuidv4()}@example.com`;
    const password = "password123";

    const { data: leaderAuth, error: leaderAuthError } =
      await leaderClient.auth.signUp({
        email: leaderEmail,
        password: password,
      });
    if (leaderAuthError) throw leaderAuthError;
    leaderUserId = leaderAuth.user!.id;

    // Root account is created by trigger, so we fetch it
    // Wait a bit for trigger
    await new Promise((r) => setTimeout(r, 500));
    const { data: leaderRoot, error: rootError } = await leaderClient
      .from("root_accounts")
      .select("id")
      .eq("auth_user_id", leaderUserId)
      .single();
    if (rootError) throw rootError;

    // Create user_profile for leader
    const { data: leaderProfile } = await leaderClient
      .from("user_profiles")
      .insert({
        root_account_id: leaderRoot!.id,
        display_name: "Test Leader",
        role_type: "leader", // Assuming role_type check allows 'leader' or 'member'
      })
      .select("id")
      .single();
    leaderProfileId = leaderProfile!.id;

    // 2. Setup Member
    memberClient = createTestClient();
    const memberEmail = `member-${uuidv4()}@example.com`;

    const { data: memberAuth, error: memberAuthError } =
      await memberClient.auth.signUp({
        email: memberEmail,
        password: password,
      });
    if (memberAuthError) throw memberAuthError;
    memberUserId = memberAuth.user!.id;

    // Wait for trigger
    await new Promise((r) => setTimeout(r, 500));
    const { data: memberRoot, error: memberRootError } = await memberClient
      .from("root_accounts")
      .select("id")
      .eq("auth_user_id", memberUserId)
      .single();
    if (memberRootError) throw memberRootError;

    const { data: memberProfile } = await memberClient
      .from("user_profiles")
      .insert({
        root_account_id: memberRoot!.id,
        display_name: "Test Member",
        role_type: "member",
      })
      .select("id")
      .single();
    memberProfileId = memberProfile!.id;
  });

  it("should create a group, join it, and verify membership", async () => {
    const groupName = `Integration Group ${uuidv4()}`;

    // 1. Leader creates group
    const newGroup = await createGroup({
      name: groupName,
      leader_id: leaderProfileId,
      description: "Integration Test Group",
    });

    expect(newGroup).toBeDefined();
    expect(newGroup.leader_id).toBe(leaderProfileId);

    // 2. Member joins group
    await joinGroup(newGroup.id, memberProfileId);

    // 3. Verify members list
    const members = await getGroupMembers(newGroup.id);
    expect(members).toBeDefined();
    expect(members!.length).toBeGreaterThanOrEqual(2); // Leader + Member

    const joinedMember = members!.find(
      (m: any) => m.user_profile_id === memberProfileId
    );
    expect(joinedMember).toBeDefined();

    // 4. Member leaves group
    await leaveGroup(newGroup.id, memberProfileId);

    // 5. Verify members list again
    const membersAfterLeave = await getGroupMembers(newGroup.id);
    const leftMember = membersAfterLeave!.find(
      (m: any) => m.user_profile_id === memberProfileId
    );
    expect(leftMember).toBeUndefined();

    // 6. Leader deletes group
    await deleteGroup(newGroup.id);

    // 7. Verify group is gone
    const { data: deletedGroup } = await leaderClient
      .from("groups")
      .select("*")
      .eq("id", newGroup.id)
      .maybeSingle();
    expect(deletedGroup).toBeNull();
  });
});
