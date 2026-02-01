"use client";

import { type User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Coins,
  Globe,
  HelpCircle,
  Megaphone,
  MonitorSmartphone,
  Moon,
  Search,
  Sun,
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
import { TrialOnboardingBackButton } from "../trial-onboarding-back-button/TrialOnboardingBackButton";
import { TrialStatusBadge } from "../trial-status-badge/TrialStatusBadge";

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

// 解説ボタン（チュートリアルキーワード）
export function TutorialKeywordButton() {
  "use client";
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [unlockedIds, setUnlockedIds] = React.useState<string[]>([]);
  const [learnedIds, setLearnedIds] = React.useState<string[]>([]);
  const [manager, setManager] = React.useState<any>(null);

  // キーワード状態を監視して未読数を計算
  React.useEffect(() => {
    // dynamic importでチュートリアル状態を取得
    const updateUnreadCount = async () => {
      try {
        const { getGameStateManager } = await import(
          "@/components/tutorial/state"
        );
        const gameManager = getGameStateManager();
        setManager(gameManager);
        
        const state = gameManager.getState();
        setUnlockedIds(state.unlockedKeywordIds);
        setLearnedIds(state.learnedKeywordIds);
        const unread =
          state.unlockedKeywordIds.length - state.learnedKeywordIds.length;
        setUnreadCount(Math.max(0, unread));

        // 状態変更を監視
        const unsubscribe = gameManager.subscribe((newState: any) => {
          setUnlockedIds(newState.unlockedKeywordIds);
          setLearnedIds(newState.learnedKeywordIds);
          const newUnread =
            newState.unlockedKeywordIds.length -
            newState.learnedKeywordIds.length;
          setUnreadCount(Math.max(0, newUnread));
        });

        return unsubscribe;
      } catch (error) {
        // チュートリアルモジュールが利用できない場合はスキップ
        console.debug("Tutorial state not available", error);
      }
    };

    const cleanup = updateUnreadCount();
    return () => {
      void cleanup.then((fn) => fn?.());
    };
  }, []);

  const handleLearn = (keywordId: string) => {
    if (manager) {
      manager.learnKeyword(keywordId);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent transition-colors relative"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              <BookOpen className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium hidden sm:inline">重要キーワード</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            重要キーワードの解説
            {unreadCount > 0 && ` (${unreadCount}件未読)`}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Dynamic import to avoid SSR issues */}
      {isOpen && (
        <React.Suspense fallback={null}>
          {React.createElement(
            require("@/components/tutorial/keyword-modal").KeywordModal,
            {
              isOpen,
              onClose: () => setIsOpen(false),
              unlockedIds,
              learnedIds,
              onLearn: handleLearn,
            }
          )}
        </React.Suspense>
      )}
    </>
  );
}

// VNS Button Components Showcase
// * コンセプト:
// 1. Oasis (Cyan/Blue) - 癒やしと潤い
// 2. Shield (Rounded/Glass) - 保護と安心
// 3. Drift (Animation) - ゆるやかな遷移

interface VNSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "persona"
    | "warm"
    | "emerald"
    | "indigo";
  size?: "sm" | "md" | "lg" | "icon";
  icon?: React.ElementType;
  loading?: boolean;
  href?: string;
}

const VNSButton = React.forwardRef<HTMLButtonElement, VNSButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      className = "",
      loading = false,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group";

    const sizes = {
      sm: "px-4 py-1.5 text-sm rounded-xl gap-2",
      md: "px-6 py-2.5 text-base rounded-2xl gap-2",
      lg: "px-8 py-4 text-lg rounded-[2rem] gap-3",
      icon: "p-2.5 rounded-2xl",
    };

    const variants = {
      // 1. Oasis Primary: シアンの発光と深いグラデーション
      primary:
        "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5",

      // Customized for Trial (Emerald)
      emerald:
        "bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:-translate-y-0.5",

      // Customized for Login (Indigo)
      indigo:
        "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/40 hover:-translate-y-0.5",

      // 2. Shield Secondary: ガラスの質感と境界線
      secondary:
        "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40",

      // 3. Drift Ghost: 背景なし、ホバーで光が走る
      ghost:
        "bg-transparent text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10",

      // 4. Persona (Thousand Masks): 奥行きのある多層レイヤー風
      persona:
        "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-400 shadow-[4px_4px_0px_0px_rgba(39,39,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(6,182,212,0.5)] active:shadow-none translate-x-[-2px] translate-y-[-2px] active:translate-x-0 active:translate-y-0",

      // 5. Danger/Alert: オアシスの赤（警告ではなく「熱量」）
      warm: "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300",
    };

    const content = (
      <>
        {/* ホバー時の光の反射エフェクト */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

        {Icon && (
          <Icon
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
            className="relative z-10"
          />
        )}
        <span className="relative z-10">{children}</span>

        {loading && (
          <div className="absolute inset-0 bg-inherit flex items-center justify-center z-20">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {content}
      </button>
    );
  }
);
VNSButton.displayName = "VNSButton";

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
      router.push("/onboarding-trial/choice");
      router.refresh();
    });
  };

  return (
    <VNSButton
      variant="emerald"
      onClick={handleLocalModeStart}
      disabled={isPending}
      loading={isPending}
      icon={ArrowRight}
      className="hidden sm:inline-flex"
    >
      {isPending ? "準備中..." : "お試し体験"}
    </VNSButton>
  );
}

// 登録/ログインボタン
export function LoginButton() {
  return (
    <VNSButton variant="indigo" icon={ArrowRight} href="/login">
      メンバー登録 / ログイン
    </VNSButton>
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
          <TrialOnboardingBackButton />
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
              {/* 解説ボタン（左側に少し離して配置） */}
              <TutorialKeywordButton />
              
              <Separator
                orientation="vertical"
                className="mx-2 h-4 hidden sm:block"
              />

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
