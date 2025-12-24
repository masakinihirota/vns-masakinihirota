import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Route = {
  title: string;
  path: string;
  desc: string;
  badge?: string;
};

type RouteSection = {
  title: string;
  routes: Route[];
};

export default function Home() {
  const routeSections: RouteSection[] = [
    {
      title: "🔥 New & Experimental (Check These!)",
      routes: [
        {
          title: "Root Accounts Control",
          path: "/root-accounts-controle",
          desc: "New Root Account Control UI",
          badge: "New",
        },
        {
          title: "Gemini Root Account",
          path: "/gemini-root-account",
          desc: "Gemini Style Root Account Dashboard",
          badge: "New",
        },
        {
          title: "Work Registration",
          path: "/work-registration-form",
          desc: "New Work Registration Form",
          badge: "New",
        },
        {
          title: "Vote Match",
          path: "/vote-match",
          desc: "Political/Social Vote Match UI",
          badge: "New",
        },
        {
          title: "Mandala Chart",
          path: "/mandala-chart",
          desc: "Mandala Chart UI Integration",
          badge: "New",
        },
      ],
    },
    {
      title: "Recently Added / Drafts",
      routes: [
        {
          title: "Profile 2",
          path: "/profile2",
          desc: "Alternative Profile Page",
        },
        {
          title: "User Profiles",
          path: "/user-profiles",
          desc: "User Profile List",
        },
        {
          title: "User Edited Profiles",
          path: "/user-edited-userprofiles",
          desc: "User Profile Edit Interface",
        },
        {
          title: "Values Input",
          path: "/values-input",
          desc: "Values Input Screen",
        },
        {
          title: "Valus Screen",
          path: "/valus-screen",
          desc: "Values UI Screen",
        },
        {
          title: "Matching Manual (Alt)",
          path: "/matching-manual",
          desc: "Alternative Manual Matching",
        },
        {
          title: "Matching / Auto",
          path: "/matching/auto",
          desc: "Sub-route: Auto Matching",
        },
        {
          title: "Matching / Manual",
          path: "/matching/manual",
          desc: "Sub-route: Manual Matching",
        },
      ],
    },
    {
      title: "Core Functionality",
      routes: [
        {
          title: "Home (Protected)",
          path: "/home",
          desc: "Authenticated User Dashboard",
        },
        {
          title: "Matching (Hub)",
          path: "/matching",
          desc: "Matching Entry / Top",
        },
        {
          title: "Works Directory",
          path: "/works",
          desc: "List of Registered Works",
        },
        {
          title: "Product List",
          path: "/product-list",
          desc: "Product List Demo",
        },
      ],
    },
    {
      title: "Account & Profile",
      routes: [
        {
          title: "Root Accounts",
          path: "/root-accounts",
          desc: "Root Account Management (Old?)",
        },
        { title: "Profile", path: "/profile", desc: "User Profile View" },
        {
          title: "Profile Edited",
          path: "/profile-edited",
          desc: "Profile Edit Flow",
        },
        {
          title: "Onboarding",
          path: "/onboarding",
          desc: "User Onboarding Flow",
        },
        { title: "Login", path: "/login", desc: "Login Page" },
      ],
    },
    {
      title: "Values & Matching Tools",
      routes: [
        {
          title: "Values Registration",
          path: "/values",
          desc: "Register Personal Values",
        },
        {
          title: "Values Selection",
          path: "/values-selection",
          desc: "Select Important Values",
        },
        {
          title: "Auto Matching",
          path: "/auto-matching",
          desc: "Automated Matching Implementation",
        },
        {
          title: "Manual Matching",
          path: "/manual-matching",
          desc: "Manual Matching Console",
        },
        {
          title: "Matching Conditions",
          path: "/manual-matching/conditions",
          desc: "Algorithm Settings",
        },
      ],
    },
    {
      title: "Legacy / Other",
      routes: [
        {
          title: "New Work (Old)",
          path: "/works/new",
          desc: "Previous Work Registration",
        },
      ],
    },
    {
      title: "Public / Static",
      routes: [
        {
          title: "Landing Page",
          path: "/landing-page",
          desc: "VNS Landing Page",
        },
        {
          title: "Oasis Declaration",
          path: "/oasis",
          desc: "Project Philosophy",
        },
        {
          title: "Human Declaration",
          path: "/human",
          desc: "Human Nature Declaration",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-8 dark:bg-neutral-900 font-sans">
      <main className="container mx-auto space-y-12 max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            VNS Development Portal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Central hub for UI/UX verification, new feature testing, and page navigation.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/login">Log in / Auth</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link
                href="https://github.com/masakinihirota/vns-masakinihirota"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Repository
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-10">
          {routeSections.map((section) => (
            <section key={section.title} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-foreground border-l-4 border-indigo-500 pl-4">
                  {section.title}
                </h2>
                <div className="h-px bg-border flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.routes.map((route) => (
                  <Card
                    key={route.path}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base font-semibold">
                          <Link
                            href={route.path}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {route.title}
                          </Link>
                        </CardTitle>
                        {route.badge && (
                          <Badge
                            variant="destructive"
                            className="ml-auto text-[10px] px-2 py-0.5 h-auto"
                          >
                            {route.badge}
                          </Badge>
                        )}
                      </div>
                      <CardDescription
                        className="text-xs font-mono text-muted-foreground/70 truncate"
                        title={route.path}
                      >
                        {route.path}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                        {route.desc}
                      </p>
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="w-full justify-between group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors"
                      >
                        <Link href={route.path}>
                          Open Page{" "}
                          <span className="group-hover:translate-x-1 transition-transform">
                            &rarr;
                          </span>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
