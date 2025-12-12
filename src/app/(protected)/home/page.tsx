export default function DashboardPage() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="col-span-3 h-[50dvh] rounded-xl bg-muted/50" />
    </div>
  );
}
