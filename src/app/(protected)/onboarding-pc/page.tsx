import { redirect } from "next/navigation";
import { OnboardingPCForm } from "@/components/onboarding-pc/onboarding-pc-form";
import { createClient } from "@/lib/supabase/server";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OnboardingPCPage({ searchParams }: Props) {
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

  const initialData = {
    // Determine how to map constellation from query param if needed
    // For now, passing it through raw or mapped potentially
    constellation: searchParams?.constellation as string,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <OnboardingPCForm userId={userId} initialData={initialData} />
    </div>
  );
}
