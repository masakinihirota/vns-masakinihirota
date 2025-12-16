export const metadata = {
  title: "Root Account | VNS masakinihirota",
  description: "Manage your root account status and points.",
};

export default function RootAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Root Account</h1>
        <p className="text-muted-foreground">
          Manage your account status and view your points history.
        </p>
      </div>
      {children}
    </div>
  );
}
