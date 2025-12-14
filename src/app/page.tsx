import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const devRoutes = [
    { title: "Home (Protected)", path: "/home", desc: "Main content dashboard" },
    { title: "Root Accounts", path: "/root-accounts", desc: "Root management" },
    { title: "Auto Matching", path: "/auto-matching", desc: "Automated matching implementation" },
    {
      title: "Manual Matching Console",
      path: "/manual-matching",
      desc: "Manual matching 3-column console",
    },
    {
      title: "Matching Conditions",
      path: "/manual-matching/conditions",
      desc: "Matching algorithm settings",
    },
    { title: "Values (New)", path: "/values", desc: "Questionnaire to register values" },
    { title: "Profile", path: "/profile", desc: "User profile page" },
    { title: "Works", path: "/works", desc: "Works directory" },
    { title: "Oasis Declaration", path: "/oasis", desc: "Project Philosophy & Manifesto" },
    { title: "Human Declaration", path: "/human", desc: "Affirming human nature" },
    { title: "Landing Page", path: "/lp", desc: "New VNS Landing Page" },
    { title: "Sample", path: "/sample", desc: "Sample components" },
  ];

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <main className="container mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">VNS Masakinihirota Dev Portal</h1>
          <p className="text-muted-foreground">Development entry points for UI/UX verification.</p>
          <Button asChild size="lg">
            <Link href="/login">Log in / Auth</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devRoutes.map((route) => (
            <Card key={route.path} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={route.path} className="hover:underline text-primary">
                    {route.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-xs font-mono">{route.path}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{route.desc}</p>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-4 w-full justify-start pl-0"
                >
                  <Link href={route.path}>Go to page &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
