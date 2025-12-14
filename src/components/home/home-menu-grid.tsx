"use client";

import Link from "next/link";

import routesManifest from "@/config/routes.manifest.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconFor as getIcon } from "@/config/menu-icons";

// Basic implementation of toSidebarUrl
const toUrl = (manifestPath: string) => {
  if (!manifestPath) return "/";
  return manifestPath === "/" ? "/" : manifestPath;
};

type RouteEntry = {
  path: string;
  label: string;
  order: number;
  visibleInMenu?: boolean;
  group?: string;
  description?: string; // If manifest has description, we can use it.
};

const MENU_GROUPS = [
  { id: "main", label: "メインメニュー" },
  { id: "group", label: "集団" },
  { id: "registration", label: "登録" },
  { id: "more", label: "その他" },
];

export function HomeMenuGrid() {
  const allRoutes = routesManifest as RouteEntry[];

  const getRoutesByGroup = (groupId: string) => {
    return allRoutes
      .filter((r) => r.visibleInMenu && r.group === groupId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  return (
    <div className="space-y-8">
      {MENU_GROUPS.map((group) => {
        const routes = getRoutesByGroup(group.id);
        if (routes.length === 0) return null;

        return (
          <section key={group.id} className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">{group.label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {routes.map((route) => {
                const Icon = getIcon(route.path);
                return (
                  <Link key={route.path} href={toUrl(route.path)} className="block group">
                    <Card className="h-full hover:shadow-md transition-shadow hover:border-blue-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium group-hover:text-blue-600 transition-colors">
                          {route.label}
                        </CardTitle>
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                      </CardHeader>
                      <CardContent>
                        {/* Optional description if available in manifest */}
                        {/* <div className="text-xs text-muted-foreground">
                          Dashboard, verification, etc.
                        </div> */}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
