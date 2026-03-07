"use client";

import * as React from "react";
import { Home, BookOpen, Users, Heart, Settings, LogOut, BarChart3 } from "lucide-react";
import Link from "next/link";

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
    SidebarRail,
} from "@/components/ui/sidebar";

// ホームページ用ナビゲーション
const navigationData = {
    main: [
        {
            title: "ホーム",
            url: "/home",
            icon: Home,
            isActive: true,
        },
    ],
    features: [
        {
            title: "マッチング",
            url: "/matching",
            icon: Heart,
            description: "価値観マッチング",
        },
        {
            title: "コンテンツ",
            url: "/content",
            icon: BookOpen,
            description: "作品・記事",
        },
        {
            title: "コミュニティ",
            url: "/community",
            icon: Users,
            description: "グループ・ユーザー",
        },
    ],
    secondary: [
        {
            title: "統計情報",
            url: "/analytics",
            icon: BarChart3,
            description: "あなたの活動",
        },
        {
            title: "設定",
            url: "/settings",
            icon: Settings,
            description: "アカウント設定",
        },
    ],
};

export function AppHomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            {/* ヘッダー */}
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                        <span className="text-sm font-bold text-white">VNS</span>
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">masakinihirota</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">価値観マッチングプラットフォーム</p>
                    </div>
                </div>
            </SidebarHeader>

            {/* メインコンテンツ */}
            <SidebarContent>
                {/* メインナビゲーション */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.main.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* 主要機能 */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        機能
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.features.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* 二次機能 */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        その他
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationData.secondary.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* フッター */}
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="ログアウト">
                            <form action={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/signout`} method="POST">
                                <button type="submit" className="w-full flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <LogOut className="h-4 w-4" />
                                    <span>ログアウト</span>
                                </button>
                            </form>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

