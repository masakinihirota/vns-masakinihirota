import { getRootAccountId } from "@/lib/auth/root-account-guard";
import { getUserProfiles } from "@/lib/db/user-profiles";
import { createClient } from "@/lib/supabase/server";
import { MatchingView } from "../_components/matching-view";

export const metadata = {
  title: "Auto Matching | VNS masakinihirota",
  description: "Automatically find users with similar values.",
};

export default async function AutoMatchingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasProfile = false;
  if (user) {
    const rootAccountId = await getRootAccountId(user.id);
    if (rootAccountId) {
      const profiles = await getUserProfiles(rootAccountId);
      hasProfile = profiles.length > 0;
    }
  }

  return (
    <main className="container py-8">
      <MatchingView hasProfile={hasProfile} />
    </main>
  );
}
