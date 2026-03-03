import Link from "next/link";
import { AuthButton } from "./auth-button";
import { AdsToggle } from "./ads-toggle";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { TrialButton } from "./trial-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/40">
      {/* プレミアム感を出すための上部アクセント線 */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* ロゴエリア */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              VNS <span className="text-indigo-500">Antigravity</span>
            </span>
          </Link>
        </div>

        {/* アクションエリア: 右配置 */}
        <div className="flex items-center gap-4">
          {/* 設定系コントロール */}
          <AdsToggle />
          <LanguageToggle />
          <ThemeToggle />

          {/* 区切り線 */}
          <div className="h-6 w-px bg-border" />

          {/* 認証アクション: AuthButton（ログイン/アカウント）か TrialButton（お試し） */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
