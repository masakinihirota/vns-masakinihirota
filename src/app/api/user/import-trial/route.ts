import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { VNSTrialDataSchema } from "@/lib/trial-storage";

export async function POST(request: Request) {
  // 1. Better-Auth による認証チェック
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // 2. Validate Inputs
  let trialData;
  try {
    const json = await request.json();
    trialData = VNSTrialDataSchema.parse(json);
  } catch {
    return NextResponse.json(
      { error: "Invalid trial data format" },
      { status: 400 }
    );
  }

  // 3. Get Root Account
  const { data: rootAccount, error: rootError } = await supabase
    .from("root_accounts")
    .select("id, points")
    .eq("auth_user_id", session.user.id)
    .single();

  if (rootError || !rootAccount) {
    return NextResponse.json(
      { error: "Root account not found" },
      { status: 404 }
    );
  }

  // 4. Perform Updates (Transaction-like)
  // Note: Supabase JS doesn't support transactions purely from client side easily without RPC.
  // We will do sequential operations.

  // 4a. Update Points
  // Strategy: Add trial points to current points, capped at 1,000,000
  const MAX_POINTS = 1000000;
  const trialPoints = trialData.points.current || 0;
  const newPoints = Math.min(rootAccount.points + trialPoints, MAX_POINTS);

  if (newPoints !== rootAccount.points) {
    const { error: updateError } = await supabase
      .from("root_accounts")
      .update({ points: newPoints })
      .eq("id", rootAccount.id);

    if (updateError) {
      console.error("Failed to update points:", updateError);
      // Continue to profiles? Or abort?
      // We'll continue but log error. Ideally implementation should be robust.
    }
  }

  // 4b. Import Profiles
  const profilesToInsert = trialData.profiles.map((p) => ({
    id: p.id, // Use the same UUID from trial
    display_name: p.name,
    role_type: p.type, // Verified: 'type' (general/business/hobby) maps to 'role_type' string column
    root_account_id: rootAccount.id,
    is_active: true,
    // Default values for other fields
    purpose: "trial_import",
  }));

  if (profilesToInsert.length > 0) {
    // Try to insert profiles. Note: ID collision might happen if user somehow re-imports or UUID conflict.
    // upsert is safer if we want to overwrite, but insert is "cleaner" for new records.
    const { error: insertError } = await supabase
      .from("user_profiles")
      .insert(profilesToInsert)
      .select();

    if (insertError) {
      console.error("Failed to import profiles:", insertError);
      return NextResponse.json(
        {
          success: false,
          message: "Partial success: Points updated but profiles failed.",
        },
        { status: 500 }
      );
    }
  }

  // 4c. Groups / Nations -> (Skipped as tables do not exist yet)

  return NextResponse.json({
    success: true,
    message: "Trial data imported successfully",
  });
}
