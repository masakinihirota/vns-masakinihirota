import Link from "next/link";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { TrialButton } from "./trial-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      {/* プレミアム感を出すための上部アクセント線 */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* レフト/ロゴ */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              VNS <span className="text-indigo-500">Antigravity</span>
            </span>
          </Link>
        </div>

        {/* ライト/アクション */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <LanguageToggle />
          <ThemeToggle />

          {/* お試し・ログインエリア（重要アクション） */}
          <div className="flex items-center space-x-2 border-l pl-2 sm:pl-4 ml-2 sm:ml-4">
            <TrialButton />
            {/* <AuthButton /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
