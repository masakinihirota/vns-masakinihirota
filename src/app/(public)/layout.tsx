import { GlobalHeader } from "@/components/layout/global-header/GlobalHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalHeader isPublic={true} showSidebarTrigger={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
