"use client";

import {
  ArrowRight,
  Bell,
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
import { WalletBadge } from "@/components/points/wallet-badge";
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
import { useSession } from "@/lib/auth-client";
import { TrialStorage } from "@/lib/trial-storage";
import { TrialOnboardingBackButton } from "../trial-onboarding-back-button/TrialOnboardingBackButton";
import { TrialStatusBadge } from "../trial-status-badge/TrialStatusBadge";

// モックデータ
const mockNotifications = [
  { id: "1", title: "新しいマッチングがあります", time: "5分前", read: false },
  { id: "2", title: "作品にいいねがつきました", time: "1時間前", read: false },
  { id: "3", title: "プロフィールが更新されました", time: "昨日", read: true },
];

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

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
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
  iconPosition?: "left" | "right";
  loading?: boolean;
  href?: string;
  prefetch?: boolean;
}

const VNSButton = React.forwardRef<HTMLButtonElement, VNSButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "left",
      className = "",
      loading = false,
      href,
      prefetch,
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
      primary:
        "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5",
      emerald:
        "bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 hover:-translate-y-0.5",
      indigo:
        "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/40 hover:-translate-y-0.5",
      secondary:
        "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40",
      ghost:
        "bg-transparent text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10",
      persona:
        "bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-cyan-500/50 hover:text-cyan-400 shadow-[4px_4px_0px_0px_rgba(39,39,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(6,182,212,0.5)] active:shadow-none translate-x-[-2px] translate-y-[-2px] active:translate-x-0 active:translate-y-0",
      warm: "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300",
    };

    const content = (
      <>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        {Icon && iconPosition === "left" && (
          <Icon
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
            className="relative z-10"
          />
        )}
        <span className="relative z-10">{children}</span>
        {Icon && iconPosition === "right" && (
          <Icon
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
            className="relative z-10"
          />
        )}
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
          prefetch={prefetch}
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

export function TrialButton() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  React.useEffect(() => {
    router.prefetch("/home-trial");
  }, [router]);

  const handleLocalModeStart = () => {
    startTransition(() => {
      document.cookie =
        "local_mode=true; path=/; max-age=31536000; SameSite=Lax";
      router.push("/home-trial");
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
      iconPosition="right"
      className="hidden sm:inline-flex"
    >
      {isPending ? "準備中..." : "お試し体験"}
    </VNSButton>
  );
}

export function LoginButton() {
  return (
    <VNSButton
      variant="indigo"
      icon={ArrowRight}
      iconPosition="right"
      href="/login"
      prefetch={true}
    >
      メンバー登録 / ログイン
    </VNSButton>
  );
}

export function GlobalHeader({
  showSidebarTrigger = true,
  isPublic = false,
}: {
  showSidebarTrigger?: boolean;
  isPublic?: boolean;
}) {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const loading = isPending;

  const [isTrial, setIsTrial] = React.useState(false);

  React.useEffect(() => {
    const trialData = TrialStorage.load();
    if (trialData?.rootAccount) {
      setIsTrial(true);
    }
  }, []);

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
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

        <div className="flex-1 flex justify-center px-4">
          {!loading && user && <HeaderSearch />}
        </div>

        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {!isPublic && user && user.id ? (
                <>
                  <WalletBadge />
                  <NotificationBell />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <TrialButton />
                  <LoginButton />
                </div>
              )}

              <Separator
                orientation="vertical"
                className="mx-2 h-4 hidden sm:block"
              />

              <AdToggle />
              <LanguageToggle />
              <ThemeToggle />
              <HelpButton />
            </>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
