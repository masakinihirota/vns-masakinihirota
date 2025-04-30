// import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ModeToggle } from "@/app/ModeTogglePage/mode-toggle";
import Navbar03Page from "@/components/shadcnui-blocks/navbar-03/navbar-03";
import Hero01 from "@/components/shadcnui-blocks/hero-01";

export default function Home() {
  // 翻訳
  const t = useTranslations("HomePage");
  const t2 = useTranslations("AppLayout");

  return (
    <>
      <Navbar03Page />
      <Hero01 />
      <main className="">
        {/* 認証ページへ */}
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
      </main>
      <footer className=""></footer>
    </>
  );
}
