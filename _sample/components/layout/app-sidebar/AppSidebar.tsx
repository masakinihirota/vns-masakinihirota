"use client";

import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  MoreHorizontal,
  Pause,
  Play,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useSession } from "@/lib/auth-client";
import { performLogout } from "@/hooks/use-validated-trial-data";
import {
  getMenuItemState,
  getMenuUnlockTip,
  MenuItemState,
} from "@/lib/tutorial/tutorial";

/**
 * 左サイドメニュー要件定義書に基づくメニュー構成
 *
 * 上側:
 * - masakinihirota (ブランド)
 * - ホーム
 * - プロフィール
 * - マッチング(自動/手動)
 * - おすすめ
 * - 検索 (第2メニュー - 集団系)
 * - 国(トップダウン方式)
 * - グループ(ボトムアップ方式)
 * - 作品 (第3メニュー - 登録系)
 * - 価値観
 * - スキル
 * - チュートリアル
 * - もっと見る (折りたたみ)
 *   - リスト
 *   - チェーン
 *   - マンダラチャート
 *   - 実績
 *   - アチーブメント
 *   - 成果
 *
 * 下側 (フッター):
 * - 設定
 * - プライシング
 * - ルートアカウント
 */

type RouteEntry = {
  path: string;
  label: string;
  order: number;
  visibleInMenu?: boolean;
  authRequired?: boolean;
  group?: string;
};

/**
 * パスからフィーチャー名へのマッピング
 */
const PATH_TO_FEATURE_MAP: Record<string, string> = {
  "/home": "home",
  "/user-profiles": "profiles",
  "/user-profiles/new": "profiles",
  "/profiles": "profiles",
  "/matching": "matching",
  "/groups": "groups",
  "/nations": "nations",
  "/works": "works",
  "/values": "values",
  "/skills": "skills",
  "/chains": "chains",
  "/mandala": "mandala",
  "/tutorial": "tutorial",
};

/**
 * URLパスからフィーチャー名を取得
 * @param path
 */
export const mapPathToFeature = (path: string): string => {
  return PATH_TO_FEATURE_MAP[path] ?? path.replace("/", "");
};

/**
 * メニュー項目の型定義（状態付き）
 */
export type MenuItemWithState = {
  title: string;
  url: string;
  icon: LucideIcon;
  state: MenuItemState;
  tip?: string;
};

/**
 * メニュー項目にLv制状態を付与
 * @param items
 * @param currentLevel
 */
export const getMenuItemsWithState = (
  items: { title: string; url: string; icon: LucideIcon }[],
  currentLevel: number
): MenuItemWithState[] => {
  return items
    .map((item) => {
      const feature = mapPathToFeature(item.url);
      const state = getMenuItemState(feature, currentLevel);
      const tip = getMenuUnlockTip(feature);
      return {
        ...item,
        state,
        tip,
      };
    })
    .filter((item) => item.state !== "hidden");
};

// Normalize a manifest route path into the sidebar URL used in this app
// Policy: routes.manifest.json is canonical. Return the manifest path as the sidebar URL
export const toSidebarUrl = (manifestPath: string) => {
  if (!manifestPath) return "/";
  // Use manifest path directly — keep '/' as root
  return manifestPath === "/" ? "/" : manifestPath;
};

// Build groups from manifest
const manifestRoutes: RouteEntry[] = routesManifest as RouteEntry[];

const mainMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "main")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({
    title: r.label,
    url: toSidebarUrl(r.path),
    icon: iconFor(r.path),
  }));

// 登録系メニュー（第3グループ）
const registrationMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "registration")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({
    title: r.label,
    url: toSidebarUrl(r.path),
    icon: iconFor(r.path),
  }));

const moreMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "more")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({
    title: r.label,
    url: toSidebarUrl(r.path),
    icon: iconFor(r.path),
  }));

const footerMenuItems = manifestRoutes
  .filter((r) => r.visibleInMenu && r.group === "footer")
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((r) => ({
    title: r.label,
    url: toSidebarUrl(r.path),
    icon: iconFor(r.path),
  }));

// ナビゲーション項目コンポーネント（Lv制対応）
/**
 *
 * @param root0
 * @param root0.item
 * @param root0.item.title
 * @param root0.item.url
 * @param root0.item.icon
 * @param root0.isActive
 * @param root0.state
 * @param root0.tip
 * @param root0.isNew
 */
