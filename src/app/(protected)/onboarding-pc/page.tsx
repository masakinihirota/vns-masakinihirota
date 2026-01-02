import { redirect } from "next/navigation";
import { OnboardingPCForm } from "@/components/onboarding-pc/onboarding-pc-form";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPCPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId = user?.id;

  if (!userId) {
    if (process.env.NODE_ENV === "development") {
      userId = "dev-mock-user-id";
    } else {
      redirect("/auth/login");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <OnboardingPCForm userId={userId} />
    </div>
  );
}
