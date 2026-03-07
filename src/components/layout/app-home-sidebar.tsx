"use client";

import * as React from "react";
import {
    Briefcase,
    ChevronRight,
    Flag,
    Gift,
    GraduationCap,
    Grid,
    Heart,
    Home,
    Lightbulb,
    Link2,
    List,
    Medal,
    MoreHorizontal,
    ShoppingBag,
    Star,
    Trophy,
    User,
    Users,
    Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";

type NavigationItem = {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
};

const primaryItems: NavigationItem[] = [
    { title: "ホーム", url: "/home", icon: Home },
    { title: "プロフィール", url: "/user-profiles", icon: User },
    { title: "グループ", url: "/groups", icon: Users },
    { title: "国", url: "/nations", icon: Flag },
    { title: "マッチング", url: "/matching", icon: Heart },
];

const secondaryItems: NavigationItem[] = [
    { title: "マーケット", url: "/market", icon: ShoppingBag },
    { title: "チュートリアル", url: "/tutorial", icon: GraduationCap },
];

const registrationItems: NavigationItem[] = [
    { title: "作品", url: "/works", icon: Briefcase },
    { title: "価値観", url: "/values", icon: Lightbulb },
    { title: "スキル", url: "/skills", icon: Wrench },
];

const toolItems: NavigationItem[] = [
    { title: "リスト", url: "/lists", icon: List },
    { title: "チェーン", url: "/chains", icon: Link2 },
    { title: "マンダラチャート", url: "/mandala", icon: Grid },
    { title: "実績", url: "/achievements", icon: Trophy },
    { title: "アチーブメント", url: "/badges", icon: Medal },
    { title: "リワード", url: "/rewards", icon: Gift },
    { title: "成果", url: "/results", icon: Star },
    { title: "作品連続評価", url: "/works/continuous-rating", icon: Star },
];

export function AppHomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const hasActiveToolItem = toolItems.some(
        (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
    );

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* ヘッダー */}
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                        <span className="text-sm font-bold text-white">VNS</span>
                    </div>
                    <div className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-linear grid-rows-[1fr] opacity-100 group-data-[collapsible=icon]:grid-rows-[0fr] group-data-[collapsible=icon]:opacity-0">
                        <div className="min-h-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">masakinihirota</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">価値観マッチングプラットフォーム</p>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* メインコンテンツ */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {primaryItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>登録</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {registrationItems.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarMenu>
                        <Collapsible asChild defaultOpen={hasActiveToolItem} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="便利ツール">
                                        <MoreHorizontal />
                                        <span>便利ツール</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent id="home-sidebar-tools-content">
                                    <SidebarMenuSub>
                                        {toolItems.map((item) => {
                                            const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                                            return (
                                                <SidebarMenuSubItem key={item.title}>
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
            </SidebarContent>

            {/* フッター */}
            <SidebarFooter className="border-t">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Guest User" className="cursor-default">
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold">
                                        T
                                    </div>
                                    <span>Guest User</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

