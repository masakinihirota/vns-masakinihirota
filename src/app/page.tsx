import { PortalDashboard } from "@/components/home/portal-dashboard";
import { UnauthenticatedHome } from "@/components/home/unauthenticated-home";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && process.env.NODE_ENV !== "development") {
    return <UnauthenticatedHome />;
  }

  return <PortalDashboard />;
}
