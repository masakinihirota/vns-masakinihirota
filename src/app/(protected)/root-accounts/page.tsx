import { RootAccountDashboard } from "@/components/root-accounts";
import { dummyRootAccountDashboardData } from "@/components/root-accounts/root-account-dashboard/root-account-dashboard.dummyData";

export default function RootAccountsPage() {
  return <RootAccountDashboard data={dummyRootAccountDashboardData} />;
}
