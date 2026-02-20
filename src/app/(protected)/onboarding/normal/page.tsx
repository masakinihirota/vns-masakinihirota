import { redirect } from "next/navigation";
import { OnboardingNormalForm } from "@/components/onboarding-pc/onboarding-normal-form";
import { getSession } from "@/lib/auth/helper";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function OnboardingNormalPage({ searchParams }: Props) {
  const session = await getSession();

  let userId = session?.user?.id;

  if (!userId) {
    if (process.env.NODE_ENV === "development") {
      userId = "dev-mock-user-id";
    } else {
      redirect("/login");
    }
  }

  const initialData = {
    constellation: searchParams?.constellation as string,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <OnboardingNormalForm userId={userId} initialData={initialData} />
    </div>
  );
}
