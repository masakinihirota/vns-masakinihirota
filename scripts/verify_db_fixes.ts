import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load env vars manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const [key, ...values] = line.split("=");
    if (key && values.length > 0) {
      const val = values
        .join("=")
        .trim()
        .replace(/^["']|["']$/g, "");
      process.env[key.trim()] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars (SUPABASE_URL or SERVICE_ROLE_KEY)");
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
  console.log("Starting DB Antipattern Fix Verification...");

  // 1. Setup Test Users
  console.log("Setting up test users...");
  const emailA = `test_a_${Date.now()}@example.com`;
  const emailB = `test_b_${Date.now()}@example.com`;

  const { data: userA, error: errA } = await adminClient.auth.admin.createUser({
    email: emailA,
    password: "password123",
    email_confirm: true,
  });
  if (errA) throw errA;

  const { data: userB, error: errB } = await adminClient.auth.admin.createUser({
    email: emailB,
    password: "password123",
    email_confirm: true,
  });
  if (errB) throw errB;

  console.log(`Created users: A(${userA.user.id}), B(${userB.user.id})`);

  // Create clients for A and B
  const {
    data: { session: sessionA },
  } = await adminClient.auth.signInWithPassword({
    email: emailA,
    password: "password123",
  });
  const {
    data: { session: sessionB },
  } = await adminClient.auth.signInWithPassword({
    email: emailB,
    password: "password123",
  });

  const clientA = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${sessionA?.access_token}` } },
  });

  // 2. Test: Secure create_group_with_leader (Atomic)
  console.log("\n[Test] Atomic Group Creation...");
  const { data: groupA, error: groupError } = await clientA.rpc(
    "create_group_with_leader",
    {
      p_name: "Group A",
      p_leader_id: userA.user.id,
      p_description: "Test Group",
    }
  );

  if (groupError) {
    console.error("❌ Failed to create group:", groupError);
  } else {
    console.log("✅ Group created via RPC:", groupA.id);

    // Verify member
    const { data: member } = await clientA
      .from("group_members")
      .select("*")
      .eq("group_id", groupA.id)
      .eq("user_profile_id", userA.user.id)
      .single();

    if (member && member.role === "leader") {
      console.log("✅ Leader correctly added to group_members");
    } else {
      console.error("❌ Leader missing from group_members");
    }
  }

  // 3. Test: Security Check in create_group_with_leader (Impersonation)
  console.log("\n[Test] Security Check: Impersonation in Group Creation...");
  const { error: impError } = await clientA.rpc("create_group_with_leader", {
    p_name: "Hacked Group",
    p_leader_id: userB.user.id, // User A trying to make User B leader
  });

  if (impError && impError.message.includes("Unauthorized")) {
    console.log("✅ Correctly rejected impersonation attempt");
  } else {
    console.error("❌ Failed to reject impersonation:", impError);
  }

  // 4. Test: Nation Posts Constraint
  console.log("\n[Test] Nation Posts Exclusive Arc Constraint...");
  // Create a nation first (need points, so giving points to root account)
  // Give points to User A
  const { data: rootA } = await adminClient
    .from("root_accounts")
    .select("id")
    .eq("auth_user_id", userA.user.id)
    .single();
  if (!rootA) throw new Error("rootA not found");
  await adminClient
    .from("root_accounts")
    .update({ points: 5000 })
    .eq("id", rootA.id);

  const { data: nationId, error: nationError } = await clientA.rpc(
    "create_nation",
    {
      p_name: "Nation A",
      p_description: "Desc",
      p_owner_id: userA.user.id,
    }
  );

  if (nationError) throw nationError;

  // Try insert with BOTH author_id and author_group_id
  const { error: postError } = await clientA.from("nation_posts").insert({
    nation_id: nationId,
    content: "Bad Post",
    author_id: userA.user.id,
    author_group_id: groupA.id, // Both set
  });

  if (postError && postError.message.includes("check_author_exclusive")) {
    console.log("✅ Correctly rejected post with both authors set");
  } else {
    console.error("❌ Failed to reject invalid post:", postError);
  }

  // Cleanup
  console.log("\nCleaning up...");
  await adminClient.auth.admin.deleteUser(userA.user.id);
  await adminClient.auth.admin.deleteUser(userB.user.id);
  console.log("Done.");
}

runTests().catch(console.error);
