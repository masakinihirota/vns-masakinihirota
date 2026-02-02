"use client";

import {
  ChevronRight,
  ChevronsUpDown,
  Lock,
  LogOut,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { iconFor } from "@/config/menu-icons";
import routesManifest from "@/config/routes.manifest.json";

/**
 * 体験版でアクセス可能なパス
 */
const ALLOWED_TRIAL_PATHS = ["/home-trial", "/tutorial", "/onboarding-trial"];

type RouteEntry = {
  path: string;
  label: string;
  order: number;
  visibleInMenu?: boolean;
  authRequired?: boolean;
  group?: string;
};

const manifestRoutes: RouteEntry[] = routesManifest as RouteEntry[];

const filterAndSort = (group: string) =>
  manifestRoutes
    .filter((r) => r.visibleInMenu && r.group === group)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((r) => ({
      title: r.label,
      url: r.path === "/home" ? "/home-trial" : r.path, // ホームは体験版用に差し替え
      icon: iconFor(r.path),
    }));

const mainMenuItems = filterAndSort("main");
const registrationMenuItems = filterAndSort("registration");
const moreMenuItems = filterAndSort("more");
const footerMenuItems = filterAndSort("footer");

const mockUser = {
  name: "Guest User",
  email: "体験版モード",
  avatar: "",
};

function TrialNavItem({
  item,
  isActive,
}: {
  item: { title: string; url: string; icon: LucideIcon };
  isActive: boolean;
}) {
  const isAllowed = ALLOWED_TRIAL_PATHS.some(
    (path) => item.url === path || item.url.startsWith(path + "/")
  );

  if (!isAllowed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={`${item.title}（本編で解放されます）`}
          className="opacity-60 cursor-default hover:bg-transparent"
        >
          <item.icon className="text-muted-foreground/50" />
          <span className="text-muted-foreground/50">{item.title}</span>
          <Lock className="ml-auto size-3 text-muted-foreground/30" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function TrialNavGroup({
  label,
  items,
  currentPath,
}: {
  label?: string;
  items: { title: string; url: string; icon: LucideIcon }[];
  currentPath: string;
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => (
          <TrialNavItem
            key={item.url}
            item={item}
            isActive={currentPath === item.url}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function TrialNavMore({
  items,
  currentPath,
}: {
  items: { title: string; url: string; icon: LucideIcon }[];
  currentPath: string;
}) {
  const hasActiveItem = items.some((item) => currentPath === item.url);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={hasActiveItem}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="もっと見る">
                <MoreHorizontal />
                <span>もっと見る</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => {
                  const isAllowed = ALLOWED_TRIAL_PATHS.some(
                    (path) => item.url === path
                  );
                  const isActive = currentPath === item.url;

                  if (!isAllowed) {
                    return (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton
                          className="opacity-50 cursor-default"
                          title={`${item.title}（本編で解放されます）`}
                        >
                          <item.icon className="size-4 text-muted-foreground/50" />
                          <span className="text-muted-foreground/50">
                            {item.title}
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  }

                  return (
                    <SidebarMenuSubItem key={item.url}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function TrialNavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  T
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    T
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Lock className="mr-2 h-4 w-4 opacity-50" />
                <span>設定 (本編で解放)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                ログイン画面へ
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function TrialSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="z-50" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home-trial">
                <div className="bg-emerald-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg font-bold">
                  T
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VNS Trial</span>
                  <span className="truncate text-xs text-muted-foreground">
                    体験版モード
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <TrialNavGroup items={mainMenuItems} currentPath={pathname} />
        <TrialNavGroup
          label="登録"
          items={registrationMenuItems}
          currentPath={pathname}
        />
        <TrialNavMore items={moreMenuItems} currentPath={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <TrialNavUser user={mockUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
