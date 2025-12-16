import { HomeMenuGrid } from "@/components/home/home-menu-grid";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome to the VNS Platform. Select a functionality to proceed.
        </p>
      </div>
      <HomeMenuGrid />
    </div>
  );
}
