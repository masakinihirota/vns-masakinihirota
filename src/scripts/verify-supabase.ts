import { execSync } from "child_process";
/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  try {
    const output = execSync("supabase status -o json", { encoding: "utf-8" });
    const config = JSON.parse(output);
    return {
      supabaseUrl: config.API_URL,
      serviceRoleKey: config.SERVICE_ROLE_KEY,
    };
  } catch (e) {
    console.error("Failed to get supabase status:", e);
    return null;
  }
}

const config = getSupabaseConfig();

if (!config || !config.supabaseUrl || !config.serviceRoleKey) {
  console.error(
    'Failed to retrieve Supabase configuration from "supabase status"'
  );
  process.exit(1);
}

const { supabaseUrl, serviceRoleKey } = config;

console.log(`Using Supabase URL: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  console.log("--- Starting Supabase Data Verification ---");

  const testEmail = "verification-test-" + Date.now() + "@example.com";
  const testPassword = "password123";

  console.log(`1. Creating test user: ${testEmail}`);
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

  if (userError) {
    console.error("Failed to create user:", userError);
    process.exit(1);
  }

  const userId = userData.user.id;
  console.log(`   User created with ID: ${userId}`);

  // Wait a bit for the trigger to run
  await new Promise((r) => setTimeout(r, 1000));

  console.log("2. Verifying root_accounts trigger...");
  const { data: rootAccount, error: rootError } = await supabase
    .from("root_accounts")
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  if (rootError) {
    console.error("Failed to fetch root_accounts:", rootError);
    process.exit(1);
  }

  if (!rootAccount) {
    console.error("root_accounts record was not created by trigger!");
    process.exit(1);
  }
  console.log(`   Root account found: ${rootAccount.id}`);

  console.log("3. Inserting user_profiles record...");
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .insert({
      root_account_id: rootAccount.id,
      display_name: "Verification User",
      purpose: "Verification Testing",
      role_type: "member",
    })
    .select()
    .single();

  if (profileError) {
    console.error("Failed to insert user_profile:", profileError);
    process.exit(1);
  }
  console.log(`   Profile inserted: ${profile.id} (${profile.display_name})`);

  console.log("4. Verifying data persistence (Select)...");
  const { data: fetchedProfile, error: fetchError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", profile.id)
    .single();

  if (fetchError || !fetchedProfile) {
    console.error("Failed to read back profile:", fetchError);
    process.exit(1);
  }

  if (fetchedProfile.display_name !== "Verification User") {
    console.error("Data mismatch on read back");
    process.exit(1);
  }
  console.log("   Data verification successful!");

  console.log("5. Cleanup (Deleting user)...");
  const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteError) {
    console.error("Failed to delete user:", deleteError);
  } else {
    console.log("   User deleted successfully.");
  }

  console.log("--- Verification Complete: SUCCESS ---");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
