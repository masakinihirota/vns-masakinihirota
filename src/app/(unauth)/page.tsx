// import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ModeToggle } from "@/app/ModeTogglePage/mode-toggle";

export default function Home() {
  // 翻訳
  const t = useTranslations("HomePage");
  const t2 = useTranslations("AppLayout");

  return (
    <div className="">
      <main className=""></main>
      {/* 認証ページへ */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <h1>TOPページ</h1>
          {/* 言語スイッチ */}
          <div className="mb-4">
            <LocaleSwitcher />
          </div>
          {/* 挨拶文(言語変更の確認) */}
          <h2>{t("title")}</h2>
          <h2>{t2("home")}</h2>
          {/* ダークモードボタン */}
          <Link href="./ModeTogglePage">ModeTogglePage</Link>
          <div />
          {/* ToggleButton */}
          <ModeToggle />
          <p>認証 ログインページへ</p>
          <Link href="/login">ログインページへ</Link>
          <div />
          {/* ログアウト */}
          <Link href="/logout">ログアウトページへ</Link>
          <div />
          {/* 言語ページ */}
          <Link href="/lang">言語ページ</Link>
        </div>
        {/* Hono */}
        <Link href="/hono">Honoページへ </Link>
      </div>

      <footer className=""></footer>
    </div>
  );
}
