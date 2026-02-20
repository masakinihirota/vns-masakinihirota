import { OnboardingPCForm } from "@/components/onboarding-pc";
import { getSession } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export default async function OnboardingPCPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <OnboardingPCForm userId={session.user.id} />
    </div>
  );
}
