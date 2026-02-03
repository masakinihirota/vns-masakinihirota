import { redirect } from "next/navigation";
import { OnboardingPCForm } from "@/components/onboarding-pc";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPCPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <OnboardingPCForm userId={user.id} />
    </div>
  );
}
