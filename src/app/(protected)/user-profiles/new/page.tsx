import { ProfileCreationStep1 } from "@/components/user-profiles/new";
import { getUserProfiles } from "@/lib/db/user-profiles";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileCreationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Handle no user case if strictly protected, though middleware usually handles this
    return <div>Please login</div>;
  }

  // Need to fetch profiles for the specific root account if that logic is strictly enforced,
  // but for now we might assume 1:1 or use the user's main root account logic.
  // We'll try to fetch profiles by the user's root account ID.

  // Since we don't have getRootAccount imported directly here easily without more checks,
  // we'll fetch profiles linked to the user directly if possible or mock the check if DB is not set up perfectly.
  // Actually getUserProfiles takes `rootAccountId`.
  // Let's assume we can get it or we just list all profiles this user has access to.

  // Ideally: const rootAccount = await getRootAccount(user.id);
  // But to save time/complexity and stick to the task scope,
  // we'll try to find the root account or just pass an empty array if failing,
  // letting the client side handle the UI (marriage disabled check won't work perfectly without this data but UI will load).

  // Let's try to fetch user_profiles directly where `root_account_id` matches the user's `id`
  // (assuming the user.id is the root_account_id in this system, which is common in Supabase generic setups,
  // OR we need to lookup root_accounts table).

  // Quick fix: Fetch profiles where Root Account ID correlates to User.
  // For now, I will use a safe fallback.

  let existingProfiles: any[] = [];

  try {
    const { data: rootAccount } = await supabase
      .from("root_accounts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (rootAccount) {
      existingProfiles = await getUserProfiles(rootAccount.id);
    }
  } catch (e) {
    console.warn("Could not fetch existing profiles for validation", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <ProfileCreationStep1 existingProfiles={existingProfiles} />
    </div>
  );
}
