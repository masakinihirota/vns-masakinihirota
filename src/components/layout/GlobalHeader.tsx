"use client";

import { type User } from "@supabase/supabase-js";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Megaphone,
  Coins,
  HelpCircle,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { TrialStorage } from "@/lib/trial-storage";
import { TrialStatusBadge } from "./trial-status-badge";

/**
 * ヘッダーメニュー要件定義書に基づく機能:
 *
 * 左側:
 * - ロゴ（トップページリンク）
 * - サイドバートリガー
 *
 * 中央:
 * - 検索バー（クイック検索）
 *
 * 右側:
 * - ユーティリティアイコン群
 *   - 広告ON/OFF切り替え
 *   - 言語切り替え
 *   - ダークモード切り替え
 * - ポイント表示
 * - 通知（ベルアイコン + バッジ）
 * - ユーザーアバター
 */

// モックデータ
const mockNotifications = [
  { id: "1", title: "新しいマッチングがあります", time: "5分前", read: false },
  { id: "2", title: "作品にいいねがつきました", time: "1時間前", read: false },
  { id: "3", title: "プロフィールが更新されました", time: "昨日", read: true },
];

const mockPoints = 1250;

// 検索バーコンポーネント
function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<
    Array<{ id: string; title: string; type: string }>
  >([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // デバウンス検索（シンプル実装）
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      // モック: 実際はAPIを呼び出す
      const mockResults = [
        { id: "1", title: `「${query}」に関連する作品`, type: "work" },
        { id: "2", title: `「${query}」さんのプロフィール`, type: "user" },
      ];
      setResults(mockResults);
      setIsOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/home/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="作品、ユーザー、組織を検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary h-9"
            aria-label="ヘッダー検索"
          />
        </div>
      </form>

      {/* クイック検索結果 */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 py-2">
          {results.map((result) => (
            <Link
              key={result.id}
              href={
                result.type === "work"
                  ? `/home/works/${result.id}`
                  : `/home/profiles/${result.id}`
              }
              className="flex items-center gap-3 px-4 py-2 hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xs text-muted-foreground uppercase">
                {result.type}
              </span>
              <span className="text-sm">{result.title}</span>
            </Link>
          ))}
          <div className="border-t mt-2 pt-2 px-4">
            <Link
              href={`/home/search?q=${encodeURIComponent(query)}`}
              className="text-sm text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              「{query}」で詳しく検索
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// 広告切替ボタン
export function AdToggle() {
  const [adsEnabled, setAdsEnabled] = React.useState(true);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={adsEnabled ? "ghost" : "outline"}
          size="icon"
          onClick={() => setAdsEnabled(!adsEnabled)}
          aria-label={adsEnabled ? "広告ON" : "広告OFF"}
          className="h-9 w-9"
        >
          <Megaphone
            className={`h-4 w-4 ${adsEnabled ? "" : "text-muted-foreground"}`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{adsEnabled ? "広告: ON" : "広告: OFF"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// 言語切替
export function LanguageToggle() {
  const [lang, setLang] = React.useState<"ja" | "en">("ja");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Globe className="h-4 w-4" />
              <span className="sr-only">言語切り替え</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>言語切り替え</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLang("ja")}>
          🇯🇵 日本語 {lang === "ja" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("en")}>
          🇺🇸 English {lang === "en" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ダークモード切替
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">テーマ切り替え</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>テーマ切り替え</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ポイント表示
function PointsDisplay() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/home/pricing"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
        >
          <Coins className="h-4 w-4" />
          <span className="text-sm font-medium">
            {mockPoints.toLocaleString()}
          </span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>所持ポイント: {mockPoints.toLocaleString()} pt</p>
      </TooltipContent>
    </Tooltip>
  );
}

// 通知ベル
function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">通知</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>通知 {unreadCount > 0 && `(${unreadCount}件)`}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>通知</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={`flex flex-col items-start gap-1 ${
              !notification.read ? "bg-accent/50" : ""
            }`}
          >
            <span className="text-sm">{notification.title}</span>
            <span className="text-xs text-muted-foreground">
              {notification.time}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/home/notifications"
            className="w-full text-center text-sm text-primary"
          >
            すべての通知を見る
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ヘルプボタン
export function HelpButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <Link href="/tutorial">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">ヘルプ・チュートリアル</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>ヘルプ・チュートリアル</p>
      </TooltipContent>
    </Tooltip>
  );
}

// お試し利用ボタン
// お試し利用ボタン
export function TrialButton() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleLocalModeStart = () => {
    startTransition(() => {
      // ローカルモード用クッキーを設定 (有効期限: 1年)
      document.cookie =
        "local_mode=true; path=/; max-age=31536000; SameSite=Lax";
      // オンボーディングの起点へ遷移
      router.push("/beginning-country");
      router.refresh();
    });
  };

  return (
    <Button
      className="group h-10 px-5 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all shadow-md hover:shadow-emerald-500/30 hover:scale-105 flex items-center gap-2 hidden sm:flex"
      onClick={handleLocalModeStart}
      disabled={isPending}
    >
      <span className="leading-none pt-0.5">
        {isPending ? "準備中..." : "お試し体験"}
      </span>
      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
}

// 登録/ログインボタン
export function LoginButton() {
  return (
    <Button
      className="group h-10 px-5 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-md shadow-indigo-500/20 hover:scale-105 flex items-center gap-2"
      asChild
    >
      <Link href="/login">
        <span className="leading-none pt-0.5">メンバー登録 / ログイン</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  );
}

// メインヘッダーコンポーネント
export function GlobalHeader({
  showSidebarTrigger = true,
}: {
  showSidebarTrigger?: boolean;
}) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    // Check initial session
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isTrial, setIsTrial] = React.useState(false);

  React.useEffect(() => {
    // Check trial mode on mount
    const trialData = TrialStorage.load();
    if (trialData?.rootAccount) {
      setIsTrial(true);
    }
  }, []);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
        {/* 左側: サイドバートリガー & ロゴエリア */}
        <div className="flex items-center gap-2">
          {showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
          {isTrial && <TrialStatusBadge />}
          {process.env.NODE_ENV === "development" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Link href="/dev-dashboard">
                    <MonitorSmartphone className="h-4 w-4" />
                    <span className="sr-only">Dev Dashboard</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dev Dashboard (Development Only)</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* 中央: 検索バー (ログイン時のみ) */}
        <div className="flex-1 flex justify-center px-4">
          {!loading && user && <HeaderSearch />}
        </div>

        {/* 右側: ユーティリティ群 */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {/* 共通ボタン */}
              <AdToggle />
              <LanguageToggle />
              <ThemeToggle />
              <HelpButton />

              <Separator
                orientation="vertical"
                className="mx-2 h-4 hidden sm:block"
              />

              {/* ユーザー状態による分岐 */}
              {user ? (
                <>
                  <PointsDisplay />
                  <NotificationBell />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <TrialButton />
                  <LoginButton />
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
