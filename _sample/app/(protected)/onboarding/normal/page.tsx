import { redirect } from "next/navigation";

import { OnboardingNormalForm } from "@/components/onboarding-pc/onboarding-normal-form";
import { getSession } from "@/lib/auth/helper";

interface Properties {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 *
 * @param root0
 * @param root0.searchParams
 */
export default async function OnboardingNormalPage({ searchParams }: Properties) {
  const session = await getSession();

  let userId = session?.user?.id;

  if (!userId) {
    if (process.env.NODE_ENV === "development") {
      userId = "dev-mock-user-id";
    } else {
      redirect("/login");
    }
  }

  const params = await searchParams;
  const initialData = {
    constellation: params?.constellation as string,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <OnboardingNormalForm userId={userId} initialData={initialData} />
    </div>
  );
}