function NavItem({
  item,
  isActive,
  state = "unlocked",
  tip,
  isNew = false,
}: {
  item: { title: string; url: string; icon: LucideIcon };
  isActive: boolean;
  state?: MenuItemState;
  tip?: string;
  isNew?: boolean;
}) {
  const isGrayed = state === "grayed";

  // グレーアウト時はクリック無効化
  if (isGrayed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={tip || `${item.title}（解放条件未達成）`}
          className="opacity-50 cursor-not-allowed"
          disabled
        >
          <item.icon className="text-muted-foreground" />
          <span className="text-muted-foreground">{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url} aria-current={isActive ? "page" : undefined}>
          <item.icon />
          <span>{item.title}</span>
          {isNew && (
            <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
              🆕
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// メインナビゲーショングループ（Lv制対応）
/**
 *
 * @param root0
 * @param root0.label
 * @param root0.items
 * @param root0.currentPath
 * @param root0.userLevel
 * @param root0.newlyUnlockedFeatures
 */
function NavGroup({
  label,
  items,
  currentPath,
  userLevel = 20, // デフォルトは全解放（開発用）
  newlyUnlockedFeatures = [],
}: {
  label?: string;
  items: { title: string; url: string; icon: LucideIcon }[];
  currentPath: string;
  userLevel?: number;
  newlyUnlockedFeatures?: string[];
}) {
  // Lv制に基づいてメニュー項目をフィルタリング・状態付与
  const itemsWithState = getMenuItemsWithState(items, userLevel);

  if (itemsWithState.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {itemsWithState.map((item) => {
          const feature = mapPathToFeature(item.url);
          const isNew = newlyUnlockedFeatures.includes(feature);

          // Special Tutorial Controls
          const isTutorialStory = currentPath === "/tutorial/story";
          const isTutorialItem = feature === "tutorial";

          return (
            <React.Fragment key={item.url}>
              <NavItem
                item={item}
                isActive={
                  currentPath === item.url ||
                  currentPath.startsWith(item.url + "/")
                }
                state={item.state}
                tip={item.tip}
                isNew={isNew}
              />
              {isTutorialItem && isTutorialStory && <TutorialControlItem />}
            </React.Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// Helper for Tutorial Control
/**
 *
 */
function TutorialControlItem() {
  const searchParameters = useSearchParams();
  const isPaused = searchParameters.get("paused") === "true";

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="text-yellow-500 hover:text-yellow-600 bg-yellow-500/10 hover:bg-yellow-500/20"
      >
        <Link
          href={isPaused ? "/tutorial/story" : "/tutorial/story?paused=true"}
        >
          {isPaused ? (
            <Play className="size-4" />
          ) : (
            <Pause className="size-4" />
          )}
          <span>
            {isPaused ? "チュートリアルを再開" : "チュートリアルを一時停止"}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// 「もっと見る」折りたたみセクション（Lv制対応）
/**
 *
 * @param root0
 * @param root0.items
 * @param root0.currentPath
 * @param root0.userLevel
 * @param root0.newlyUnlockedFeatures
 */
function NavMore({
  items,
  currentPath,
  userLevel = 20,
  newlyUnlockedFeatures = [],
}: {
  items: { title: string; url: string; icon: LucideIcon }[];
  currentPath: string;
  userLevel?: number;
  newlyUnlockedFeatures?: string[];
}) {
  // Lv制に基づいてメニュー項目をフィルタリング・状態付与
  const itemsWithState = getMenuItemsWithState(items, userLevel);

  const hasActiveItem = itemsWithState.some(
    (item) =>
      item.state === "unlocked" &&
      (currentPath === item.url || currentPath.startsWith(item.url + "/"))
  );

  // 表示できる項目がない場合は非表示
  if (itemsWithState.length === 0) {
    return null;
  }

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
              <SidebarMenuButton tooltip="便利ツール">
                <MoreHorizontal />
                <span>便利ツール</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent id="sidebar-nav-more-content">
              <SidebarMenuSub>
                {itemsWithState.map((item) => {
                  const feature = mapPathToFeature(item.url);
                  const isNew = newlyUnlockedFeatures.includes(feature);
                  const isActive =
                    currentPath === item.url ||
                    currentPath.startsWith(item.url + "/");
                  const isGrayed = item.state === "grayed";

                  if (isGrayed) {
                    return (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton
                          className="opacity-50 cursor-not-allowed"
                          aria-disabled="true"
                          title={item.tip || `${item.title}（解放条件未達成）`}
                        >
                          <item.icon className="size-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {item.title}
                          </span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  }

                  return (
                    <SidebarMenuSubItem key={item.url}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {isNew && <span className="ml-auto text-xs">🆕</span>}
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

// ユーザーメニュー
/**
 * セッション情報がある場合のみ表示
 */
type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

function NavUser({ currentUser }: { currentUser?: SidebarUser | null }) {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // サーバー側で取得したユーザーを優先し、なければクライアントセッションを使う
  const user = currentUser ?? session?.user;

  // セッション取得中やユーザー不在は表示しない
  if (isPending && !user) {
    return null;
  }

  if (!user) {
    return null;
  }
  const userName = user.name || "User";
  const userEmail = user.email || "";
  const userImage = user.image || null;

  // ユーザーの role を取得
  const userRole = user.role || "user";

  // role に基づいてフッターメニューをフィルタリング
  const visibleFooterItems = footerMenuItems.filter((item) => {
    const manifestRoute = manifestRoutes.find((r) => r.path === item.url);
    if (manifestRoute && (manifestRoute as any).requiresRole) {
      return userRole === (manifestRoute as any).requiresRole;
    }
    return true;
  });

  // ログアウト処理
  const handleLogout = async () => {
    const result = await performLogout();
    if (result.success) {
      // ログアウト成功時にログアウト画面へリダイレクト
      router.push("/logout");
    } else {
      console.error("Logout failed:", result.error);
      // エラーでもログアウト画面へリダイレクト（サッセッション削除されているはず）
      router.push("/logout");
    }
  };

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
                {userImage && (
                  <AvatarImage src={userImage} alt={userName} />
                )}
                <AvatarFallback className="rounded-lg">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
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
                  {userImage && (
                    <AvatarImage src={userImage} alt={userName} />
                  )}
                  <AvatarFallback className="rounded-lg">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {visibleFooterItems.map((item) => (
                <DropdownMenuItem key={item.url} asChild>
                  <Link href={item.url}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// メインのサイドバーコンポーネント（Lv制UI対応）
export interface AppSidebarProperties extends React.ComponentProps<typeof Sidebar> {
  /** ユーザーの現在レベル（デフォルト: 20 = 全解放） */
  userLevel?: number;
  /** 新しく解放された機能のリスト（🆕バッジ表示用） */
  newlyUnlockedFeatures?: string[];
  /** サーバー側で取得したユーザー情報（未ログイン時は null） */
  currentUser?: SidebarUser | null;
}

/**
 *
 * @param root0
 * @param root0.userLevel
 * @param root0.newlyUnlockedFeatures
 */
export function AppSidebar({
  userLevel = 20,
  newlyUnlockedFeatures = [],
  currentUser,
  ...properties
}: AppSidebarProperties) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="z-50" {...properties}>
      {/* ヘッダー: ブランド名 */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold">
                  M
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">masakinihirota</span>
                  <span className="truncate text-xs text-muted-foreground">
                    VNS Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* コンテンツ: メインナビゲーション */}
      <SidebarContent>
        {/* メインメニュー */}
        <NavGroup
          items={mainMenuItems}
          currentPath={pathname}
          userLevel={userLevel}
          newlyUnlockedFeatures={newlyUnlockedFeatures}
        />

        {/* 登録系メニュー（第3グループ） */}
        <NavGroup
          label="登録"
          items={registrationMenuItems}
          currentPath={pathname}
          userLevel={userLevel}
          newlyUnlockedFeatures={newlyUnlockedFeatures}
        />

        {/* もっと見る */}
        <NavMore
          items={moreMenuItems}
          currentPath={pathname}
          userLevel={userLevel}
          newlyUnlockedFeatures={newlyUnlockedFeatures}
        />
      </SidebarContent>

      {/* フッター: ユーザーメニュー（画面左下に固定） */}
      <SidebarFooter>
        <NavUser currentUser={currentUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
