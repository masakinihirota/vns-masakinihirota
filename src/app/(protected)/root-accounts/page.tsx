import { RootAccountDashboard } from "@/components/root-accounts";
import { dummyRootAccountData } from "@/components/root-accounts/root-account-dashboard/root-account-dashboard.dummyData";

export default function RootAccountsPage() {
  return <RootAccountDashboard data={dummyRootAccountData} />;
}
